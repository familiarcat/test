'use client';

import { ReactNode } from 'react';
import { BentoMotion } from './BentoMotion';
import { cn } from '@/lib/utils';

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
}

export function BentoItem({
  children,
  className = '',
  colSpan = 1,
  rowSpan = 1,
}: BentoItemProps) {
  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
  }[colSpan] || 'col-span-1';

  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
  }[rowSpan] || 'row-span-1';

  return (
    <BentoMotion
      className={cn(
        'rounded-xl backdrop-blur-md',
        'transition-all duration-300',
        'hover:shadow-lg hover:shadow-white/10',
        colSpanClasses,
        rowSpanClasses,
        className
      )}
    >
      {children}
    </BentoMotion>
  );
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div 
      className={cn(
        'grid grid-cols-1 md:grid-cols-3',
        'auto-rows-min',
        'gap-4',
        'w-full h-full',
        'transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
