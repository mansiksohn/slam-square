// Slam Square 전체 TypeScript 타입 정의

// 깃발 색상 팔레트 (6색)
export type FlagColor =
  | '#455581'
  | '#3a6758'
  | '#e8624a'
  | '#d4a843'
  | '#7b5ea7'
  | '#4a9e8a';

export const FLAG_COLORS: FlagColor[] = [
  '#455581',
  '#3a6758',
  '#e8624a',
  '#d4a843',
  '#7b5ea7',
  '#4a9e8a',
];

// 연결 관계 타입 (내부 추론용)
export type ConnectionType =
  | 'manual'
  | 'support_companion'
  | 'related_issue'
  | 'parent';

// 깃발
export interface Flag {
  id: string;
  name: string;
  emoji1: string;
  emoji2?: string;
  color: FlagColor;
  issue: string;
  change: string;
  creatorId?: string;
  supporterCount: number;
  isSeed: boolean;
  createdAt: string;
  updatedAt: string;
}

// 깃발 연결
export interface FlagConnection {
  id: string;
  flagAId: string;
  flagBId: string;
  connectionType: ConnectionType;
  createdAt: string;
}

// 지지 정보
export interface Support {
  id: string;
  userId: string;
  flagId: string;
  isIdentity: boolean;
  createdAt: string;
}

// 깃발 소식
export interface FlagNews {
  id: string;
  flagId: string;
  content: string;
  createdBy?: string;
  createdAt: string;
}

// 알림
export type NotificationType = 'news' | 'merge_proposal' | 'report_result';

export interface Notification {
  id: string;
  userId: string;
  flagId: string;
  newsId?: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  flag?: Flag;
  news?: FlagNews;
}

// 신고
export type ReportTargetType = 'flag' | 'user';
export type ReportStatus = 'pending' | 'auto_filtered' | 'reviewed' | 'dismissed';

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetFlagId?: string;
  targetUserId?: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

// 사용자 프로필
export interface UserProfile {
  id: string;
  displayName?: string;
  createdAt: string;
}

// Auth 상태
export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
}

// d3-force 그래프 노드
export interface GraphNode extends Flag {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  radius: number;
}

// d3-force 그래프 링크
export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  connectionType: ConnectionType;
  isUserSupported: boolean;
}

// 그래프 상태
export interface GraphState {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNodeId: string | null;
  focusedNodeId: string | null;
  transform: { x: number; y: number; k: number };
}

// 깃발 만들기 폼 상태
export interface CreateFlagForm {
  name: string;
  emoji1: string;
  emoji2: string;
  color: FlagColor;
  issue: string;
  change: string;
  connectionIds: string[];
}
