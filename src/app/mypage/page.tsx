'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import GlassCard from '@/components/ui/GlassCard';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';
import { useFlags, useAuth, useSupport } from '@/hooks/useStore';
import styles from './page.module.css';

export default function MyPage() {
  const { flags } = useFlags();
  const { user, login, logout } = useAuth();
  const {
    supportedIds,
    identityIds,
    toggleSupport,
    toggleIdentity,
  } = useSupport(user?.id ?? null);

  const supportedFlags = flags.filter(f => supportedIds.has(f.id));
  const identityFlags = flags.filter(f => identityIds.has(f.id));

  // 알림 히스토리 모킹 데이터
  const newsHistory = [
    {
      id: 'news-1',
      flagName: '조용한 시간이 필요해요',
      content: '이번 주말, 강남 도심 한복판에서 조용히 걷기 챌린지가 진행됩니다.',
      date: '2026-06-25',
    },
    {
      id: 'news-2',
      flagName: '생명이 있는 것들이 좋아요',
      content: '동네 길고양이 중성화 수술(TNR)을 위한 모금이 성공적으로 완료되었습니다.',
      date: '2026-06-20',
    },
  ];

  return (
    <div className={styles.page}>
      <Header user={user} onLogin={login} />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>마이페이지</h1>

          {!user ? (
            <GlassCard className={styles.loginPrompt}>
              <p>로그인하시면 내가 지지한 깃발과 정체성을 설정한 내역을 모아볼 수 있습니다.</p>
              <Button variant="primary" onClick={login} style={{ marginTop: '16px' }} id="mypage-login">
                로그인하기
              </Button>
            </GlassCard>
          ) : (
            <div className={styles.dashboard}>
              {/* 유저 프로필 카드 */}
              <GlassCard className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <div className={styles.avatar}>{user.displayName?.[0] || '나'}</div>
                  <div className={styles.profileInfo}>
                    <h2 className={styles.userName}>{user.displayName}</h2>
                    <p className={styles.userId}>ID: {user.id}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    로그아웃
                  </Button>
                </div>
              </GlassCard>

              {/* 내 깃발 상태 */}
              <div className={styles.sectionGrid}>
                {/* 지지 중인 깃발 */}
                <GlassCard className={styles.sectionCard}>
                  <h3 className={styles.sectionTitle}>🏳️ 내가 지지한 깃발 ({supportedFlags.length}개)</h3>
                  {supportedFlags.length === 0 ? (
                    <p className={styles.emptyText}>아직 지지한 깃발이 없습니다. 광장에서 마음에 드는 깃발을 지지해 보세요!</p>
                  ) : (
                    <div className={styles.flagList}>
                      {supportedFlags.map(flag => (
                        <div key={flag.id} className={styles.flagItem}>
                          <div className={styles.flagMeta}>
                            <span className={styles.flagEmoji}>
                              {flag.emoji2 ? `${flag.emoji1}${flag.emoji2}` : flag.emoji1}
                            </span>
                            <span className={styles.flagName}>{flag.name}</span>
                          </div>
                          <div className={styles.flagActions}>
                            <Chip
                              active={identityIds.has(flag.id)}
                              clickable
                              onClick={() => toggleIdentity(flag.id)}
                            >
                              나를 나타냄
                            </Chip>
                            <button
                              className={styles.unsupportBtn}
                              onClick={() => toggleSupport(flag.id)}
                              aria-label="지지 취소"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>

                {/* 정체성 깃발 */}
                <GlassCard className={styles.sectionCard}>
                  <h3 className={styles.sectionTitle}>👤 나를 나타내는 깃발 ({identityFlags.length}개)</h3>
                  {identityFlags.length === 0 ? (
                    <p className={styles.emptyText}>내가 당사자인 정체성 깃발을 등록해 보세요.</p>
                  ) : (
                    <div className={styles.flagList}>
                      {identityFlags.map(flag => (
                        <div key={flag.id} className={styles.flagItem}>
                          <div className={styles.flagMeta}>
                            <span className={styles.flagEmoji}>
                              {flag.emoji2 ? `${flag.emoji1}${flag.emoji2}` : flag.emoji1}
                            </span>
                            <span className={styles.flagName}>{flag.name}</span>
                          </div>
                          <Chip active>당사자</Chip>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </div>

              {/* 내 깃발 소식 히스토리 */}
              <GlassCard className={styles.historyCard} style={{ marginTop: '24px' }}>
                <h3 className={styles.sectionTitle}>🔔 최근 깃발 소식</h3>
                <div className={styles.newsList}>
                  {newsHistory.map(news => (
                    <div key={news.id} className={styles.newsItem}>
                      <div className={styles.newsHeader}>
                        <span className={styles.newsFlagName}>🏳️ {news.flagName}</span>
                        <span className={styles.newsDate}>{news.date}</span>
                      </div>
                      <p className={styles.newsContent}>{news.content}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
