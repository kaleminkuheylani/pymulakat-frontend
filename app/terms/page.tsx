import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanıcı Sözleşmesi",
  description:
    "Python Mulakat yapay zeka destekli mülakat soru platformu kullanıcı sözleşmesi, KVKK aydınlatma metni ve açık rıza beyanı.",
};

const LAST_UPDATED = "14 Temmuz 2026";
const PLATFORM_NAME = "Python Mulakat";
const PLATFORM_URL = "https://www.pythonmulakat.com";

interface Section {
  num: string;
  title: string;
  content: React.ReactNode;
}

function SectionBlock({ num, title, content }: Section) {
  return (
    <div className="border-l-2 border-zinc-800 pl-5 hover:border-zinc-600 transition-colors duration-200">
      <p className="font-mono text-[10px] tracking-widest text-zinc-600 mb-2 uppercase">
        {num}
      </p>

      <h2 className="text-[15px] font-semibold text-zinc-200 mb-3">
        {title}
      </h2>

      <div className="text-[14px] leading-relaxed text-zinc-400 space-y-3">
        {content}
      </div>
    </div>
  );
}

function PartTitle({ num, title, color = "cyan" }: { num: string; title: string; color?: string }) {
  return (
    <div className="pt-8 pb-2 border-zinc-900 first:pt-0 first:border-t-0">
      <p className={`font-mono text-[11px] tracking-widest uppercase mb-1 ${
        color === "amber" ? "text-amber-500" : "text-cyan-500"
      }`}>
        BÖLÜM {num}
      </p>
      <h2 className="text-2xl font-bold text-zinc-100">{title}</h2>
    </div>
  );
}

export default function TermsPage() {
  // ─── BÖLÜM 1: KULLANICI SÖZLEŞMESİ ─────────────────────────
  const sozlesme: Section[] = [
    {
      num: "1.1",
      title: "Sözleşmenin Kapsamı ve Taraflar",
      content: (
        <>
          <p>
            Bu Kullanıcı Sözleşmesi ("Sözleşme"),{" "}
            <strong className="text-zinc-200">{PLATFORM_NAME}</strong>{" "}
            platformunu ("Platform") kullanan tüm ziyaretçiler ve kayıtlı
            kullanıcılar ("Kullanıcı") için bağlayıcıdır.
          </p>
          <p>
            Platformu ziyaret ederek ve/veya kayıt olarak Kullanıcı, bu
            Sözleşmenin tüm hükümlerini okuduğunu, anladığını ve kabul ettiğini
            beyan eder.
          </p>
        </>
      ),
    },
    {
      num: "1.2",
      title: "Platformun Kullanıcıya Sundukları",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-zinc-200">İnteraktif Python soruları:</strong>{" "}
            70+ farklı kategoride, Türkçe açıklamalı mülakat alıştırmaları.
          </li>
          <li>
            <strong className="text-zinc-200">Tarayıcı tabanlı kod editörü:</strong>{" "}
            Pyodide altyapısı ile kurulum gerektirmeyen Python çalıştırma
            ortamı.
          </li>
          <li>
            <strong className="text-zinc-200">Otomatik test değerlendirmesi:</strong>{" "}
            Her soru için yazılmış test case'leri, anlık puanlama ve geri
            bildirim.
          </li>
          <li>
            <strong className="text-zinc-200">Uzman rehberler:</strong>{" "}
            Uzun form içerikli, SEO uyumlu, Türkçe Python öğretici
            makaleleri.
          </li>
          <li>
            <strong className="text-zinc-200">Kişisel ilerleme takibi:</strong>{" "}
            Kullanıcı hesabı altında çözülen soruların ve ilerlemenin
            kaydedilmesi.
          </li>
        </ul>
      ),
    },
    {
      num: "1.3",
      title: "Platformun Hakları ve Yükümlülükleri",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Platform, hizmetleri "olduğu gibi" esasıyla sunar. Kesintisiz veya
            hatasız çalışma garantisi vermez.
          </li>
          <li>
            Platform; önceden bildirim yapmaksızın içerik, özellik ve arayüz
            değişiklikleri yapma hakkını saklı tutar.
          </li>
          <li>
            Platform; kötüye kullanım, güvenlik ihlali veya yasa dışı
            faaliyetlerde hesabı askıya alma veya sonlandırma hakkına sahiptir.
          </li>
          <li>
            Platform; üçüncü taraf altyapı servislerinin (Railway, Vercel,
            Supabase, Google Analytics) kesintilerinden doğrudan sorumlu
            değildir. Python çalışma zamanı (Pyodide) platformun kendi CDN'i
            üzerinden sunulur; üçüncü taraf bir kod dağıtım servisine
            (jsDelivr, unpkg vb.) bağımlılık yoktur.
          </li>
        </ul>
      ),
    },
    {
      num: "1.4",
      title: "Kullanıcının Hakları ve Yükümlülükleri",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Kullanıcı, hesap bilgilerinin güvenliğinden ve hesabı üzerinden
            yapılan tüm işlemlerden bizzat sorumludur.
          </li>
          <li>
            Kullanıcı, Platformu aşağıdaki amaçlarla kullanamaz:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Zararlı yazılım geliştirme veya dağıtma</li>
              <li>Yetkisiz erişim girişimleri veya sandbox bypass</li>
              <li>Otomatik yoğun istek gönderme (rate limit aşımı)</li>
              <li>Kripto madenciliği veya kaynak sömürüsü</li>
              <li>Yasa dışı veri toplama veya scraping</li>
              <li>Üçüncü kişilerin haklarını ihlal eden içerik yükleme</li>
            </ul>
          </li>
          <li>
            Kullanıcı, Platformu kullanırken Türkiye Cumhuriyeti yasalarına ve
            genel ahlak kurallarına uymayı taahhüt eder.
          </li>
        </ul>
      ),
    },
    {
      num: "1.5",
      title: "Kod Çalıştırma Ortamı (Sandbox)",
      content: (
        <p>
          Kullanıcının yazdığı Python kodları, sunucularda değil doğrudan
          kullanıcının tarayıcısında çalışan Pyodide tabanlı izole bir ortamda
          yürütülür. Kod çalıştırma ortamı güvenlik katmanları içerse de mutlak
          güvenlik garantisi verilmez. Kullanıcı, çalıştırdığı kodun kendi
          cihazında işleneceğini ve cihaz performansını etkileyebileceğini kabul
          eder.
        </p>
      ),
    },
    {
      num: "1.6",
      title: "Fikri Mülkiyet",
      content: (
        <p>
          Platformdaki tüm arayüzler, soru metinleri, test case'leri, tasarımlar
          ve marka unsurları ilgili mevzuat kapsamında korunmaktadır. Kullanıcı,
          Platform içeriklerini yalnızca kişisel ve eğitim amaçlı kullanma
          hakkına sahiptir. İçeriklerin izinsiz çoğaltılması, ticari
          kullanımı veya yeniden dağıtımı yasaktır.
        </p>
      ),
    },
    {
      num: "1.7",
      title: "Hesap Sonlandırma",
      content: (
        <p>
          Kullanıcı, istediği zaman hesabını kapatma hakkına sahiptir. Platform;
          bu Sözleşmeye aykırılık durumunda hesabı askıya alma veya kalıcı
          olarak sonlandırma hakkını saklı tutar. Hesap kapatıldığında, Kullanıcı
          Sözleşmesi Bölüm 2 (Aydınlatma Metni) kapsamındaki veriler silinir.
        </p>
      ),
    },
    {
      num: "1.8",
      title: "Sorumluluğun Sınırlandırılması",
      content: (
        <p>
          Platform; teknik hata, veri kaybı, tarayıcı çökmesi, performans
          düşüşü, cihaz uyumsuzluğu veya üçüncü taraf servis kesintilerinden
          doğan dolaylı zararlardan sorumluluk kabul etmez. Kullanıcı, Platformu
          kendi sorumluluğu altında kullandığını kabul eder.
        </p>
      ),
    },
    {
      num: "1.9",
      title: "Uygulanacak Hukuk ve Yetki",
      content: (
        <p>
          Bu Sözleşme Türkiye Cumhuriyeti hukukuna tabidir. Sözleşmeden
          doğacak uyuşmazlıklarda Türkiye Cumhuriyeti mahkemeleri ve icra
          daireleri yetkilidir.
        </p>
      ),
    },
  ];

  // ─── BÖLÜM 2: AYDINLATMA METNİ ─────────────────────────────
  const aydinlatma: Section[] = [
    {
      num: "2.1",
      title: "Veri Sorumlusu",
      content: (
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca,
          Kullanıcıların kişisel verilerinin işlenmesinde{" "}
          <strong className="text-zinc-200">{PLATFORM_NAME}</strong> veri
          sorumlusu sıfatıyla hareket etmektedir.
        </p>
      ),
    },
    {
      num: "2.2",
      title: "İşlenen Kişisel Veriler",
      content: (
        <>
          <p>Platform kapsamında aşağıdaki kişisel veriler işlenmektedir:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong className="text-zinc-200">Kimlik bilgileri:</strong>{" "}
              E-posta adresi (hesap oluşturma ve kimlik doğrulama amacıyla).
            </li>
            <li>
              <strong className="text-zinc-200">Hesap bilgileri:</strong>{" "}
              Kullanıcı adı, şifre (şifreler bcrypt algoritması ile
              şifrelenmiş olarak saklanır).
            </li>
            <li>
              <strong className="text-zinc-200">İşlem güvenliği:</strong>{" "}
              IP adresi, oturum bilgileri, cihaz ve tarayıcı bilgileri.
            </li>
            <li>
              <strong className="text-zinc-200">Kullanım verileri:</strong>{" "}
              Çözülen sorular, başarı durumu, deneme sayıları, ilerleme
              istatistikleri, toplam kod çalıştırma (oynama) sayacı
              (<code className="text-zinc-400">play_count</code>).
            </li>
            <li>
              <strong className="text-zinc-200">Kullanıcı kodları:</strong>{" "}
              Platform üzerinde yazılan Python kodları sunucuya gönderilmez ve
              veritabanında saklanmaz. Kodlar yalnızca kullanıcının tarayıcısında
              çalıştırılır; istatistik (test sonucu, süre, ipucu sayısı) kaydı
              tutulur.
            </li>
          </ul>
        </>
      ),
    },
    {
      num: "2.3",
      title: "Kişisel Verilerin İşlenme Amaçları",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Hesap oluşturma, kimlik doğrulama ve oturum yönetimi</li>
          <li>Platform üzerinden sunulan hizmetlerin sağlanması ve iyileştirilmesi</li>
          <li>
            Kullanıcının ilerlemesinin ve performansının takibi, kişiselleştirilmiş
            deneyim sunulması
          </li>
          <li>Teknik sorunların tespiti, hata giderme ve güvenlik sağlama</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          <li>İstatistik ve analiz (anonimleştirilmiş)</li>
        </ul>
      ),
    },
    {
      num: "2.4",
      title: "Verilerin Toplanma Yöntemi ve Hukuki Sebepleri",
      content: (
        <p>
          Veriler; Platform üzerindeki kayıt formu, hesap ayarları, soru çözme
          etkileşimleri ve çerezler (cookies) aracılığıyla otomatik veya
          yarı-otomatik yöntemlerle toplanmaktadır. İşleme hukuki sebepleri:
          sözleşmenin kurulması ve ifası (KVKK md. 5/2-c), veri sorumlusunun
          meşru menfaatleri (KVKK md. 5/2-f) ve açık rıza (KVKK md. 5/1).
        </p>
      ),
    },
    {
      num: "2.5",
      title: "Veri Saklama Süreleri (Retention Policy)",
      content: (
        <>
          <p>
            KVKK md. 5/e ("İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü
            olma") ve md. 7 ("Silme, yok etme veya anonim hale getirme")
            kapsamında veriler aşağıdaki sürelerle sınırlıdır:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong className="text-zinc-200">Kod çalıştırma sayacı (play_count):</strong>{" "}
              Son etkileşimden itibaren <strong>1 yıl</strong> sonra otomatik
              olarak sıfırlanır. Silme talebinde anında silinir.
            </li>
            <li>
              <strong className="text-zinc-200">Soru çözme attempt'leri:</strong>{" "}
              Son etkileşimden itibaren <strong>2 yıl</strong> sonra
              anonimleştirilir. Silme talebinde anında silinir.
            </li>
            <li>
              <strong className="text-zinc-200">IP adresi / log kayıtları:</strong>{" "}
              Güvenlik amacıyla <strong>30 gün</strong> sonra otomatik silinir.
            </li>
            <li>
              <strong className="text-zinc-200">Anonim kullanım istatistikleri
              (Google Analytics):</strong> Google'ın kendi saklama politikasına
              tabidir (IP anonymization aktif).
            </li>
          </ul>
        </>
      ),
    },
    {
      num: "2.5",
      title: "Verilerin Aktarımı",
      content: (
        <>
          <p>
            Kişisel veriler, aşağıdaki alıcı gruplarına aktarılabilir:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong className="text-zinc-200">Altyapı sağlayıcıları:</strong>{" "}
              Supabase (veritabanı ve kimlik doğrulama, ABD), Railway (uygulama
              sunucusu), Vercel (ön yüz barındırma).
            </li>
            <li>
              <strong className="text-zinc-200">Analiz servisleri:</strong>{" "}
              Google Analytics (anonim trafik analizi).
            </li>
            <li>
              <strong className="text-zinc-200">Yasal merciler:</strong>{" "}
              Yetkili kamu kurum ve kuruluşları, talep halinde.
            </li>
          </ul>
          <p className="mt-2">
            Yurt dışı veri aktarımı KVKK md. 9 kapsamında, ilgili ülkedeki
            yeterlilik kararı veya uygun güvenceler çerçevesinde
            gerçekleştirilmektedir.
          </p>
        </>
      ),
    },
    {
      num: "2.6",
      title: "Verilerin Saklama Süresi",
      content: (
        <p>
          Kişisel veriler, işlenme amacının gerektirdiği süre boyunca ve ilgili
          mevzuatın öngördüğü azami süreler dahilinde saklanır. Kullanıcı
          hesabının kapatılması halinde veriler, yasal yükümlülükler saklı
          kalmak kaydıyla, makul bir süre içinde silinir veya anonimleştirilir.
        </p>
      ),
    },
    {
      num: "2.7",
      title: "KVKK Madde 11 Uyarınca Kullanıcı Hakları",
      content: (
        <>
          <p>
            Kullanıcı, KVKK'nın 11. maddesi uyarınca aşağıdaki haklara
            sahiptir:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Kişisel verilerinin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>
              İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını
              öğrenme
            </li>
            <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri öğrenme</li>
            <li>
              Eksik/yanlış işlenen verilerin düzeltilmesini isteme ve
              yapılan işlemlerin üçüncü kişilere bildirilmesini talep etme
            </li>
            <li>
              Şartlar oluştuğunda verilerin silinmesini/yok edilmesini isteme
            </li>
            <li>
              Otomatik sistemlerle analiz sonucu aleyhine sonuç doğan
              durumlarda itiraz etme
            </li>
          </ul>
          <p className="mt-2">
            Bu haklarınızı kullanmak için Platform üzerindeki hesap ayarları
            bölümünden veya aşağıdaki iletişim kanallarından biri ile
            başvurabilirsiniz.
          </p>
        </>
      ),
    },
  ];

  // ─── BÖLÜM 3: AÇIK RIZA METNİ ──────────────────────────────
  const acikRiza: Section[] = [
    {
      num: "3.1",
      title: "Açık Rızanın Kapsamı",
      content: (
        <p>
          Bu bölüm, Platforma kayıt olurken ve hizmetleri kullanırken verdiğiniz
          açık rızanın kapsamını belirler. Açık rıza, KVKK md. 5/1 uyarınca
          belirli bir konuya ilişkin, bilgilendirmeye dayanan ve özgür iradeyle
          açıklanan rızadır.
        </p>
      ),
    },
    {
      num: "3.2",
      title: "Rıza Verilen İşlem Türleri",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-zinc-200">Hesap oluşturma ve yönetimi:</strong>{" "}
            E-posta adresi, kullanıcı adı ve şifre bilgilerinin Platform
            tarafından saklanması.
          </li>
          <li>
            <strong className="text-zinc-200">Hizmet sunumu:</strong>{" "}
            Çözülen soruların, deneme sonuçlarının (başarılı/başarısız test
            sayısı, süre, kullanılan ipucu sayısı) kaydedilmesi.{" "}
            <em className="text-zinc-300">
              Kullanıcının yazdığı Python kodları işlenmez ve saklanmaz. Kod
              çalıştırma işlemi kullanıcının tarayıcısında, kendi cihazında
              gerçekleşir; Python çalışma zamanı (Pyodide) platformun kendi
              CDN'i üzerinden, üçüncü taraf bir kod dağıtım servisine
              başvurulmadan sunulur. Yazılan kod hiçbir sunucuya iletilmez.
            </em>
          </li>
          <li>
            <strong className="text-zinc-200">Güvenlik ve loglama:</strong>{" "}
            IP adresi, oturum ve cihaz bilgilerinin teknik güvenlik amaçlı
            işlenmesi.
          </li>
          <li>
            <strong className="text-zinc-200">Çerez kullanımı:</strong>{" "}
            Oturum çerezleri, tercih çerezleri ve anonim analiz çerezleri
            (Google Analytics) için rıza.
          </li>
          <li>
            <strong className="text-zinc-200">Üçüncü taraf altyapı:</strong>{" "}
            Supabase, Railway ve Vercel'e veri aktarımı için rıza.
          </li>
        </ul>
      ),
    },
    {
      num: "3.3",
      title: "Rızanın Geri Çekilmesi",
      content: (
        <p>
          Kullanıcı, verdiği açık rızayı geri çekme hakkına sahiptir. Rıza
          geri çekildiğinde, geri çekme tarihinden önce yapılan işlemelerin
          hukuka uygunluğu etkilenmez. Rıza geri çekme talebi için hesap
          ayarlarından veya iletişim kanallarından başvurulabilir. Rıza
          geri çekildiğinde hesap kapatılır ve kişisel veriler mevzuat
          çerçevesinde silinir.
        </p>
      ),
    },
    {
      num: "3.4",
      title: "Açık Rıza Beyanı",
      content: (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mt-3">
          <p className="text-zinc-300 italic">
            "Yukarıda yer alan Kullanıcı Sözleşmesi'ni, Aydınlatma Metni'ni ve
            bu Açık Rıza Metni'ni okuduğumu, anladığımı; Platform üzerinden
            sunulan hizmetler kapsamında kişisel verilerimin yukarıda
            belirtilen amaçlarla işlenmesine, saklanmasına ve belirtilen
            üçüncü taraflara aktarılmasına özgür irademle açık rıza
            gösterdiğimi beyan ederim."
          </p>
        </div>
      ),
    },
  ];

  // ─── BÖLÜM 4: YAPAY ZEKA KULLANIMI VE SORUMLULUK REDDİ ─────────────
  // 2026-07-14: AI Feedback özelliği production'a alındı. Aşağıdaki maddeler
  //   - AI feedback disclaimer (tavsiye niteliğinde, bağlayıcı değil)
  //   - Soruların AI denetiminden geçtiği vurgusu
  //   - Hukuki sorumluluk reddi (DeepSeek V3 + 3. parti LLM)
  //   - Veri işleme (kod, prompt) — sunucu taraflı
  const yapayZeka: Section[] = [
    {
      num: "4.1",
      title: "Yapay Zeka Destekli Mülakat Soru Platformu",
      content: (
        <p>
          {PLATFORM_NAME}, Python mülakat hazırlığı için <strong className="text-zinc-200">yapay zeka destekli bir mülakat soru platformudur</strong>.
          Platform üzerinde sunulan tüm mülakat soruları, açıklamaları ve örnek
          çözümler, insan editörler tarafından <strong className="text-zinc-200">yapay zeka denetiminden geçirilmiştir</strong>.
          Yapay zeka, soru kalitesi, doğruluk ve müfredat uyumluluğu açısından
          denetim aracı olarak kullanılmış; içeriklerin nihai onayı insan
          editörler tarafından verilmiştir.
        </p>
      ),
    },
    {
      num: "4.2",
      title: "AI Feedback (Yapay Zeka Geri Bildirim) Özelliği",
      content: (
        <>
          <p>
            Platform, yazdığınız Python kodunu analiz eden bir <strong className="text-zinc-200">AI Feedback</strong> özelliği
            sunmaktadır. Bu özellik, üçüncü taraf bir büyük dil modeli (LLM)
            olan <strong className="text-zinc-200">DeepSeek V3</strong> üzerinden çalışmaktadır. AI Feedback
            tarafından üretilen tüm yanıtlar, kod analizleri ve öneriler
            <strong className="text-amber-400"> bilgilendirme amaçlıdır ve bağlayıcı değildir</strong>.
          </p>
          <p>
            AI Feedback çıktıları; mülakat değerlendirmesi, işe alım kararı
            veya akademik not yerine geçmez. Kullanıcı, AI Feedback
            çıktılarını kendi takdirine göre değerlendireceğini kabul eder.
          </p>
        </>
      ),
    },
    {
      num: "4.3",
      title: "Hukuki Sorumluluk Reddi",
      content: (
        <>
          <p>
            Yapay zeka modelleri, eğitim verilerinin doğası gereği hata
            yapabilir, yanlış veya eksik bilgi üretebilir. {PLATFORM_NAME},
            AI Feedback çıktılarının doğruluğu, güncelliği veya belirli bir
            amaca uygunluğu konusunda <strong className="text-amber-400">hiçbir garanti vermez</strong>.
          </p>
          <p>
            Aşağıdaki hallerde {PLATFORM_NAME} sorumlu tutulamaz:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-zinc-400">
            <li>AI Feedback çıktılarının hatalı, yanıltıcı veya eksik olması,</li>
            <li>Üçüncü taraf LLM sağlayıcısının (DeepSeek) kesintisi veya hizmet değişiklikleri,</li>
            <li>AI Feedback çıktılarına dayanılarak alınan kararlar (mülakat, iş, akademik),</li>
            <li>Yapay zeka tarafından üretilen kodun üçüncü taraflara ait fikri mülkiyet haklarını ihlal etmesi.</li>
          </ul>
        </>
      ),
    },
    {
      num: "4.4",
      title: "AI Feedback Veri İşleme",
      content: (
        <>
          <p>
            AI Feedback kullandığınızda, yazdığınız Python kodu ve soruya
            ilişkin meta veriler (soru başlığı, test çıktıları) sunucu
            tarafında DeepSeek API'sine gönderilir. Bu veriler yapay zeka
            tarafından işlenir, yanıt oluşturulur ve size iletilir.
          </p>
          <p>
            Yapay zeka sağlayıcısı (DeepSeek) bu verileri <em>model eğitimi
            için kullanmaz</em> (API kullanım koşulları gereği). Ancak,
            hizmet kesintisi, veri sızıntısı veya üçüncü taraf politikası
            değişikliklerinde {PLATFORM_NAME}'in sorumluluğu sınırlıdır.
          </p>
        </>
      ),
    },
    {
      num: "4.5",
      title: "Kendi API Anahtarınız (BYOK)",
      content: (
        <p>
          AI Feedback hizmetini kendi DeepSeek API anahtarınızla
          (<em>BYOK — Bring Your Own Key</em>) kullanabilirsiniz. Bu durumda
          istekler doğrudan sizin anahtarınızla yapılır; aylık ücretsiz
          hak sınırı uygulanmaz. API anahtarınız yalnızca sizin tarayıcınızda
          saklanır (<code className="font-mono text-[12px] text-cyan-300">localStorage</code>), sunucularımıza iletilmez
          (yalnızca DeepSeek'e iletilir).
        </p>
      ),
    },
    {
      num: "4.6",
      title: "Kabul Beyanı",
      content: (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mt-3">
          <p className="text-zinc-300 italic">
            "Platform üzerindeki soruların yapay zeka denetiminden geçirilmiş
            olduğunu; AI Feedback özelliğinin bilgilendirme amaçlı, bağlayıcı
            olmayan bir yapay zeka aracı olduğunu; yapay zeka çıktılarının
            doğruluğu konusunda garanti verilmediğini; bu çıktılara dayanarak
            alınan kararlarda sorumluluğun bana ait olduğunu okudum, anladım
            ve kabul ediyorum."
          </p>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="font-mono text-[11px] text-zinc-500">
            Yasal Metinler · Güncel
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-zinc-100 mb-2">
          Kullanıcı Sözleşmesi, Aydınlatma ve Açık Rıza Metni
        </h1>
        <p className="font-mono text-[13px] text-zinc-600 mb-14">
          Son güncelleme: {LAST_UPDATED}
        </p>

        {/* BÖLÜM 1 */}
        <PartTitle num="1" title="Kullanıcı Sözleşmesi" color="cyan" />
        <div className="space-y-10 mt-6">
          {sozlesme.map((s) => (
            <SectionBlock key={s.num} {...s} />
          ))}
        </div>

        {/* BÖLÜM 2 */}
        <div className="mt-20">
          <PartTitle num="2" title="Aydınlatma Metni (KVKK md. 10)" color="amber" />
          <div className="space-y-10 mt-6">
            {aydinlatma.map((s) => (
              <SectionBlock key={s.num} {...s} />
            ))}
          </div>
        </div>

        {/* BÖLÜM 3 */}
        <div className="mt-20">
          <PartTitle num="3" title="Açık Rıza Metni (KVKK md. 5/1)" color="cyan" />
          <div className="space-y-10 mt-6">
            {acikRiza.map((s) => (
              <SectionBlock key={s.num} {...s} />
            ))}
          </div>
        </div>

        {/* BÖLÜM 4 — 2026-07-14: Yapay Zeka Kullanımı ve Sorumluluk Reddi */}
        <div className="mt-20">
          <PartTitle num="4" title="Yapay Zeka Kullanımı ve Sorumluluk Reddi" color="amber" />
          <div className="space-y-10 mt-6">
            {yapayZeka.map((s) => (
              <SectionBlock key={s.num} {...s} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <hr className="border-zinc-900 my-12" />

        <p className="font-mono text-[11px] text-zinc-700">
          Bu metinler 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili
          mevzuat kapsamında hazırlanmıştır. · Türkiye Cumhuriyeti
        </p>
      </div>
    </main>
  );
}