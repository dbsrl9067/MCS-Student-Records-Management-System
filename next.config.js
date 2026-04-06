/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  reactStrictMode: true,
  // Turbopack 관련 경고를 무시하고 Webpack 설정을 허용함
  images: {
    unoptimized: true, // 미얀마 현지 저사양 기기를 위해 이미지 최적화 비활성화 (선택)
  },
};

module.exports = withPWA(nextConfig);
