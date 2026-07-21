// middleware.ts
// Merkezi proxy middleware'ini Next.js convention'una uygun re-export eder.
// Asıl logic: proxy.ts

export { proxy as middleware, config } from "./proxy";
