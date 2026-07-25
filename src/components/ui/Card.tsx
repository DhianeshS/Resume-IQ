import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', id }) => {
  return (
    <div
      id={id}
      className={`bg-white rounded-[16px] border border-gray-100 p-6 shadow-sm shadow-gray-200/50 ${className}`}
    >
      {children}
    </div>
  );
};
