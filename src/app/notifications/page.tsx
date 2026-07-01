'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import GlassCard from '@/components/ui/GlassCard';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';
import { useFlags, useAuth } from '@/hooks/useStore';
import styles from './page.module.css';

export default function NotificationsPage() {
  const { user, login } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // 모킹 알림 데이터
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      flagId: 'seed-03',
      flagName: '조용한 시간이 필요해요',
      flagEmoji: '🌙',
      type: 'news',
      content: '새로운 소식: "조용히 걷기 챌린지 일정 및 모집 안내"',
      date: '방금 전',
      isRead: false,
    },
    {
      id: 'notif-2',
      flagId: 'seed-05',
      flagName: '생명이 있는 것들이 좋아요',
      flagEmoji: '🌿',
      type: 'news',
      content: '새로운 소식: "도시 정원 가꾸기 키트 신청 2차 오픈 안내"',
      date: '2시간 전',
      isRead: false,
    },
    {
      id: 'notif-3',
      flagId: 'seed-11',
      flagName: '힘든 사람 곁에 있고 싶어요',
      flagEmoji: '🤝',
      type: 'news',
      content: '새로운 소식: "어려운 이웃을 위한 겨울 연탄 봉사 기획 모집"',
      date: '1일 전',
      isRead: true,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filteredNotifs = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.isRead);

  return (
    <div className={styles.page}>
      <Header user={user} onLogin={login} />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>알림 및 소식</h1>
            {user && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                모두 읽음으로 표시
              </Button>
            )}
          </div>

          {!user ? (
            <GlassCard className={styles.loginPrompt}>
              <p>로그인하시면 내가 지지하는 깃발의 새 소식을 실시간으로 받아볼 수 있습니다.</p>
              <Button variant="primary" onClick={login} style={{ marginTop: '16px' }} id="notif-login">
                로그인하기
              </Button>
            </GlassCard>
          ) : (
            <div className={styles.contentWrap}>
              {/* 필터 칩 */}
              <div className={styles.filters}>
                <Chip
                  active={filter === 'all'}
                  clickable
                  onClick={() => setFilter('all')}
                >
                  전체 소식
                </Chip>
                <Chip
                  active={filter === 'unread'}
                  clickable
                  onClick={() => setFilter('unread')}
                >
                  안 읽은 소식
                </Chip>
              </div>

              {/* 알림 피드 리스트 */}
              <div className={styles.feedList}>
                {filteredNotifs.length === 0 ? (
                  <GlassCard className={styles.emptyCard} hoverable={false}>
                    <p className={styles.emptyText}>받은 알림 소식이 없습니다.</p>
                  </GlassCard>
                ) : (
                  filteredNotifs.map(notif => (
                    <div
                      key={notif.id}
                      className={[
                        styles.notifCard,
                        notif.isRead ? styles.read : styles.unread,
                      ].join(' ')}
                    >
                      <div className={styles.notifHeader}>
                        <Link href={`/?focus=${notif.flagId}`} className={styles.flagLink}>
                          <span className={styles.flagEmoji} aria-hidden="true">
                            {notif.flagEmoji}
                          </span>
                          <span className={styles.flagName}>{notif.flagName}</span>
                        </Link>
                        <span className={styles.date}>{notif.date}</span>
                      </div>

                      <p className={styles.content}>{notif.content}</p>

                      <div className={styles.actions}>
                        <Link href={`/?focus=${notif.flagId}`} className={styles.detailLink}>
                          <Button variant="ghost" size="sm">
                            깃발 보기 ➔
                          </Button>
                        </Link>
                        <button
                          className={styles.readToggleBtn}
                          onClick={() => handleToggleRead(notif.id)}
                          aria-label={notif.isRead ? '안 읽음으로 표시' : '읽음으로 표시'}
                        >
                          {notif.isRead ? '안 읽음 표시' : '읽음 완료'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
