'use client';

import React, { useState } from 'react';
import type { Flag } from '@/types';
import Button from '@/components/ui/Button';
import styles from './StepConnect.module.css';

interface StepConnectProps {
  flags: Flag[];
  selectedConnectionIds: string[];
  onToggleConnection: (id: string) => void;
  onBack: () => void;
  onComplete: () => void;
  isLoading: boolean;
}

export default function StepConnect({
  flags,
  selectedConnectionIds,
  onToggleConnection,
  onBack,
  onComplete,
  isLoading,
}: StepConnectProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 19개 씨앗 깃발을 우선 추천으로 띄움
  const seedFlags = flags.filter(f => f.isSeed);
  const userFlags = flags.filter(f => !f.isSeed);

  const filterFlags = (list: Flag[]) => {
    if (!searchQuery.trim()) return list;
    return list.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredSeeds = filterFlags(seedFlags);
  const filteredUsers = filterFlags(userFlags);

  return (
    <div className={styles.container}>
      <p className={styles.intro}>
        관계가 곧 깃발의 정체성이 됩니다.<br />
        나의 깃발과 관련이 있거나 비슷한 가치를 나누는 기존 깃발을 연결해 주세요.
      </p>

      {/* 검색창 */}
      <div className={styles.searchWrapper}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="연결할 깃발의 이름을 검색하세요..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          id="connect-flag-search"
        />
        {searchQuery && (
          <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>
            ✕
          </button>
        )}
      </div>

      {/* 실시간 선택 현황 */}
      <div className={styles.selectionSummary}>
        <h4 className={styles.selectionTitle}>
          선택된 연결 ({selectedConnectionIds.length}개)
        </h4>
        {selectedConnectionIds.length === 0 ? (
          <p className={styles.emptySelection}>아래 리스트에서 깃발을 골라 연결해 주세요.</p>
        ) : (
          <div className={styles.selectedChips}>
            {selectedConnectionIds.map(id => {
              const flag = flags.find(f => f.id === id);
              if (!flag) return null;
              return (
                <div
                  key={`chip-${id}`}
                  className={styles.selectedChip}
                  style={{ borderColor: flag.color }}
                >
                  <span className={styles.chipEmoji}>{flag.emoji2 ? `${flag.emoji1}${flag.emoji2}` : flag.emoji1}</span>
                  <span className={styles.chipName}>{flag.name}</span>
                  <button
                    className={styles.chipRemoveBtn}
                    onClick={() => onToggleConnection(id)}
                    aria-label={`${flag.name} 연결 해제`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 깃발 리스트 */}
      <div className={styles.listSection}>
        {/* 씨앗 깃발 */}
        {filteredSeeds.length > 0 && (
          <div className={styles.listCategory}>
            <h4 className={styles.categoryTitle}>🌱 기본 가치 깃발 (씨앗)</h4>
            <div className={styles.flagGrid}>
              {filteredSeeds.map(flag => {
                const isSelected = selectedConnectionIds.includes(flag.id);
                return (
                  <button
                    key={flag.id}
                    type="button"
                    className={[
                      styles.flagItem,
                      isSelected ? styles.flagItemSelected : '',
                    ].join(' ')}
                    style={{ '--flag-theme-color': flag.color } as React.CSSProperties}
                    onClick={() => onToggleConnection(flag.id)}
                    id={`connect-flag-item-${flag.id}`}
                  >
                    <div className={styles.flagEmoji}>
                      {flag.emoji2 ? `${flag.emoji1}${flag.emoji2}` : flag.emoji1}
                    </div>
                    <div className={styles.flagMeta}>
                      <span className={styles.flagName}>{flag.name}</span>
                      <span className={styles.flagCount}>
                        지지자 {flag.supporterCount.toLocaleString()}명
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 유저 깃발 */}
        {filteredUsers.length > 0 && (
          <div className={styles.listCategory} style={{ marginTop: '24px' }}>
            <h4 className={styles.categoryTitle}>🏴 광장의 깃발들</h4>
            <div className={styles.flagGrid}>
              {filteredUsers.map(flag => {
                const isSelected = selectedConnectionIds.includes(flag.id);
                return (
                  <button
                    key={flag.id}
                    type="button"
                    className={[
                      styles.flagItem,
                      isSelected ? styles.flagItemSelected : '',
                    ].join(' ')}
                    style={{ '--flag-theme-color': flag.color } as React.CSSProperties}
                    onClick={() => onToggleConnection(flag.id)}
                    id={`connect-flag-item-${flag.id}`}
                  >
                    <div className={styles.flagEmoji}>
                      {flag.emoji2 ? `${flag.emoji1}${flag.emoji2}` : flag.emoji1}
                    </div>
                    <div className={styles.flagMeta}>
                      <span className={styles.flagName}>{flag.name}</span>
                      <span className={styles.flagCount}>
                        지지자 {flag.supporterCount.toLocaleString()}명
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {filteredSeeds.length === 0 && filteredUsers.length === 0 && (
          <div className={styles.noResults}>
            검색 결과와 일치하는 깃발이 광장에 없습니다.
          </div>
        )}
      </div>

      {/* 단계별 액션 */}
      <div className={styles.actions}>
        <Button variant="secondary" size="lg" onClick={onBack}>
          이전 단계로
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onComplete}
          isLoading={isLoading}
          id="create-flag-submit"
        >
          깃발 들고 광장으로 가기
        </Button>
      </div>
    </div>
  );
}
