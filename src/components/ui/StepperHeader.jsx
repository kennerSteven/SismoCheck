import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, title: 'Datos básicos' },
  { id: 2, title: 'Sistema estructural' },
  { id: 3, title: 'Fisuras, grietas, fallas' },
  { id: 4, title: 'Asentamiento' },
  { id: 5, title: 'Evaluación del suelo' },
  { id: 6, title: 'Elementos no estructurales' },
  { id: 7, title: 'Resumen' }
];

const StepperHeader = ({ currentStep }) => {
  return (
    <div className="w-full bg-white px-5 py-4 md:px-8 md:py-6 border-b border-slate-100 shadow-sm z-20 sticky top-0 overflow-hidden">
      
      {/* --- Mobile View (Compact Progress Bar) --- */}
      <div className="md:hidden">
        <div className="flex justify-between items-end mb-2.5">
          <div className="flex flex-col max-w-[80%]">
            <span className="text-[10px] font-extrabold text-blue-600 tracking-widest uppercase mb-0.5">Paso {currentStep} de {steps.length}</span>
            <span className="text-sm font-bold text-slate-800 leading-tight truncate">{steps[currentStep - 1]?.title}</span>
          </div>
          <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg shrink-0">
            {Math.round((currentStep / steps.length) * 100)}%
          </div>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          >
             <div className="absolute inset-0 bg-white/20 w-full animate-[shine_2s_infinite]" />
          </div>
        </div>
      </div>

      {/* --- Desktop View (Visual Stepper) --- */}
      <div className="hidden md:flex items-center justify-between w-full max-w-6xl mx-auto px-4 pb-8">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none relative">
              
              {/* Círculo del paso */}
              <div className="flex flex-col items-center z-10 group relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                      : isActive 
                        ? 'bg-white border-2 border-blue-600 text-blue-600 scale-110 shadow-lg shadow-blue-600/20' 
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" strokeWidth={3} /> : step.id}
                </div>
                
                {/* Título debajo del círculo */}
                <span 
                  className={`absolute top-12 text-[10px] xl:text-[11px] font-bold tracking-wide text-center leading-tight transition-colors duration-300 w-24 xl:w-28 ${
                    isActive ? 'text-blue-700' : isCompleted ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              
              {/* Línea conectora */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 xl:mx-4 h-[3px] rounded-full bg-slate-100 overflow-hidden relative mt-[-10px]">
                   <div className={`absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 ease-out ${isCompleted ? 'w-full' : 'w-0'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperHeader;
