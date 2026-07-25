import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseStyle = "px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-sm focus:outline-none";
  const variants = {
    primary: "bg-[#2563EB] hover:bg-blue-700 text-white shadow-blue-500/10",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    outline: "border border-gray-200 hover:bg-gray-50 text-gray-800",
    ghost: "hover:bg-gray-100 text-gray-700",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
