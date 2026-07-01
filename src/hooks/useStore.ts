'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Flag, FlagConnection, GraphNode, GraphLink } from '@/types';
import { SEED_FLAGS, SEED_CONNECTIONS } from '@/lib/constants/seedFlags';

// 지지자 수 → 반지름 (제곱근 스케일)
export function calcRadius(supporterCount: number): number {
  const base = 18;
  const scale = 3.5;
  return base + Math.sqrt(Math.max(supporterCount, 0)) * scale * 0.5;
}

export function useFlags() {
  const [flags, setFlags] = useState<Flag[]>(SEED_FLAGS);
  const [connections, setConnections] = useState<FlagConnection[]>(SEED_CONNECTIONS);
  const [isLoading, setIsLoading] = useState(false);

  const addFlag = useCallback((flag: Flag) => {
    setFlags(prev => [...prev, flag]);
  }, []);

  const addConnection = useCallback((conn: FlagConnection) => {
    setConnections(prev => [...prev, conn]);
  }, []);

  const updateSupporterCount = useCallback((flagId: string, delta: number) => {
    setFlags(prev =>
      prev.map(f =>
        f.id === flagId
          ? { ...f, supporterCount: Math.max(0, f.supporterCount + delta) }
          : f
      )
    );
  }, []);

  return {
    flags,
    connections,
    isLoading,
    addFlag,
    addConnection,
    updateSupporterCount,
  };
}

// Mock 로그인 상태
const MOCK_USER = {
  id: 'mock-user-01',
  displayName: '나',
  createdAt: '2026-01-01T00:00:00Z',
};

export function useAuth() {
  const [user, setUser] = useState<typeof MOCK_USER | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(MOCK_USER);
      setIsLoading(false);
    }, 600);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return { user, isLoading, login, logout };
}

export function useSupport(userId: string | null) {
  const [supportedIds, setSupportedIds] = useState<Set<string>>(new Set());
  const [identityIds, setIdentityIds] = useState<Set<string>>(new Set());

  const isSupported = useCallback(
    (flagId: string) => supportedIds.has(flagId),
    [supportedIds]
  );

  const isIdentity = useCallback(
    (flagId: string) => identityIds.has(flagId),
    [identityIds]
  );

  const toggleSupport = useCallback(
    (flagId: string): boolean => {
      if (!userId) return false;
      setSupportedIds(prev => {
        const next = new Set(prev);
        if (next.has(flagId)) next.delete(flagId);
        else next.add(flagId);
        return next;
      });
      return true;
    },
    [userId]
  );

  const toggleIdentity = useCallback(
    (flagId: string) => {
      setIdentityIds(prev => {
        const next = new Set(prev);
        if (next.has(flagId)) next.delete(flagId);
        else next.add(flagId);
        return next;
      });
    },
    []
  );

  return {
    supportedIds,
    identityIds,
    isSupported,
    isIdentity,
    toggleSupport,
    toggleIdentity,
  };
}
