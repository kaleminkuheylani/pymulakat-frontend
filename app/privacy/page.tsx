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
  title: "Gizlilik Politikası",
  description:
    "Python Mulakat gizlilik politikası, KVKK aydınlatma metni, açık rıza, çerez ve Google AdSense reklam verisi işleme kuralları.",
};

export default function PrivacyPage() {
  const aydinlatma: Section[] = [
    {
      num: "1.1",
      title: "Veri Sorumlusu",
      content: (
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
          uyarınca, Kullanıcıların kişisel verilerinin işlenmesinde{" "}
          <strong className="text-zinc-200">{PLATFORM_NAME}</strong> veri
          sorumlusu sıfatıyla hareket etmektedir.
        </p>
      ),
    },
    {
      num: "1.2",
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
              Kullanıcı adı, şifre (şifreler bcrypt algoritması ile şifrelenmiş
              olarak saklanır).
            </li>
            <li>
              <strong className="text-zinc-200">İşlem güvenliği:</strong> IP
              adresi, oturum bilgileri, cihaz ve tarayıcı bilgileri.
            </li>
            <li>
              <strong className="text-zinc-200">Kullanım verileri:</strong>{" "}
              Çözülen sorular, başarı durumu, deneme sayıları, ilerleme
              istatistikleri, toplam kod çalıştırma (oynama) sayacı (
              <code className="text-zinc-400">play_count</code>).
            </li>
            <li>
              <strong className="text-zinc-200">Kullanıcı kodları:</strong>{" "}
              Platform üzerinde yazılan Python kodları sunucuya gönderilmez ve
              veritabanında saklanmaz. Kodlar yalnızca kullanıcının
              tarayıcısında çalıştırılır; istatistik (test sonucu, süre, ipucu
              sayısı) kaydı tutulur. AI Feedback kullanıldığında kod, analiz
              amacıyla DeepSeek API&apos;sine iletilebilir.
            </li>
          </ul>
        </>
      ),
    },
    {
      num: "1.3",
      title: "Kişisel Verilerin İşlenme Amaçları",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Hesap oluşturma, kimlik doğrulama ve oturum yönetimi</li>
          <li>
            Platform üzerinden sunulan hizmetlerin sağlanması ve iyileştirilmesi
          </li>
          <li>
            Kullanıcının ilerlemesinin ve performansının takibi,
            kişiselleştirilmiş deneyim sunulması
          </li>
          <li>Teknik sorunların tespiti, hata giderme ve güvenlik sağlama</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          <li>İstatistik ve analiz (anonimleştirilmiş)</li>
          <li>Reklam gösterimi ve reklam performans ölçümü (Google AdSense)</li>
        </ul>
      ),
    },
    {
      num: "1.4",
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
      num: "1.5",
      title: "Veri Saklama Süreleri (Retention Policy)",
      content: (
        <>
          <p>
            KVKK md. 5/e ve md. 7 kapsamında veriler aşağıdaki sürelerle
            sınırlıdır:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong className="text-zinc-200">
                Kod çalıştırma sayacı (play_count):
              </strong>{" "}
              Son etkileşimden itibaren <strong>1 yıl</strong> sonra otomatik
              olarak sıfırlanır. Silme talebinde anında silinir.
            </li>
            <li>
              <strong className="text-zinc-200">
                Soru çözme attempt&apos;leri:
              </strong>{" "}
              Son etkileşimden itibaren <strong>2 yıl</strong> sonra
              anonimleştirilir. Silme talebinde anında silinir.
            </li>
            <li>
              <strong className="text-zinc-200">
                IP adresi / log kayıtları:
              </strong>{" "}
              Güvenlik amacıyla <strong>30 gün</strong> sonra otomatik silinir.
            </li>
            <li>
              <strong className="text-zinc-200">
                Anonim kullanım istatistikleri (Google Analytics):
              </strong>{" "}
              Google&apos;ın kendi saklama politikasına tabidir (IP
              anonymization aktif).
            </li>
          </ul>
        </>
      ),
    },
    {
      num: "1.6",
      title: "Verilerin Aktarımı",
      content: (
        <>
          <p>Kişisel veriler, aşağıdaki alıcı gruplarına aktarılabilir:</p>
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
              <strong className="text-zinc-200">Reklam servisleri:</strong>{" "}
              Google AdSense / Google LLC (reklam gösterimi ve ölçüm).
            </li>
            <li>
              <strong className="text-zinc-200">Yapay zeka servisleri:</strong>{" "}
              DeepSeek (yalnızca AI Feedback kullanıldığında kod ve meta veri).
            </li>
            <li>
              <strong className="text-zinc-200">Yasal merciler:</strong> Yetkili
              kamu kurum ve kuruluşları, talep halinde.
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
      num: "1.7",
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
      num: "1.8",
      title: "KVKK Madde 11 Uyarınca Kullanıcı Hakları",
      content: (
        <>
          <p>
            Kullanıcı, KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara
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
              Eksik/yanlış işlenen verilerin düzeltilmesini isteme ve yapılan
              işlemlerin üçüncü kişilere bildirilmesini talep etme
            </li>
            <li>
              Şartlar oluştuğunda verilerin silinmesini/yok edilmesini isteme
            </li>
            <li>
              Otomatik sistemlerle analiz sonucu aleyhine sonuç doğan durumlarda
              itiraz etme
            </li>
          </ul>
          <p className="mt-2">
            Bu haklarınızı kullanmak için Platform üzerindeki hesap ayarları
            bölümünden veya iletişim kanallarından biri ile başvurabilirsiniz.
          </p>
        </>
      ),
    },
  ];

  const acikRiza: Section[] = [
    {
      num: "2.1",
      title: "Açık Rızanın Kapsamı",
      content: (
        <p>
          Bu bölüm, Platforma kayıt olurken ve hizmetleri kullanırken
          verdiğiniz açık rızanın kapsamını belirler. Açık rıza, KVKK md. 5/1
          uyarınca belirli bir konuya ilişkin, bilgilendirmeye dayanan ve özgür
          iradeyle açıklanan rızadır.
        </p>
      ),
    },
    {
      num: "2.2",
      title: "Rıza Verilen İşlem Türleri",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Hesap oluşturma ve yönetimi:
            </strong>{" "}
            E-posta adresi, kullanıcı adı ve şifre bilgilerinin Platform
            tarafından saklanması.
          </li>
          <li>
            <strong className="text-zinc-200">Hizmet sunumu:</strong> Çözülen
            soruların, deneme sonuçlarının kaydedilmesi. Kullanıcının yazdığı
            Python kodları varsayılan olarak sunucuya iletilmez; AI Feedback
            kullanıldığında analiz için DeepSeek&apos;e gönderilebilir.
          </li>
          <li>
            <strong className="text-zinc-200">Güvenlik ve loglama:</strong> IP
            adresi, oturum ve cihaz bilgilerinin teknik güvenlik amaçlı
            işlenmesi.
          </li>
          <li>
            <strong className="text-zinc-200">Çerez kullanımı:</strong> Oturum
            çerezleri, tercih çerezleri ve anonim analiz çerezleri (Google
            Analytics) için rıza.
          </li>
          <li>
            <strong className="text-zinc-200">
              Reklam çerezleri (Google AdSense):
            </strong>{" "}
            Platform üzerinde Google AdSense reklamları gösterilmektedir. Google
            AdSense, reklam kişiselleştirme ve performans ölçümü amacıyla çerez
            ve benzer teknolojiler kullanır. Detaylı bilgi için{" "}
            <a
              href="https://policies.google.com/technologies/ads?hl=tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Google&apos;ın reklam çerezi politikasını
            </a>{" "}
            inceleyiniz. Kullanıcı,{" "}
            <a
              href="https://adssettings.google.com/authenticated?hl=tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Google Reklam Ayarları
            </a>{" "}
            üzerinden kişiselleştirilmiş reklamları devre dışı bırakabilir.
          </li>
          <li>
            <strong className="text-zinc-200">Üçüncü taraf altyapı:</strong>{" "}
            Supabase, Railway ve Vercel&apos;e veri aktarımı için rıza.
          </li>
        </ul>
      ),
    },
    {
      num: "2.3",
      title: "Rızanın Geri Çekilmesi",
      content: (
        <p>
          Kullanıcı, verdiği açık rızayı geri çekme hakkına sahiptir. Rıza geri
          çekildiğinde, geri çekme tarihinden önce yapılan işlemelerin hukuka
          uygunluğu etkilenmez. Rıza geri çekme talebi için hesap ayarlarından
          veya iletişim kanallarından başvurulabilir. Rıza geri çekildiğinde
          hesap kapatılır ve kişisel veriler mevzuat çerçevesinde silinir.
        </p>
      ),
    },
    {
      num: "2.4",
      title: "Açık Rıza Beyanı",
      content: (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mt-3">
          <p className="text-zinc-300 italic">
            &quot;Yukarıda yer alan Gizlilik Politikası&apos;nı, Aydınlatma
            Metni&apos;ni ve bu Açık Rıza Metni&apos;ni okuduğumu, anladığımı;
            Platform üzerinden sunulan hizmetler kapsamında kişisel verilerimin
            yukarıda belirtilen amaçlarla işlenmesine, saklanmasına ve belirtilen
            üçüncü taraflara aktarılmasına özgür irademle açık rıza gösterdiğimi
            beyan ederim.&quot;
          </p>
        </div>
      ),
    },
  ];

  const reklamPolitikasi: Section[] = [
    {
      num: "3.1",
      title: "Platformda Reklam Gösterimi",
      content: (
        <>
          <p>
            {PLATFORM_NAME}, sürdürülebilir hizmet sunabilmek amacıyla{" "}
            <strong className="text-zinc-200">Google AdSense</strong> platformu
            üzerinden reklam yayınlamaktadır. Platform üzerinde aşağıdaki reklam
            formatları kullanılmaktadır:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong className="text-zinc-200">In-Article Reklam:</strong> Soru
              detay sayfalarında, içerik akışı içinde yer alan doğal formatlı
              reklam.
            </li>
            <li>
              <strong className="text-zinc-200">In-Feed Reklam:</strong> Kategori
              sayfalarında, soru listesi içine yerleştirilen native reklam.
            </li>
            <li>
              <strong className="text-zinc-200">Matched Content:</strong> Sayfa
              altında (footer üstü), ilgili içerik önerisi formatında reklam.
            </li>
            <li>
              <strong className="text-zinc-200">Anchor Reklam (Mobil):</strong>{" "}
              Mobil cihazlarda ekranın alt kısmında sabitlenen (sticky) küçük
              reklam.
            </li>
          </ul>
          <p className="mt-2">
            Reklam yayıncısı:{" "}
            <strong className="text-zinc-200">Google LLC</strong> (AdSense
            Publisher ID:{" "}
            <code className="font-mono text-[12px] text-cyan-300">
              pub-6019538059362110
            </code>
            ). Yayıncı bilgileri{" "}
            <a
              href="https://www.pythonmulakat.com/ads.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              ads.txt
            </a>{" "}
            dosyasında herkese açık olarak yayınlanmaktadır.
          </p>
        </>
      ),
    },
    {
      num: "3.2",
      title: "Çerezler ve Kişiselleştirme",
      content: (
        <>
          <p>
            Google AdSense, reklam göstermek ve performans ölçümü için çerez
            (cookie) ve benzer yerel depolama teknolojileri kullanır. Bu
            çerezler aşağıdaki amaçlarla kullanılır:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Kullanıcının ilgi alanlarına göre reklam kişiselleştirme,</li>
            <li>Aynı reklamın tekrar tekrar gösterilmesini önleme,</li>
            <li>Reklam performansını ölçme (gösterim, tıklama, dönüşüm),</li>
            <li>Sahte trafik ve reklam sahteciliğini tespit etme.</li>
          </ul>
          <p className="mt-2">
            Google&apos;ın reklam çerezlerini nasıl kullandığına ilişkin detaylı
            bilgi için{" "}
            <a
              href="https://policies.google.com/technologies/ads?hl=tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Google&apos;ın reklam politikasını
            </a>{" "}
            inceleyebilirsiniz.
          </p>
        </>
      ),
    },
    {
      num: "3.3",
      title: "Kişiselleştirilmiş Reklamları Devre Dışı Bırakma",
      content: (
        <>
          <p>
            Kullanıcı, kişiselleştirilmiş reklamları aşağıdaki yöntemlerle
            devre dışı bırakabilir:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <a
                href="https://adssettings.google.com/authenticated?hl=tr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                Google Reklam Ayarları
              </a>{" "}
              sayfasından kişiselleştirilmiş reklam tercihini kapatma.
            </li>
            <li>
              <a
                href="https://optout.aboutads.info/?lang=EN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                Digital Advertising Alliance (DAA)
              </a>{" "}
              veya{" "}
              <a
                href="https://www.youronlinechoices.com/tr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                EDAA (Avrupa)
              </a>{" "}
              üzerinden sektörel opt-out.
            </li>
            <li>
              Tarayıcı ayarlarından çerezleri engelleme veya üçüncü taraf
              çerezleri kapatma (reklam kişiselleştirmesi sona erer, ancak
              reklam gösterimi devam edebilir).
            </li>
          </ul>
          <p className="mt-2">
            Not: Kişiselleştirme kapatıldığında, kullanıcıya ilgi alanıyla
            ilgili olmayan genel reklamlar gösterilmeye devam eder.
          </p>
        </>
      ),
    },
    {
      num: "3.4",
      title: "Editoryal Bağımsızlık",
      content: (
        <p>
          {PLATFORM_NAME} üzerindeki tüm içerikler (soru metinleri, açıklamalar,
          rehberler, blog yazıları) editör ekibimiz tarafından bağımsız olarak
          üretilir.{" "}
          <strong className="text-zinc-200">
            Reklamverenler, içerikler üzerinde hiçbir editoryal kontrole sahip
            değildir.
          </strong>{" "}
          Bir reklamverenin talebi, soru içeriğini, doğru cevabı veya açıklamayı
          etkilemez. Reklam geliri yalnızca platform sürdürülebilirliği
          (altyapı, içerik üretimi, moderasyon) için kullanılır.
        </p>
      ),
    },
    {
      num: "3.5",
      title: "Reklam Yerleşimi Politikası",
      content: (
        <>
          <p>
            Kullanıcı deneyimini korumak için aşağıdaki ilkelere uyulur:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              Reklamlar, içerik ile karışmayacak şekilde &quot;Reklam&quot;
              etiketiyle veya standart formatlarla gösterilir.
            </li>
            <li>
              Çalıştırılabilir kod (kod editörü) ve test sonuçları gibi kritik
              UI alanlarında reklam gösterilmez.
            </li>
            <li>
              Misafir kullanıcılar için reklamsız deneyim mevcut değildir;
              kayıtlı kullanıcılar için ileride premium üyelik modeli
              planlanmaktadır.
            </li>
            <li>
              Çocuklara yönelik içerik (13 yaş altı) barındırmadığımızdan,
              AdSense &quot;çocuklara yönelik site&quot; kategorisinde
              değerlendirilmez.
            </li>
          </ul>
        </>
      ),
    },
    {
      num: "3.6",
      title: "Şikâyet ve Geri Bildirim",
      content: (
        <p>
          Platformda gösterilen bir reklamın uygunsuz, yanıltıcı veya politika
          ihlali içerdiğini düşünüyorsanız, lütfen hesap ayarlarındaki &quot;Geri
          bildirim&quot; bölümünden veya iletişim kanallarından bize bildirin.
          Reklamla ilgili Google politikası ihlalini doğrudan{" "}
          <a
            href="https://support.google.com/adsense/answer/113978?hl=tr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            Google&apos;a
          </a>{" "}
          da bildirebilirsiniz. Şikâyetler 5 iş günü içinde değerlendirilir ve
          uygunsuz reklamlar kaldırılır.
        </p>
      ),
    },
  ];

  return (
    <LegalShell
      badge="Yasal Metin · Gizlilik Politikası"
      title="Gizlilik Politikası"
      otherHref="/terms"
      otherLabel="Kullanım Şartları"
    >
      <PartTitle num="1" title="Aydınlatma Metni (KVKK md. 10)" color="amber" />
      <div className="space-y-10 mt-6">
        {aydinlatma.map((s) => (
          <SectionBlock key={s.num} {...s} />
        ))}
      </div>

      <div className="mt-20">
        <PartTitle num="2" title="Açık Rıza Metni (KVKK md. 5/1)" color="cyan" />
        <div className="space-y-10 mt-6">
          {acikRiza.map((s) => (
            <SectionBlock key={s.num} {...s} />
          ))}
        </div>
      </div>

      <div id="reklam" className="mt-20">
        <PartTitle
          num="3"
          title="Reklam Politikası (Google AdSense)"
          color="amber"
        />
        <div className="space-y-10 mt-6">
          {reklamPolitikasi.map((s) => (
            <SectionBlock key={s.num} {...s} />
          ))}
        </div>
      </div>

      <p className="mt-12 text-sm text-zinc-500">
        Platform kullanım koşulları için{" "}
        <Link href="/terms" className="text-cyan-400 hover:underline">
          Kullanım Şartları
        </Link>{" "}
        sayfasına bakınız.
      </p>
    </LegalShell>
  );
}
