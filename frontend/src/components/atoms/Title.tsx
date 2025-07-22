'use client';

import React from 'react';
import { motion, HTMLMotionProps } from '@/components/motions/motion';

type AllowedMotionTags = 'h1' | 'h2' | 'h3' | 'div' | 'span' | 'p';

interface TitleProps {
  children: React.ReactNode;
  animated?: boolean;
  className?: string;
  as?: AllowedMotionTags;
}

export function Title({
  children,
  animated = false,
  className = '',
  as = 'h1',
}: TitleProps) {
  const baseClasses = `font-display text-4xl font-bold text-white sm:text-5xl ${className}`;

  const MotionTag = motion[as] as React.ElementType;
  const StaticTag = as;

  const animationProps: HTMLMotionProps<'div'> = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  return animated ? (
    <MotionTag className={baseClasses} {...animationProps}>
      {children}
    </MotionTag>
  ) : (
    <StaticTag className={baseClasses}>{children}</StaticTag>
  );
}
