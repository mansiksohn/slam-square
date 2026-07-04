import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🏴 Slam Square — 깃발 광장',
  description:
    '내가 지지하는 가치를 깃발로 표현하고, 같은 생각을 가진 사람들과 연결되는 가시화된 지지 플랫폼',
  keywords: ['사회참여', '가치', '지지', '네트워크', '커뮤니티'],
  openGraph: {
    title: '🏴 Slam Square — 깃발 광장',
    description: '내가 지지하는 가치를 깃발로 표현하고 같은 생각을 가진 사람들과 연결되세요',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🏴 Slam Square — 깃발 광장',
    description: '내가 지지하는 가치를 깃발로 표현하고 같은 생각을 가진 사람들과 연결되세요',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#455581',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
