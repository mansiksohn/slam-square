'use client';

import React from 'react';
import type { FlagColor } from '@/types';
import { FLAG_COLORS } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import EmojiPicker from './EmojiPicker';
import FlagPreview from '@/components/flag/FlagPreview';
import styles from './StepName.module.css';

interface StepNameProps {
  name: string;
  emoji1: string;
  emoji2: string;
  color: FlagColor;
  issue: string;
  change: string;
  onChangeName: (val: string) => void;
  onChangeEmoji1: (val: string) => void;
  onChangeEmoji2: (val: string) => void;
  onChangeColor: (val: FlagColor) => void;
  onChangeIssue: (val: string) => void;
  onChangeChange: (val: string) => void;
  onNext: () => void;
}

export default function StepName({
  name,
  emoji1,
  emoji2,
  color,
  issue,
  change,
  onChangeName,
  onChangeEmoji1,
  onChangeEmoji2,
  onChangeColor,
  onChangeIssue,
  onChangeChange,
  onNext,
}: StepNameProps) {
  const isNextEnabled = name.trim().length > 0 && emoji1 && issue.trim().length > 0 && change.trim().length > 0;

  return (
    <div className={styles.container}>
      {/* 왼쪽: 입력 양식 */}
      <div className={styles.formSection}>
        {/* 깃발 이름 */}
        <div className={styles.formGroup}>
          <Input
            label="깃발 이름 (최대 20자)"
            value={name}
            onChange={e => onChangeName(e.target.value.slice(0, 20))}
            placeholder="예: 조용한 시간이 필요해요"
            maxLength={20}
            required
            id="create-flag-name"
          />
        </div>

        {/* 깃발 색상 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>깃발 색상</label>
          <div className={styles.colorPalette}>
            {FLAG_COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={[styles.colorBtn, color === c ? styles.activeColor : ''].join(' ')}
                style={{ backgroundColor: c }}
                onClick={() => onChangeColor(c)}
                aria-label={`색상 ${c} 선택`}
              />
            ))}
          </div>
        </div>

        {/* 이모지 선택 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>이모지 조합 (최대 2개)</label>
          <EmojiPicker
            emoji1={emoji1}
            emoji2={emoji2}
            onChangeEmoji1={onChangeEmoji1}
            onChangeEmoji2={onChangeEmoji2}
          />
        </div>

        {/* 설명 (이슈 및 변화 두 칸) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>깃발 설명 (각 최대 40자)</label>
          <div className={styles.sentenceInputs}>
            <div className={styles.sentenceRow}>
              <span className={styles.prefix}>지금</span>
              <input
                className={styles.sentenceInput}
                value={issue}
                onChange={e => onChangeIssue(e.target.value.slice(0, 40))}
                placeholder="예: 쉴 수 있는 시간과 공간이 부족해요."
                maxLength={40}
                required
                id="create-flag-issue"
              />
            </div>
            <div className={styles.sentenceRow}>
              <span className={styles.prefix}>우리는</span>
              <input
                className={styles.sentenceInput}
                value={change}
                onChange={e => onChangeChange(e.target.value.slice(0, 40))}
                placeholder="예: 혼자만의 온전한 회복 시간을 확보하고 싶어요."
                maxLength={40}
                required
                id="create-flag-change"
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isNextEnabled}
            onClick={onNext}
            id="create-flag-step1-next"
          >
            다음 단계로
          </Button>
        </div>
      </div>

      {/* 오른쪽: 실시간 깃발 프리뷰 */}
      <div className={styles.previewSection}>
        <h4 className={styles.previewTitle}>깃발 미리보기</h4>
        <FlagPreview
          name={name}
          emoji1={emoji1}
          emoji2={emoji2}
          color={color}
          issue={issue}
          change={change}
        />
      </div>
    </div>
  );
}
