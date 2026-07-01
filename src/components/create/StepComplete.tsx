'use client';

import React from 'react';
import type { FlagColor } from '@/types';
import Button from '@/components/ui/Button';
import FlagPreview from '@/components/flag/FlagPreview';
import styles from './StepComplete.module.css';

interface StepCompleteProps {
  name: string;
  emoji1: string;
  emoji2: string;
  color: FlagColor;
  issue: string;
  change: string;
  shareUrl: string;
  onGoToSquare: () => void;
}

export default function StepComplete({
  name,
  emoji1,
  emoji2,
  color,
  issue,
  change,
  shareUrl,
  onGoToSquare,
}: StepCompleteProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      {/* 축하 아이콘 */}
      <div className={styles.iconWrap}>
        <span className={styles.celebrateIcon}>🎉</span>
      </div>

      <h2 className={styles.title}>깃발이 광장에 공개되었습니다!</h2>
      <p className={styles.desc}>
        축하합니다! 방금 생성하신 깃발이 즉시 깃발 광장(Slam Square)에 꽂혔습니다.<br />
        이제 사람들에게 링크를 공유하여 지지를 받아보세요.
      </p>

      {/* 완료된 깃발 프리뷰 */}
      <div className={styles.previewWrap}>
        <FlagPreview
          name={name}
          emoji1={emoji1}
          emoji2={emoji2}
          color={color}
          issue={issue}
          change={change}
        />
      </div>

      {/* 공유 링크 */}
      <div className={styles.shareSection}>
        <label className={styles.shareLabel}>내 깃발 공유 링크</label>
        <div className={styles.shareRow}>
          <input
            className={styles.shareInput}
            type="text"
            readOnly
            value={shareUrl}
            onClick={e => (e.target as HTMLInputElement).select()}
          />
          <Button variant="secondary" size="md" onClick={handleCopyLink}>
            {copied ? '복사됨!' : '링크 복사'}
          </Button>
        </div>
      </div>

      {/* 최종 광장 복귀 */}
      <div className={styles.actions}>
        <Button variant="primary" size="lg" fullWidth onClick={onGoToSquare} id="create-flag-complete-go">
          전체 광장에서 확인하기
        </Button>
      </div>
    </div>
  );
}
