// lib/adsenseSlots.ts
// TEK KAYNAK — AdSense slot ID'leri (4 ayri placement, 4 ayri slot).
//
// 2026-07-21: 4 gercek slot ID AdSense panelden alindi.
//
// Pub ID: ca-pub-6019538059362110 (publisher hesap, degismez)

export const ADSENSE_PUB_ID = "ca-pub-6019538059362110";

// Slot ID'ler — AdSense panelden alinan gercek degerler (2026-07-21).
// Her placement'in kendi slot ID'si var (AdSense kurali: 1 slot = 1 yerlesim).
export const ADSENSE_SLOTS = {
  /** 300x250, makale arasi, soru detay description sonu. */
  IN_ARTICLE: "6564109156",
  /** Native, feed icinde, kategori landing 4. pozisyon. */
  IN_FEED: "2730741129",
  /** 728x90, footer ustu, ilgili icerik onerileri. */
  MATCHED_CONTENT: "5987459852",
  /** Mobile sticky bottom (autorelaxed). */
  ANCHOR: "9232002070",
} as const;
