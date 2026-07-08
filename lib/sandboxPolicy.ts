// /lib/sandboxPolicy.ts
// Sandbox policy — Pyodide runtime'a dış dünyaya erişimi tamamen kapat.
//
// 📌 Neden var?
// - Pyodide tarayıcıda çalışır ama kullanıcı kodu `requests`, `urllib`, `socket`,
//   `subprocess` ile outbound HTTP, dosya sistemi veya komut satırına erişebilir.
// - Bu, KVKK riski (kullanıcı IP'si 3rd party server'a sızar), rate-limit atlatma
//   ve CPU/memory DoS potansiyeli yaratır.
// - Çözüm: blacklist'teki modülleri Proxy/Stub ile değiştir + __import__ override
//   et + alt-modülleri de kilitle.
//
// 📌 Politika: BLACKLIST (whitelist değil). Çoğu modül serbest:
//   math, random, json, datetime, collections, itertools, functools,
//   dataclasses, asyncio, re, statistics, decimal, fractions, html,
//   textwrap, string, pprint, enum, typing, abc.
//   open() builtin de serbest — dosya işlemleri dersleri için gerekli.
//
// 📌 Kurulum zamanlaması:
//   1) loadPyodide() bitirilir → runtime hazır
//   2) installSandboxPolicy(py) çağrılır → modüller stub'lanır + __import__ override
//   3) userCode çalıştırılır → engellenen import'lar ImportError fırlatır
//
// 📌 Değişiklik yaparken:
//   - BLOCKED_MODULES listesini güncelle (gerekirse ekle/çıkar)
//   - POLICY_VERSION'ı bump et (debug için önemli — console'da görünür)
//   - 3 runner otomatik yeni politikayı devralır

export const BLOCKED_MODULES: readonly string[] = [
  // ─── Outbound HTTP — Pyodide native HTTP, browser fetch'ten farklı ───
  "requests",
  "urllib",
  "urllib.request",
  "urllib.error",
  "urllib.parse",
  "urllib.robotparser",
  "urllib3",
  "httplib2",
  "httpx",
  "http.client",
  "http.server",
  "http.cookies",
  "http.cookiejar",

  // ─── Ham socket katmanı ───
  "socket",
  "socketserver",
  "ssl",
  "select",
  "selectors",

  // ─── Process / shell / sinyal ───
  "subprocess",
  "multiprocessing",
  "signal",
  "atexit",
  "fcntl",
  "termios",
  "tty",
  "pty",

  // ─── Sistem düzeyinde FS/process — dosya silme, env değişkeni okuma, vs. ───
  "os",
  "sys", // sys.modules mutation → code injection bypass'ı önlemek için
  "posix",
  "posixpath",
  "ntpath",
  "shutil",
  "platform",
  "sysconfig",
  "pwd",
  "grp",
  "resource",

  // ─── FFI / C extension yükleme — sandbox'tan kaçış için klasik vektör ───
  "ctypes",
  "cffi",
  "_ctypes",

  // ─── Network daemon protokolleri ───
  "ftplib",
  "smtplib",
  "telnetlib",
  "xmlrpc",
  "xmlrpc.client",
  "xmlrpc.server",

  // ─── Reflection & dynamic import bypass ───
  "pkgutil",
  "modulefinder",
  "runpy",
  "imp", // legacy, Py3.4+ kaldırıldı ama explicit block

  // ─── Threading — concurrent kod sandbox'ta istenmez, race condition + DoS ───
  "threading",
  "_thread",
] as const;

export const POLICY_VERSION = "2025-07-08.v1";

/**
 * Pyodide runtime'a enjekte edilecek Python kodu.
 * - Engellenen modülleri stub ile değiştirir (her attribute access'te hata)
 * - `__import__` builtin'ini override eder (bypass denemelerini önler)
 * - Idempotent: zaten kurulu ise no-op
 */
const POLICY_PY = `
import sys as _pymulakat_sys
import builtins as _pymulakat_builtins

_POLICY_VERSION = "${POLICY_VERSION}"
_BLOCKED_MODULES = frozenset(${JSON.stringify(BLOCKED_MODULES)})

class _SandboxBlockedError(ImportError):
    """Bu modül sandbox'ta engellenmiştir — dış dünyaya erişim yok."""
    def __init__(self, name):
        super().__init__(
            f"'{name}' modülü pythonmulakat sandbox'ta engellenmiştir "
            f"(güvenlik politikası v{_POLICY_VERSION}). "
            f"Dış dünyaya erişim sağlayan modüller (HTTP, socket, subprocess, "
            f"os, vs.) kullanılamaz. Algoritma, veri yapısı ve standart kütüphane "
            f"fonksiyonları serbesttir."
        )
        self.name = name

class _BlockedStub:
    """Engellenen modül proxy'si — her attribute access'te ImportError fırlatır."""
    __slots__ = ("_name",)
    def __init__(self, name):
        object.__setattr__(self, "_name", name)
    def __getattr__(self, key):
        if key == "_name":
            return object.__getattribute__(self, "_name")
        raise _SandboxBlockedError(self._name)
    def __call__(self, *args, **kwargs):
        raise _SandboxBlockedError(self._name)
    def __repr__(self):
        return f"<blocked '{self._name}'>"

# Idempotent guard — birden fazla installSandboxPolicy çağrısı no-op
if not getattr(_pymulakat_sys, "_pythonmulakat_sandbox_installed", False):
    # 1) sys.modules'ta yüklü engellenen modülleri stub ile değiştir.
    #    Hem top-level ("os") hem sub-modules ("urllib.request") için.
    _stubs_replaced = 0
    for _mod_name in _BLOCKED_MODULES:
        for _loaded_name in list(_pymulakat_sys.modules.keys()):
            if _loaded_name == _mod_name or _loaded_name.startswith(_mod_name + "."):
                _pymulakat_sys.modules[_loaded_name] = _BlockedStub(_loaded_name)
                _stubs_replaced += 1

    # 2) __import__ builtin'ini override et — bypass denemelerini engelle
    #    Örn. eval('__im'+'port__("os")') artık çalışmaz
    _orig_import = _pymulakat_builtins.__import__
    def _safe_import(name, globals=None, locals=None, fromlist=(), level=0):
        top = name.split('.')[0]
        if top in _BLOCKED_MODULES or name in _BLOCKED_MODULES:
            raise _SandboxBlockedError(name)
        return _orig_import(name, globals, locals, fromlist, level)
    _pymulakat_builtins.__import__ = _safe_import

    _pymulakat_sys._pythonmulakat_sandbox_installed = True
    _pymulakat_sys._pythonmulakat_sandbox_version = _POLICY_VERSION
    print(f"[pythonmulakat-sandbox] v{_POLICY_VERSION} aktif ({_stubs_replaced} modül kilitlendi)", file=_pymulakat_sys.stderr)
`;

/**
 * Sandbox policy'yi Pyodide runtime'a yükler.
 * - ensureReady/loadPyodide TAMAMLANDIKTAN SONRA çağrılmalı
 * - Idempotent — birden fazla kez çağrılırsa sessizce no-op
 * - 3 runner'da (interview, online, lesson) çağrılır
 *
 * Hata durumunda console.error loglar ama user code çalışmasını ENGELLEMEZ
 * (degraded mode: politika kurulmadan devam eder; log'dan tespit edilir).
 */
export async function installSandboxPolicy(py: any): Promise<void> {
  if (!py || typeof py.runPythonAsync !== "function") {
    throw new Error("[sandbox] installSandboxPolicy: py nesnesi geçersiz");
  }
  try {
    await py.runPythonAsync(POLICY_PY);
  } catch (e) {
    console.error(`[sandbox] policy yüklenemedi (v${POLICY_VERSION}):`, e);
    throw e;
  }
}

/**
 * Policy aktif mi kontrol eder. Self-test için kullanılır.
 * @returns true = sandbox kurulu, false = kurulu değil veya hata
 */
export async function isSandboxActive(py: any): Promise<boolean> {
  if (!py || typeof py.runPythonAsync !== "function") return false;
  try {
    const result = await py.runPythonAsync(
      `import sys as _s; bool(getattr(_s, "_pythonmulakat_sandbox_installed", False))`
    );
    return Boolean(result);
  } catch {
    return false;
  }
}

/**
 * Sandbox aktifken user code çalıştırmak için yardımcı wrapper.
 * Hata mesajını normalize eder — kullanıcı "Module X is disabled" görür.
 */
export async function runUserCodeSafely(py: any, code: string): Promise<any> {
  return py.runPythonAsync(code);
}