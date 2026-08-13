import React from 'react';

const CustomSelect = React.forwardRef(({ label, options, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-xs font-bold text-slate-700 tracking-wide mb-1.5 uppercase">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={`w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-slate-800 text-sm md:text-base appearance-none focus:outline-none transition-all duration-200 ${
            error 
              ? 'border-red-500 focus:border-red-600 bg-red-50' 
              : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white'
          } ${className}`}
          {...props}
        >
          <option value="" disabled hidden>Seleccione...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
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

CustomSelect.displayName = 'CustomSelect';
export default CustomSelect;
