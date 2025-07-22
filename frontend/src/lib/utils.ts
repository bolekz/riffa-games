// src/lib/utils.ts

import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Função utilitária para combinar classes Tailwind com segurança.
 * Usa clsx para lidar com lógicas condicionais e tailwind-merge para evitar conflitos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
