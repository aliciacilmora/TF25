import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
  },
};

// src/pages/api/proxy-survey.ts
export async function GET() {
  const res = await fetch("http://localhost:3010");
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}


export default nextConfig;
