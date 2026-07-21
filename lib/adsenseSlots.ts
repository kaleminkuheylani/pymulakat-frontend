// lib/adsenseSlots.ts
// TEK KAYNAK — AdSense slot ID'leri (4 ayri placement, 4 ayri slot).
//
// 2026-07-21: Eski sistemde TUM reklamlar ayni slot (9232002070) kullaniyordu,
//   bu AdSense bot'un 4 ayri <ins>'i ayni reklamla doldurmaya calismasina ve
//   hata vermesine yol aciyordu. Yeni: her placement icin ayri slot.
//
// KULLANIM:
//   - AdSense panelinden (https://www.google.com/adsense/) 4 yeni reklam birimi
//     olustur: "In-Article", "In-Feed", "Matched Content", "Anchor"
//   - Olusan slot ID'leri asagidaki sabitlere yaz
//   - Bu dosya TEK KAYNAK — diger component'ler buradan import eder
//
// DEFAULT (placeholder) — kullanici panelden guncellenecek:
//
// Pub ID: ca-pub-6019538059362110 (publisher hesap, degismez)

export const ADSENSE_PUB_ID = "ca-pub-6019538059362110";

// Slot ID'ler — AdSense panelden "Reklam birimleri" olusturunca buraya yaz.
// Her placement'in kendi slot ID'si olmali (AdSense kurali).
export const ADSENSE_SLOTS = {
  /** 300x250, makale arasi, soru detay description sonu. */
  IN_ARTICLE: "9232002070",
  /** Native, feed icinde, kategori landing 4. pozisyon. */
  IN_FEED: "9232002070",
  /** 728x90, footer ustu, ilgili icerik onerileri. */
  MATCHED_CONTENT: "9232002070",
  /** Mobile sticky bottom. */
  ANCHOR: "9232002070",
} as const;
