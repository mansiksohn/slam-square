/**
 * 이모지 조합 안전 정책 (PRD §9)
 * 무기·신체훼손 카테고리 X 사람·정체성 상징 카테고리 조합 차단
 */

// 무기 및 폭력성 상징 이모지 목록
export const WEAPON_EMOJIS = new Set([
  '🔪', '🗡️', '⚔️', '🔫', '💣', '🪓', '🛡️', '🏹', '🧨', '🛡️', '🔨', '⛏️', '🥊', '🔥'
]);

// 사람 및 정체성 상징 이모지 목록
export const IDENTITY_EMOJIS = new Set([
  // 사람/얼굴/신체
  '🧑', '👧', '👦', '👩', '👨', '👵', '👴', '👤', '👥', '🤰', '👶', '👼', '💪', '🧠', '👁️', '👄', '❤️',
  // 정체성 깃발 및 상징
  '🏳️‍🌈', '🏳️‍⚧️', '⚧️', '♀️', '♂️', '🧬', '⚖️', '🕊️'
]);

/**
 * 두 이모지의 조합이 안전한지 검사합니다.
 * 위험 카테고리 간의 교차 조합인 경우 false를 반환합니다.
 */
export function isEmojiCombinationSafe(emoji1: string, emoji2?: string): boolean {
  if (!emoji2) return true;

  const isE1Weapon = WEAPON_EMOJIS.has(emoji1);
  const isE2Weapon = WEAPON_EMOJIS.has(emoji2);
  const isE1Identity = IDENTITY_EMOJIS.has(emoji1);
  const isE2Identity = IDENTITY_EMOJIS.has(emoji2);

  // 무기 X 정체성 교차 조합은 차단
  if ((isE1Weapon && isE2Identity) || (isE2Weapon && isE1Identity)) {
    return false;
  }

  return true;
}
