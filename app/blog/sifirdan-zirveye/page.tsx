// app/blog/sifirdan-zirveye/page.tsx
//
// 2026-07-18: Sıfırdan Zirveye — tek sayfa interaktif blog yazısı.
// Server component → Client SectionsRenderer (unlock + Pyodide).

import type { Metadata } from "next";
import SectionsRenderer from "./SectionsRenderer";
import { BASE_URL } from "@/lib/seo";
import { TOTAL_MINUTES } from "./data/sections";

export const metadata: Metadata = {
  title: "Sıfırdan Zirveye: 30 Dakikada Programlama Öğren | PYBlog",
  description:
    "Hiç kod yazmamış biri için 8 kısa görev. Tarayıcıda Python — kurulum yok. Yaz, çalıştır, test geçince sonraki açılır. 30 dakikada temeller.",
  keywords: [
    "programlama temelleri",
    "sıfırdan programlama öğren",
    "python başlangıç",
    "kod yazmayı öğren",
    "print fonksiyonu",
    "if else örnekleri",
    "for döngüsü örnekleri",
    "while döngüsü",
    "fonksiyon tanımlama",
    "interaktif python dersi",
    "30 dakikada python",
  ],
  alternates: { canonical: `${BASE_URL}/blog/sifirdan-zirveye` },
  openGraph: {
    title: "Sıfırdan Zirveye: 30 Dakikada Programlama Öğren",
    description:
      "8 görev, 30 dakika, sıfır kurulum. Tarayıcıda Python yaz — sonraki ders kilidi açılsın.",
    url: `${BASE_URL}/blog/sifirdan-zirveye`,
    type: "article",
  },
};

export default function SifirdanZirveyePage() {
  return <SectionsRenderer />;
}
