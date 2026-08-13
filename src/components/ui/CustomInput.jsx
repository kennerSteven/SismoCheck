import React from 'react';

const CustomInput = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 uppercase">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-slate-800 text-sm md:text-base focus:outline-none transition-all duration-200 ${
          error 
            ? 'border-red-500 focus:border-red-600 bg-red-50' 
            : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white'
        } ${className}`}
        {...props}
      />
      {error && (
        <div className="flex items-center gap-1.5 mt-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg w-fit animate-in slide-in-from-top-1 fade-in duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-bold tracking-tight">{error.message}</span>
        </div>
      )}
    </div>
  );
});

CustomInput.displayName = 'CustomInput';
export default CustomInput;
