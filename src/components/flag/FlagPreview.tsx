'use client';

import React from 'react';
import type { FlagColor } from '@/types';
import styles from './FlagPreview.module.css';

interface FlagPreviewProps {
  name: string;
  emoji1: string;
  emoji2?: string;
  color: FlagColor;
  issue?: string;
  change?: string;
}

export default function FlagPreview({
  name,
  emoji1,
  emoji2,
  color,
  issue,
  change,
}: FlagPreviewProps) {
  const emojiText = emoji2 ? `${emoji1}${emoji2}` : emoji1;

  return (
    <div className={styles.container}>
      {/* 실제 깃발 모양 카드 */}
      <div className={styles.flagCard} style={{ '--flag-bg-color': color } as React.CSSProperties}>
        {/* 깃발 깃대 및 깃발 장식 */}
        <div className={styles.flagStaff}>
          <div className={styles.flagBanner}>
            <span className={styles.emoji} aria-hidden="true">
              {emojiText || '🏳️'}
            </span>
          </div>
        </div>

        {/* 깃발 텍스트 정보 */}
        <div className={styles.flagInfo}>
          <h3 className={styles.title}>{name || '새로운 깃발'}</h3>
          {issue && change && (
            <div className={styles.sentences}>
              <p className={styles.sentence}>
                <span className={styles.label}>지금</span> {issue}
              </p>
              <p className={styles.sentence}>
                <span className={styles.label}>우리는</span> {change}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
