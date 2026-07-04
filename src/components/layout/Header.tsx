'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import Button from '@/components/ui/Button';

interface HeaderProps {
  user: { displayName?: string } | null;
  onLogin?: () => void;
}

export default function Header({ user, onLogin }: HeaderProps) {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        {/* 로고 */}
        <Link href="/" className={styles.logo} aria-label="Slam Square 홈">
          <span className={styles.logoEmoji}>🏴</span>
          <span className={styles.logoText}>Slam Square</span>
        </Link>

        {/* 우측 액션 */}
        <div className={styles.actions}>
          {user ? (
            <>
              <Link href="/create" className={styles.createBtn}>
                <Button variant="primary" size="sm" id="header-create-flag">
                  + 깃발 만들기
                </Button>
              </Link>
              <Link href="/mypage" className={styles.avatarLink} aria-label="마이페이지">
                <div className={styles.avatar}>
                  {user.displayName?.[0] ?? '나'}
                </div>
              </Link>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogin}
              id="header-login"
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
