'use client';

import React from 'react';
import styles from './Chip.module.css';

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  active?: boolean;
  clickable?: boolean;
}

export default function Chip({
  children,
  active = false,
  clickable = false,
  className = '',
  ...props
}: ChipProps) {
  return (
    <span
      className={[
        styles.chip,
        active ? styles.active : '',
        clickable ? styles.clickable : '',
        className,
      ].join(' ')}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </span>
  );
}
