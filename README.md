# 🐍 PythonMulakat — Frontend

Python mülakat hazırlık platformu. Next.js 16 + React 19 + Supabase Auth + Tailwind v4.

## ✨ Özellikler

- 🔐 **Tam auth akışı** — Supabase ile sign up, login, magic link, OAuth, şifre sıfırlama, email doğrulama
- 🧪 **Test case motoru** — Tarayıcıda Pyodide ile Python çalıştırma, anlık test feedback
- 🎨 **Modern UI** — Dark theme, framer-motion animasyonları, sonner toast'lar, Monaco editor
- 📱 **Responsive** — Hem desktop hem mobil için optimize edilmiş workspace
- 🐦 **Sosyal paylaşım** — Başarı sonrası syntax-highlighted kod + Twitter Web Intent (ücretsiz)

## 🚀 Hızlı Başlangıç

```bash
npm install
cp .env.example .env.local
# .env.local'ı düzenle, Supabase key'lerini yaz
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) aç.

## 🏗️ Stack

| Teknoloji | Versiyon |
|---|---|
| Next.js | 16.2.6 |
| React | 19.2.4 |
| TypeScript | 6.0.3 |
| Tailwind CSS | 4.1.11 |
| Supabase SSR | 0.12.0 |
| Monaco Editor | 4.7.0 |
| Pyodide | 0.29.4 |
| Framer Motion | 12.40.0 |

## 📂 Yapı

```
frontend/
├── app/
│   ├── auth/             # Auth callback, forgot/reset password
│   ├── interviews/       # Workspace (desktop + mobile client)
│   ├── login/
│   ├── register/
│   ├── profile/
│   └── layout.tsx
├── components/
│   ├── CodeShareModal.tsx    # 🆕 Syntax highlight + Twitter intent
│   ├── TestCaseDrawer.tsx    # 🆕 Mobil + desktop test görünümü
│   ├── Monaco.tsx
│   ├── Editor.tsx
│   └── GuestBanner.tsx
├── hooks/
│   ├── useSupabaseBrowser.ts  # 🆕 @supabase/ssr browser client
│   ├── useUser.ts             # 🆕 Robust token extraction
│   ├── useAuthGate.ts
│   └── usePyodide.ts
└── api/v2/
    └── questions.ts
```

## 🔐 Auth Akışları

- **Sign up** → Email doğrulama linki (`/auth/callback?type=signup`)
- **Magic link** → Tek tıkla giriş (`/auth/callback?type=magiclink`)
- **OAuth** → Google/GitHub callback (`/auth/callback`)
- **Şifre sıfırlama** → `/auth/forgot-password` → email linki → `/auth/callback?type=recovery` → `/auth/reset-password`

## 🐦 Bedava Twitter Paylaşımı

Twitter Web Intent kullanılır — OAuth gerektirmez, rate limit yok:

```
https://twitter.com/intent/tweet?text=<pre-filled-tweet>
```

Detaylar için `components/CodeShareModal.tsx`'e bak.

## 📦 Deploy

**Vercel:**
```bash
vercel --prod
```

Vercel dashboard'da environment variables'a `.env.example`'teki değerleri ekle.

## 📜 Lisans

MIT