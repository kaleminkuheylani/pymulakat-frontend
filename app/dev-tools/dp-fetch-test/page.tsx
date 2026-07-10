// app/dev-tools/dp-fetch-test/page.tsx
// Geliştirici diagnostic sayfası — production'da kullanılmaz.
// Sadece /dev-tools/* prefix'li sayfalar robots.txt'te disallow edilir.

import DpFetchTest from "../../../components/DpFetchTest";

export const metadata = {
  title: "DP Fetch-Test Diagnostics",
  robots: { index: false, follow: false },
};

export default function DpFetchTestPage() {
  return <DpFetchTest />;
}
