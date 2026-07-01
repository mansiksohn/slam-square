'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import SquareGraph from '@/components/graph/SquareGraph';
import FlagDetailCard from '@/components/flag/FlagDetailCard';
import LoginModal from '@/components/auth/LoginModal';
import { useFlags, useAuth, useSupport } from '@/hooks/useStore';
import type { Flag } from '@/types';
import styles from './page.module.css';

function SquareSquareContent() {
  const searchParams = useSearchParams();
  const focusParam = searchParams.get('focus');

  const { flags, connections, updateSupporterCount } = useFlags();
  const { user, login } = useAuth();
  const {
    supportedIds,
    isSupported,
    isIdentity,
    toggleSupport,
    toggleIdentity,
  } = useSupport(user?.id ?? null);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingFlagId, setPendingFlagId] = useState<string | null>(null);

  // 공유 쿼리 파라미터 ?focus=id 가 있으면 초기 로드 시 자동 선택
  useEffect(() => {
    if (focusParam && flags.some(f => f.id === focusParam)) {
      setSelectedNodeId(focusParam);
    }
  }, [focusParam, flags]);

  // 선택된 깃발 객체
  const selectedFlag: Flag | null =
    flags.find(f => f.id === selectedNodeId) ?? null;

  // 깃발 노드 선택
  const handleSelectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
  }, []);

  // 지지하기
  const handleSupport = useCallback(
    (flagId: string) => {
      if (!user) {
        setPendingFlagId(flagId);
        setShowLogin(true);
        return;
      }

      const wasSupported = isSupported(flagId);
      toggleSupport(flagId);
      updateSupporterCount(flagId, wasSupported ? -1 : +1);
    },
    [user, isSupported, toggleSupport, updateSupporterCount]
  );

  // 로그인 성공 후 지지 처리
  const handleLoginSuccess = useCallback(() => {
    login();
  }, [login]);

  // 정체성 설정
  const handleSetIdentity = useCallback(
    (flagId: string, identity: boolean) => {
      if (identity) toggleIdentity(flagId);
      if (pendingFlagId === flagId) {
        toggleSupport(flagId);
        updateSupporterCount(flagId, 1);
        setPendingFlagId(null);
      }
    },
    [pendingFlagId, toggleIdentity, toggleSupport, updateSupporterCount]
  );

  const handleCloseLogin = useCallback(() => {
    setShowLogin(false);
    if (pendingFlagId && user) {
      toggleSupport(pendingFlagId);
      updateSupporterCount(pendingFlagId, 1);
      setPendingFlagId(null);
    }
  }, [pendingFlagId, user, toggleSupport, updateSupporterCount]);

  // 신고
  const handleReport = useCallback((flagId: string) => {
    alert(`신고 기능은 준비 중이에요 (flagId: ${flagId})`);
  }, []);

  return (
    <div className={styles.page}>
      <Header user={user} onLogin={() => setShowLogin(true)} />

      {/* 광장 그래프 — 전체 화면 */}
      <main className={styles.graphWrapper} role="main" aria-label="깃발 광장">
        <SquareGraph
          flags={flags}
          connections={connections}
          supportedIds={supportedIds}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          focusNodeId={focusParam}
        />
      </main>

      {/* 힌트 */}
      <div className={styles.hint} aria-live="polite">
        <span>깃발을 클릭해 자세히 보기</span>
      </div>

      {/* 깃발 상세 카드 */}
      {selectedFlag && (
        <FlagDetailCard
          flag={selectedFlag}
          isSupported={isSupported(selectedFlag.id)}
          isIdentity={isIdentity(selectedFlag.id)}
          isLoggedIn={!!user}
          onSupport={handleSupport}
          onToggleIdentity={toggleIdentity}
          onClose={() => setSelectedNodeId(null)}
          onReport={handleReport}
        />
      )}

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={showLogin}
        onLogin={handleLoginSuccess}
        onClose={handleCloseLogin}
        pendingFlagId={pendingFlagId}
        onSetIdentity={handleSetIdentity}
      />

      <BottomNav />
    </div>
  );
}

export default function SquarePage() {
  return (
    <Suspense fallback={<div className={styles.loading}>광장 로딩 중...</div>}>
      <SquareSquareContent />
    </Suspense>
  );
}


