import type { MetadataRoute } from "next";

const BASE = "https://www.pythonmulakat.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lastModified = now.toISOString();

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/interviews`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/login`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/register`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/profile`, lastModified, changeFrequency: "monthly", priority: 0.4 },
  ];

  // Kategoriler
  const categories = [
    "python-basics",
    "strings",
    "list-dict",
    "pandas",
    "algorithms",
    "oop",
    "data-types",
    "simple-apps",
    "beyin-firtinasi",
    "sqlite3",
    "numpy",
    "sklearn",
    "scipy",
    "matplotlib",
    "seaborn",
    "statsmodels",
    "nltk",
    "dask",
    "pytorch",
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${BASE}/interviews/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Sorular (1-50 arası, gerçek DB'ye göre ayarlanabilir)
  const questionPages: MetadataRoute.Sitemap = Array.from({ length: 50 }, (_, i) => i + 1).map(
    (id) => ({
      url: `${BASE}/interviews/python-basics/${id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  return [...staticPages, ...categoryPages, ...questionPages];
}