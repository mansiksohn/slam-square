'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '광장', icon: '🏛️' },
    { href: '/create', label: '만들기', icon: '➕' },
    { href: '/notifications', label: '소식', icon: '🔔' },
    { href: '/mypage', label: '마이', icon: '👤' },
  ];

  return (
    <nav className={styles.nav} aria-label="하단 네비게이션">
      {navItems.map(item => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[styles.navLink, isActive ? styles.active : ''].join(' ')}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={styles.icon} aria-hidden="true">
              {item.icon}
            </span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
