// src/components/atoms/Logo.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  /**
   * Classes CSS adicionais para o container do logo.
   */
  className?: string;

  /**
   * Tamanho opcional do logo. Por padrão: 150x50.
   */
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  width = 150,
  height = 50,
}) => {
  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      <Image
        src="/RiffaGames Logo Novo.jpg"
        alt="Logo da Riffa Games"
        fill
        sizes={`${width}px`}
        className="object-contain"
        priority
      />
    </div>
  );
};
