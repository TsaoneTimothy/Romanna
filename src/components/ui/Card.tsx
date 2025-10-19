import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden',
        onClick && 'cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
