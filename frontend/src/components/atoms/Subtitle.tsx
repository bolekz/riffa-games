// src/components/atoms/Subtitle.tsx
'use client';

import React from 'react';
import { motion } from '@/components/motions/motion';

interface SubtitleProps {
  children: React.ReactNode;
  animated?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function Subtitle({
  children,
  animated = false,
  className = '',
  as = 'p',
}: SubtitleProps) {
  const Tag = as;

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (animated) {
    return (
      <motion.p
        className={`text-xl text-tron-gray-light sm:text-2xl ${className}`}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: 'easeOut' }}
        variants={variants}
      >
        {children}
      </motion.p>
    );
  }

  return (
    <Tag className={`text-xl text-tron-gray-light sm:text-2xl ${className}`}>
      {children}
    </Tag>
  );
}
