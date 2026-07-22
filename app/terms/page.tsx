import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalShell,
  PartTitle,
  SectionBlock,
  PLATFORM_NAME,
  type Section,
} from "@/components/legal/LegalShared";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description:
    "Python Mulakat kullanıcı sözleşmesi, yapay zeka kullanım koşulları ve platform kullanım şartları.",
};

export default function TermsPage() {
  const sozlesme: Section[] = [
    {
      num: "1.1",
      title: "Sözleşmenin Kapsamı ve Taraflar",
      content: (
        <>
          <p>
            Bu Kullanıcı Sözleşmesi (&quot;Sözleşme&quot;),{" "}
            <strong className="text-zinc-200">{PLATFORM_NAME}</strong>{" "}
            platformunu (&quot;Platform&quot;) kullanan tüm ziyaretçiler ve
            kayıtlı kullanıcılar (&quot;Kullanıcı&quot;) için bağlayıcıdır.
          </p>
          <p>
            Platformu ziyaret ederek ve/veya kayıt olarak Kullanıcı, bu
            Sözleşmenin tüm hükümlerini okuduğunu, anladığını ve kabul ettiğini
            beyan eder. Kişisel verilerin işlenmesine ilişkin kurallar ayrı{" "}
            <Link href="/privacy" className="text-cyan-400 hover:underline">
              Gizlilik Politikası
            </Link>{" "}
            sayfasında yer alır.
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
            Birden fazla kategoride, Türkçe açıklamalı mülakat alıştırmaları.
          </li>
          <li>
            <strong className="text-zinc-200">Tarayıcı tabanlı kod editörü:</strong>{" "}
            Pyodide altyapısı ile kurulum gerektirmeyen Python çalıştırma ortamı.
          </li>
          <li>
            <strong className="text-zinc-200">Otomatik test değerlendirmesi:</strong>{" "}
            Her soru için yazılmış test case&apos;leri, anlık puanlama ve geri
            bildirim.
          </li>
          <li>
            <strong className="text-zinc-200">Uzman rehberler:</strong> Uzun form
            içerikli, SEO uyumlu, Türkçe Python öğretici makaleleri.
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
            Platform, hizmetleri &quot;olduğu gibi&quot; esasıyla sunar.
            Kesintisiz veya hatasız çalışma garantisi vermez.
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
            değildir. Python çalışma zamanı (Pyodide) platformun kendi CDN&apos;i
            üzerinden sunulur.
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
          Platformdaki tüm arayüzler, soru metinleri, test case&apos;leri,
          tasarımlar ve marka unsurları ilgili mevzuat kapsamında korunmaktadır.
          Kullanıcı, Platform içeriklerini yalnızca kişisel ve eğitim amaçlı
          kullanma hakkına sahiptir. İçeriklerin izinsiz çoğaltılması, ticari
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
          olarak sonlandırma hakkını saklı tutar. Hesap kapatıldığında kişisel
          veriler{" "}
          <Link href="/privacy" className="text-cyan-400 hover:underline">
            Gizlilik Politikası
          </Link>{" "}
          kapsamında silinir veya anonimleştirilir.
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
          Bu Sözleşme Türkiye Cumhuriyeti hukukuna tabidir. Sözleşmeden doğacak
          uyuşmazlıklarda Türkiye Cumhuriyeti mahkemeleri ve icra daireleri
          yetkilidir.
        </p>
      ),
    },
  ];

  const yapayZeka: Section[] = [
    {
      num: "2.1",
      title: "Yapay Zeka Destekli Mülakat Soru Platformu",
      content: (
        <p>
          {PLATFORM_NAME}, Python mülakat hazırlığı için{" "}
          <strong className="text-zinc-200">
            yapay zeka destekli bir mülakat soru platformudur
          </strong>
          . Platform üzerinde sunulan tüm mülakat soruları, açıklamaları ve
          örnek çözümler, insan editörler tarafından{" "}
          <strong className="text-zinc-200">
            yapay zeka denetiminden geçirilmiştir
          </strong>
          . Yapay zeka, soru kalitesi, doğruluk ve müfredat uyumluluğu açısından
          denetim aracı olarak kullanılmış; içeriklerin nihai onayı insan
          editörler tarafından verilmiştir.
        </p>
      ),
    },
    {
      num: "2.2",
      title: "AI Feedback (Yapay Zeka Geri Bildirim) Özelliği",
      content: (
        <>
          <p>
            Platform, yazdığınız Python kodunu analiz eden bir{" "}
            <strong className="text-zinc-200">AI Feedback</strong> özelliği
            sunmaktadır. Bu özellik, üçüncü taraf bir büyük dil modeli (LLM)
            olan <strong className="text-zinc-200">DeepSeek V3</strong> üzerinden
            çalışmaktadır. AI Feedback tarafından üretilen tüm yanıtlar, kod
            analizleri ve öneriler{" "}
            <strong className="text-amber-400">
              bilgilendirme amaçlıdır ve bağlayıcı değildir
            </strong>
            .
          </p>
          <p>
            AI Feedback çıktıları; mülakat değerlendirmesi, işe alım kararı veya
            akademik not yerine geçmez. Kullanıcı, AI Feedback çıktılarını kendi
            takdirine göre değerlendireceğini kabul eder.
          </p>
        </>
      ),
    },
    {
      num: "2.3",
      title: "Hukuki Sorumluluk Reddi",
      content: (
        <>
          <p>
            Yapay zeka modelleri, eğitim verilerinin doğası gereği hata
            yapabilir, yanlış veya eksik bilgi üretebilir. {PLATFORM_NAME}, AI
            Feedback çıktılarının doğruluğu, güncelliği veya belirli bir amaca
            uygunluğu konusunda{" "}
            <strong className="text-amber-400">hiçbir garanti vermez</strong>.
          </p>
          <p>Aşağıdaki hallerde {PLATFORM_NAME} sorumlu tutulamaz:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-zinc-400">
            <li>AI Feedback çıktılarının hatalı, yanıltıcı veya eksik olması,</li>
            <li>
              Üçüncü taraf LLM sağlayıcısının (DeepSeek) kesintisi veya hizmet
              değişiklikleri,
            </li>
            <li>
              AI Feedback çıktılarına dayanılarak alınan kararlar (mülakat, iş,
              akademik),
            </li>
            <li>
              Yapay zeka tarafından üretilen kodun üçüncü taraflara ait fikri
              mülkiyet haklarını ihlal etmesi.
            </li>
          </ul>
        </>
      ),
    },
    {
      num: "2.4",
      title: "AI Feedback Veri İşleme",
      content: (
        <>
          <p>
            AI Feedback kullandığınızda, yazdığınız Python kodu ve soruya
            ilişkin meta veriler (soru başlığı, test çıktıları) sunucu tarafında
            DeepSeek API&apos;sine gönderilir. Bu veriler yapay zeka tarafından
            işlenir, yanıt oluşturulur ve size iletilir.
          </p>
          <p>
            Yapay zeka sağlayıcısı (DeepSeek) bu verileri{" "}
            <em>model eğitimi için kullanmaz</em> (API kullanım koşulları
            gereği). Ancak hizmet kesintisi, veri sızıntısı veya üçüncü taraf
            politikası değişikliklerinde {PLATFORM_NAME}&apos;in sorumluluğu
            sınırlıdır. Veri işleme detayları için{" "}
            <Link href="/privacy" className="text-cyan-400 hover:underline">
              Gizlilik Politikası
            </Link>
            &apos;na bakınız.
          </p>
        </>
      ),
    },
    {
      num: "2.5",
      title: "Kendi API Anahtarınız (BYOK)",
      content: (
        <p>
          AI Feedback hizmetini kendi DeepSeek API anahtarınızla (
          <em>BYOK — Bring Your Own Key</em>) kullanabilirsiniz. Bu durumda
          istekler doğrudan sizin anahtarınızla yapılır; platformun günlük 10
          kullanım hakkı kotası uygulanmaz. API anahtarınız yalnızca sizin
          tarayıcınızda saklanır (
          <code className="font-mono text-[12px] text-cyan-300">
            localStorage
          </code>
          ), sunucularımıza iletilmez (yalnızca DeepSeek&apos;e iletilir).
        </p>
      ),
    },
    {
      num: "2.6",
      title: "Kabul Beyanı",
      content: (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mt-3">
          <p className="text-zinc-300 italic">
            &quot;Platform üzerindeki soruların yapay zeka denetiminden
            geçirilmiş olduğunu; AI Feedback özelliğinin bilgilendirme amaçlı,
            bağlayıcı olmayan bir yapay zeka aracı olduğunu; yapay zeka
            çıktılarının doğruluğu konusunda garanti verilmediğini; bu çıktılara
            dayanarak alınan kararlarda sorumluluğun bana ait olduğunu okudum,
            anladım ve kabul ediyorum.&quot;
          </p>
        </div>
      ),
    },
  ];

  return (
    <LegalShell
      badge="Yasal Metin · Kullanım Şartları"
      title="Kullanım Şartları"
      otherHref="/privacy"
      otherLabel="Gizlilik Politikası"
    >
      <PartTitle num="1" title="Kullanıcı Sözleşmesi" color="cyan" />
      <div className="space-y-10 mt-6">
        {sozlesme.map((s) => (
          <SectionBlock key={s.num} {...s} />
        ))}
      </div>

      <div id="bolum-2" className="mt-20">
        <PartTitle
          num="2"
          title="Yapay Zeka Kullanımı ve Sorumluluk Reddi"
          color="amber"
        />
        <div className="space-y-10 mt-6">
          {yapayZeka.map((s) => (
            <SectionBlock key={s.num} {...s} />
          ))}
        </div>
      </div>
    </LegalShell>
  );
}
