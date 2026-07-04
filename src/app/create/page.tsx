'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import StepName from '@/components/create/StepName';
import StepConnect from '@/components/create/StepConnect';
import StepComplete from '@/components/create/StepComplete';
import { useFlags, useAuth } from '@/hooks/useStore';
import type { Flag, FlagColor } from '@/types';
import styles from './page.module.css';

export default function CreateFlagPage() {
  const router = useRouter();
  const { flags, connections, addFlag, addConnection } = useFlags();
  const { user, login } = useAuth();

  // 3단계 스텝 관리 (1: 이름/아이콘/설명, 2: 연결, 3: 완료)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // 폼 상태
  const [name, setName] = useState('');
  const [emoji1, setEmoji1] = useState('🏴');
  const [emoji2, setEmoji2] = useState('');
  const [color, setColor] = useState<FlagColor>('#455581');
  const [issue, setIssue] = useState('');
  const [change, setChange] = useState('');
  const [selectedConnectionIds, setSelectedConnectionIds] = useState<string[]>([]);
  const [newFlagId, setNewFlagId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2단계 연결 추가/해제
  const handleToggleConnection = useCallback((flagId: string) => {
    setSelectedConnectionIds(prev => {
      if (prev.includes(flagId)) {
        return prev.filter(id => id !== flagId);
      } else {
        return [...prev, flagId];
      }
    });
  }, []);

  // 깃발 데이터 생성 등록 처리
  const handleComplete = async () => {
    setIsSubmitting(true);
    // Mock 딜레이 추가해 현실감 부여
    setTimeout(() => {
      const generatedId = `user-flag-${Date.now()}`;
      
      const newFlag: Flag = {
        id: generatedId,
        name,
        emoji1,
        emoji2: emoji2 || undefined,
        color,
        issue,
        change,
        creatorId: user?.id || 'anonymous',
        supporterCount: 1, // 제작자 본인 포함 1명으로 시작
        isSeed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 깃발 추가
      addFlag(newFlag);

      // 선택한 연결 연결선들 추가
      selectedConnectionIds.forEach(connId => {
        addConnection({
          id: `conn-${Date.now()}-${connId}`,
          flagAId: generatedId,
          flagBId: connId,
          connectionType: 'manual', // 기본 수동 연결
          createdAt: new Date().toISOString(),
        });
      });

      setNewFlagId(generatedId);
      setStep(3);
      setIsSubmitting(false);
    }, 1000);
  };

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/flag/${newFlagId}`
    : `http://localhost:3000/flag/${newFlagId}`;

  return (
    <div className={styles.page}>
      <Header user={user} onLogin={login} />

      <main className={styles.main} role="main">
        <div className={styles.card}>
          {/* 스텝 인디케이터 */}
          <div className={styles.stepper} aria-label="깃발 만들기 단계">
            <div className={[styles.stepDot, step >= 1 ? styles.activeDot : ''].join(' ')}>
              <span>1</span>
              <span className={styles.dotLabel}>정보 입력</span>
            </div>
            <div className={styles.stepLine} />
            <div className={[styles.stepDot, step >= 2 ? styles.activeDot : ''].join(' ')}>
              <span>2</span>
              <span className={styles.dotLabel}>이웃 연결</span>
            </div>
            <div className={styles.stepLine} />
            <div className={[styles.stepDot, step >= 3 ? styles.activeDot : ''].join(' ')}>
              <span>3</span>
              <span className={styles.dotLabel}>완료</span>
            </div>
          </div>

          <h1 className={styles.pageTitle}>
            {step === 1 && '광장에 세울 새로운 깃발 만들기'}
            {step === 2 && '광장의 다른 깃발과 연결하기'}
            {step === 3 && '광장에 꽂힌 깃발'}
          </h1>

          {/* 1단계 */}
          {step === 1 && (
            <StepName
              name={name}
              emoji1={emoji1}
              emoji2={emoji2}
              color={color}
              issue={issue}
              change={change}
              onChangeName={setName}
              onChangeEmoji1={setEmoji1}
              onChangeEmoji2={setEmoji2}
              onChangeColor={setColor}
              onChangeIssue={setIssue}
              onChangeChange={setChange}
              onNext={() => setStep(2)}
            />
          )}

          {/* 2단계 */}
          {step === 2 && (
            <StepConnect
              flags={flags}
              selectedConnectionIds={selectedConnectionIds}
              onToggleConnection={handleToggleConnection}
              onBack={() => setStep(1)}
              onComplete={handleComplete}
              isLoading={isSubmitting}
            />
          )}

          {/* 3단계 */}
          {step === 3 && (
            <StepComplete
              name={name}
              emoji1={emoji1}
              emoji2={emoji2}
              color={color}
              issue={issue}
              change={change}
              shareUrl={shareUrl}
              onGoToSquare={() => router.push(`/?focus=${newFlagId}`)}
            />
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
