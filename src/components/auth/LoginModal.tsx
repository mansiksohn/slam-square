'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: () => void;
  onClose: () => void;
  /**
   * 로그인 성공 직후 정체성 설정 모달을 띄울 깃발 ID
   * 존재하면 "이 깃발은 당신을 나타내나요?" 단계가 이어짐
   */
  pendingFlagId?: string | null;
  onSetIdentity?: (flagId: string, isIdentity: boolean) => void;
}

export default function LoginModal({
  isOpen,
  onLogin,
  onClose,
  pendingFlagId,
  onSetIdentity,
}: LoginModalProps) {
  const [step, setStep] = useState<'login' | 'identity'>('login');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = () => {
    setIsLoading(true);
    // Mock 로그인 (실제 구현 시 Supabase OAuth)
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      if (pendingFlagId) setStep('identity');
      else onClose();
    }, 700);
  };

  const handleIdentity = (isIdentity: boolean) => {
    if (pendingFlagId && onSetIdentity) {
      onSetIdentity(pendingFlagId, isIdentity);
    }
    onClose();
    setStep('login');
  };

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div className={styles.handle} aria-hidden="true" />

        {step === 'login' ? (
          <>
            <div className={styles.iconWrap}>
              <span className={styles.icon}>🏳️</span>
            </div>
            <h2 id="login-modal-title" className={styles.title}>
              광장에 참여하기
            </h2>
            <p className={styles.desc}>
              지지하기는 로그인이 필요해요.<br />
              한 번만 하면 다음부터는 바로 지지할 수 있어요.
            </p>

            <div className={styles.btnStack}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                onClick={handleLogin}
                id="login-google"
              >
                Google로 계속하기
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                onClick={handleLogin}
                id="login-kakao"
              >
                카카오로 계속하기
              </Button>
            </div>

            <p className={styles.hint}>
              로그인 없이 광장을 둘러볼 수 있어요
            </p>
          </>
        ) : (
          <>
            <div className={styles.iconWrap}>
              <span className={styles.icon}>🤔</span>
            </div>
            <h2 id="login-modal-title" className={styles.title}>
              이 깃발은 당신을 나타내나요?
            </h2>
            <p className={styles.desc}>
              언제든 마이페이지에서 바꿀 수 있어요
            </p>

            <div className={styles.btnStack}>
              <button
                className={styles.identityBtn}
                onClick={() => handleIdentity(true)}
                id="identity-yes"
              >
                <span className={styles.identityBtnIcon}>✓</span>
                <div>
                  <div className={styles.identityBtnTitle}>네, 나를 나타내요</div>
                  <div className={styles.identityBtnDesc}>이 이슈의 당사자예요</div>
                </div>
              </button>
              <button
                className={styles.identityBtn}
                onClick={() => handleIdentity(false)}
                id="identity-no"
              >
                <span className={styles.identityBtnIcon}>♡</span>
                <div>
                  <div className={styles.identityBtnTitle}>가치에 동의해서 지지해요</div>
                  <div className={styles.identityBtnDesc}>나는 아니지만 응원해요</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
