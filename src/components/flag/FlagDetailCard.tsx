'use client';

import { useState, useCallback } from 'react';
import type { Flag } from '@/types';
import Button from '@/components/ui/Button';
import styles from './FlagDetailCard.module.css';

interface FlagDetailCardProps {
  flag: Flag | null;
  isSupported: boolean;
  isIdentity: boolean;
  isLoggedIn: boolean;
  onSupport: (flagId: string) => void;
  onToggleIdentity: (flagId: string) => void;
  onClose: () => void;
  onReport: (flagId: string) => void;
}

export default function FlagDetailCard({
  flag,
  isSupported,
  isIdentity,
  isLoggedIn,
  onSupport,
  onToggleIdentity,
  onClose,
  onReport,
}: FlagDetailCardProps) {
  const [showIdentityMenu, setShowIdentityMenu] = useState(false);
  const [supportAnim, setSupportAnim] = useState(false);

  const handleSupport = useCallback(() => {
    if (!flag) return;
    setSupportAnim(true);
    setTimeout(() => setSupportAnim(false), 600);
    onSupport(flag.id);
  }, [flag, onSupport]);

  if (!flag) return null;

  const emoji = flag.emoji2 ? `${flag.emoji1}${flag.emoji2}` : flag.emoji1;

  return (
    <>
      {/* 배경 오버레이 (반투명) */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />

      {/* 카드 */}
      <article
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-label={`${flag.name} 깃발 상세`}
      >
        {/* 핸들 */}
        <div className={styles.handle} aria-hidden="true" />

        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.flagIcon} style={{ background: flag.color }}>
            <span aria-hidden="true">{emoji}</span>
          </div>

          <div className={styles.meta}>
            <h2 className={styles.name}>{flag.name}</h2>
            <p className={styles.supporterCount}>
              <span className={styles.count}>
                {flag.supporterCount.toLocaleString()}
              </span>
              명이 지지하고 있어요
            </p>
          </div>

          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 이슈 + 변화 (두 문장) */}
        <div className={styles.sentences}>
          <p className={styles.sentence}>
            <span className={styles.sentenceLabel}>지금</span>
            {flag.issue}
          </p>
          <p className={styles.sentence}>
            <span className={styles.sentenceLabel}>우리는</span>
            {flag.change}
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className={styles.actions}>
          <Button
            variant={isSupported ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            onClick={handleSupport}
            className={supportAnim ? styles.supportAnim : ''}
            id={`support-btn-${flag.id}`}
            aria-pressed={isSupported}
          >
            {isSupported ? '✓ 지지 중' : '🏳️ 지지하기'}
          </Button>
        </div>

        {/* 정체성 설정 (접힌 메뉴) — 지지 중일 때만 표시 */}
        {isSupported && (
          <div className={styles.identitySection}>
            <button
              className={styles.identityToggleBtn}
              onClick={() => setShowIdentityMenu(v => !v)}
              aria-expanded={showIdentityMenu}
              id={`identity-toggle-${flag.id}`}
            >
              <span>이 깃발은 나를 나타냅니다</span>
              <span
                className={styles.chevron}
                style={{ transform: showIdentityMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▾
              </span>
            </button>

            {showIdentityMenu && (
              <div className={styles.identityMenu} role="group">
                <button
                  className={[
                    styles.identityOption,
                    isIdentity ? styles.identityOptionActive : '',
                  ].join(' ')}
                  onClick={() => onToggleIdentity(flag.id)}
                  id={`identity-yes-${flag.id}`}
                >
                  <span>✓</span>
                  <span>네, 이 깃발은 나를 나타내요</span>
                </button>
                <button
                  className={[
                    styles.identityOption,
                    !isIdentity ? styles.identityOptionActive : '',
                  ].join(' ')}
                  onClick={() => onToggleIdentity(flag.id)}
                  id={`identity-no-${flag.id}`}
                >
                  <span>♡</span>
                  <span>가치에 동의해서 지지해요</span>
                </button>
                <p className={styles.identityHint}>언제든 마이페이지에서 바꿀 수 있어요</p>
              </div>
            )}
          </div>
        )}

        {/* 신고 */}
        <div className={styles.footer}>
          <button
            className={styles.reportBtn}
            onClick={() => onReport(flag.id)}
            aria-label="이 깃발 신고하기"
          >
            신고
          </button>
        </div>
      </article>
    </>
  );
}
