'use client';

import React, { useEffect, useRef } from 'react';
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

// 깃발 색상(hex) → 연한 배경색 매핑
const COLOR_BG_MAP: Record<string, { bg: string; border: string }> = {
  '#455581': { bg: '#e6eaf5', border: '#45558140' },
  '#3a6758': { bg: '#e8f5ee', border: '#3a675840' },
  '#e8624a': { bg: '#fdecea', border: '#e8624a40' },
  '#d4a843': { bg: '#fdf5e0', border: '#d4a84340' },
  '#7b5ea7': { bg: '#f2edfb', border: '#7b5ea740' },
  '#4a9e8a': { bg: '#e3f6f2', border: '#4a9e8a40' },
};

export default function FlagPreview({
  name,
  emoji1,
  emoji2,
  color,
  issue,
  change,
}: FlagPreviewProps) {
  const clothRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  const emojiText = emoji2 ? `${emoji1}${emoji2}` : emoji1;
  const palette = COLOR_BG_MAP[color] ?? { bg: '#e8f5ee', border: '#4A7C5940' };

  useEffect(() => {
    const cloth = clothRef.current;
    if (!cloth) return;

    const wave = () => {
      tRef.current += 0.035;
      const t = tRef.current;
      cloth.style.transform = `skewY(${Math.sin(t) * 4}deg) scaleX(${1 + Math.sin(t * 1.3) * 0.03})`;
      rafRef.current = requestAnimationFrame(wave);
    };

    rafRef.current = requestAnimationFrame(wave);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // 색상이 바뀌어도 애니메이션 유지
  useEffect(() => {
    const cloth = clothRef.current;
    if (!cloth) return;
    cloth.style.background = palette.bg;
    cloth.style.borderColor = palette.border;
  }, [palette.bg, palette.border]);

  let sentence = '';
  if (issue && change) sentence = `지금 ${issue}. 우리는 ${change}.`;
  else if (issue) sentence = `지금 ${issue}.`;
  else if (change) sentence = `우리는 ${change}.`;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* 깃대 + 깃발 천 */}
        <div className={styles.flagpoleWrap}>
          <div
            ref={clothRef}
            className={styles.flagCloth}
            style={{
              background: palette.bg,
              borderColor: palette.border,
            }}
          >
            <span className={styles.flagIcon} aria-hidden="true">
              {emojiText || '🏳️'}
            </span>
          </div>
          <div className={styles.pole} />
          <div className={styles.poleBase} />
        </div>

        {/* 텍스트 정보 */}
        <div className={styles.textInfo}>
          <p className={`${styles.flagName} ${!name ? styles.empty : ''}`}>
            {name || '깃발 이름'}
          </p>
          {sentence && (
            <p className={styles.flagSentence}>{sentence}</p>
          )}
        </div>
      </div>
    </div>
  );
}
