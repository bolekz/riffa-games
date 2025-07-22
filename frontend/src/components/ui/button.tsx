'use client'; // ESSENCIAL: Transforma este em um Client Component para permitir animações.

import React from 'react';
// CORREÇÃO: Apontando para o nosso ficheiro wrapper para a framer-motion.
import { motion, HTMLMotionProps } from '@/components/motions/motion'; 

// Interface para as propriedades do botão, permitindo todas as props de um botão HTML.
export interface ButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'default', size = 'default', ...props }, ref) => {
    
    // Mapeamento de variantes para classes de estilo.
    const variantStyles = {
      default:
        // A MELHORIA: Adicionado o efeito de 'glow' no hover e uma transição suave.
        'bg-tron-cyan text-black hover:bg-cyan-300 hover:shadow-glow-cyan transition-all duration-300',
      destructive:
        'bg-red-600 text-white hover:bg-red-500',
      outline:
        // A MELHORIA: Também recebe o efeito de 'glow' no hover.
        'border border-tron-cyan text-tron-cyan hover:bg-tron-cyan/20 hover:shadow-glow-cyan transition-all duration-300',
      ghost:
        'text-white hover:bg-gray-700/50 hover:text-tron-cyan',
    };

    // Mapeamento de tamanhos para classes de estilo.
    const sizeStyles = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    // Estilos base aplicados a todas as variantes do botão.
    const baseStyles =
      // A MELHORIA: Adicionada a fonte 'display' (Rajdhani) para um visual temático.
      "inline-flex items-center justify-center rounded-md text-sm font-medium font-display uppercase tracking-wider " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tron-cyan " +
      "disabled:opacity-50 disabled:pointer-events-none";

    return (
      // Usamos motion.button para herdar as animações da framer-motion.
      <motion.button
        whileHover={{ scale: 1.03 }} // Animação de hover sutil
        whileTap={{ scale: 0.98 }}   // Animação de clique
        transition={{ type: 'spring', stiffness: 400, damping: 15 }} // Física da animação
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export { Button };