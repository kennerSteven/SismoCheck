import React from 'react';
import { Loader2 } from 'lucide-react';

const CustomButton = ({ children, isLoading, disabled, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-4 md:py-3.5 text-sm md:text-base font-bold rounded-2xl md:rounded-xl transition-all duration-200 active:scale-[0.98] overflow-hidden group";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_8px_16px_-6px_rgba(37,99,235,0.4)]",
    secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
  };

  const isDisabled = isLoading || disabled;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${isDisabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {/* Shine effect for primary button */}
      {variant === 'primary' && !isDisabled && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
      )}
      
      {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
      <span className="flex items-center gap-2 relative z-10">
        {children}
      </span>
    </button>
  );
};

export default CustomButton;
