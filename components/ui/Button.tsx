import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden px-6 py-4 rounded-2xl font-bold tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 hover:brightness-110 border border-emerald-300/20",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700",
    danger: "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:brightness-110 border border-rose-400/20",
    ghost: "bg-transparent hover:bg-white/10 text-slate-200 shadow-none",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};