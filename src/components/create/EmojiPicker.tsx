'use client';

import React, { useState, useEffect } from 'react';
import { isEmojiCombinationSafe, WEAPON_EMOJIS, IDENTITY_EMOJIS } from '@/lib/emoji/blacklist';
import styles from './EmojiPicker.module.css';

interface EmojiPickerProps {
  emoji1: string;
  emoji2: string;
  onChangeEmoji1: (emoji: string) => void;
  onChangeEmoji2: (emoji: string) => void;
}

// 자주 사용하는 추천 이모지 목록
const PRESET_EMOJIS = [
  // 일반/정체성/사람
  '🧑', '👧', '👦', '👤', '👥', '🤰', '👶', '👼', '💪', '🧠', '❤️', '🏳️‍🌈', '⚖️', '🕊️',
  // 음식
  '🍚', '🍅', '🍜', '☕', '🍎', '🍕', '🍰',
  // 동식물/생태
  '🌿', '🐾', '🌍', '🐱', '🐶', '🌳', '🌸', '🌊',
  // 도구/기타
  '🚶', '🌙', '✨', '🏘️', '🏮', '🤝', '🌱', '🧘', '🫂', '🛠️', '📖', '🏛️', '🏠', '📈',
  // 위험/무기 (테스트 및 정책 동작 확인용)
  '🔪', '🗡️', '🔫', '💣', '🔥'
];

export default function EmojiPicker({
  emoji1,
  emoji2,
  onChangeEmoji1,
  onChangeEmoji2,
}: EmojiPickerProps) {
  const [warning, setWarning] = useState<string | null>(null);

  // 이모지 선택 처리
  const selectEmoji = (emoji: string, slot: 1 | 2) => {
    setWarning(null);

    if (slot === 1) {
      // 1번 슬롯 변경 시, 2번과의 조합성 체크
      if (emoji2 && !isEmojiCombinationSafe(emoji, emoji2)) {
        setWarning('⚠️ 안전 정책에 따라 사람/정체성 상징과 무기의 조합은 차단됩니다.');
        return;
      }
      onChangeEmoji1(emoji);
    } else {
      // 2번 슬롯 변경 시, 1번과의 조합성 체크
      if (emoji && !isEmojiCombinationSafe(emoji1, emoji)) {
        setWarning('⚠️ 안전 정책에 따라 사람/정체성 상징과 무기의 조합은 차단됩니다.');
        return;
      }
      onChangeEmoji2(emoji);
    }
  };

  const clearSlot2 = () => {
    setWarning(null);
    onChangeEmoji2('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.slots}>
        <div className={styles.slotBox}>
          <span className={styles.slotLabel}>슬롯 1 (필수)</span>
          <div className={styles.slotValue}>{emoji1 || '🏳️'}</div>
        </div>
        <div className={styles.slotBox}>
          <span className={styles.slotLabel}>슬롯 2 (선택)</span>
          <div className={styles.slotValueWrapper}>
            <div className={styles.slotValue}>{emoji2 || 'empty'}</div>
            {emoji2 && (
              <button
                className={styles.clearBtn}
                onClick={clearSlot2}
                aria-label="슬롯 2 비우기"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {warning && <div className={styles.warning} role="alert">{warning}</div>}

      <div className={styles.paletteSection}>
        <h4 className={styles.paletteTitle}>슬롯 1 선택</h4>
        <div className={styles.emojiList}>
          {PRESET_EMOJIS.map(emoji => (
            <button
              key={`s1-${emoji}`}
              type="button"
              className={[styles.emojiBtn, emoji1 === emoji ? styles.active : ''].join(' ')}
              onClick={() => selectEmoji(emoji, 1)}
            >
              {emoji}
            </button>
          ))}
        </div>

        <h4 className={styles.paletteTitle} style={{ marginTop: '16px' }}>슬롯 2 선택</h4>
        <div className={styles.emojiList}>
          {PRESET_EMOJIS.map(emoji => (
            <button
              key={`s2-${emoji}`}
              type="button"
              className={[styles.emojiBtn, emoji2 === emoji ? styles.active : ''].join(' ')}
              onClick={() => selectEmoji(emoji, 2)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
