import React from 'react';
import { RotateCcw } from 'lucide-react';
import StepperHeader from '../ui/StepperHeader';
import CustomButton from '../ui/CustomButton';
import useFormStore from '../../store/useFormStore';

const WizardLayout = ({ children }) => {
  const { currentStep, prevStep, resetDiagnostico, isFooterHidden } = useFormStore();
  const totalSteps = 6;

  const handleReset = () => {
    if (window.confirm("¿Estás seguro de que deseas limpiar todo el formulario y volver al inicio? Perderás los datos ingresados.")) {
      resetDiagnostico();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Fixed Header */}
      <StepperHeader currentStep={currentStep} />
      
      {/* Scrollable Content Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto md:py-8 px-0 md:px-6 flex flex-col">
        <div className="bg-white md:rounded-3xl md:shadow-xl md:shadow-slate-200/50 flex-1 flex flex-col overflow-hidden relative md:border border-slate-100">
          
          {/* Main Form Area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 md:px-10 md:py-8 pb-32 md:pb-10">
            <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
              {children}
            </div>
          </div>

          {/* Fixed Footer for Mobile / Sticky for Desktop */}
          {!isFooterHidden && (
            <div className="bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 md:px-10 fixed md:sticky bottom-0 left-0 right-0 z-20">
              <div className="max-w-3xl mx-auto flex gap-3 md:gap-4 w-full">
                {currentStep > 1 && (
                  <CustomButton 
                    type="button"
                    variant="secondary" 
                    onClick={prevStep}
                    className="w-1/3 md:w-auto md:px-8"
                  >
                    <span className="hidden md:inline">Anterior</span>
                    <span className="md:hidden">Atrás</span>
                  </CustomButton>
                )}
                
                <div className="flex-1 flex gap-2">
                  <CustomButton 
                    type="submit" 
                    form="step-form" 
                    variant="primary"
                    className="flex-[9] md:w-auto md:px-12"
                  >
                    {currentStep === totalSteps ? 'Finalizar diagnóstico' : 'Continuar'}
                    <svg className="w-5 h-5 ml-1 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </CustomButton>
                  
                  <button 
                    type="button"
                    onClick={handleReset}
                    className="flex-[1] flex items-center justify-center bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl transition-colors border border-transparent hover:border-red-200"
                    title="Limpiar y reiniciar todo"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default WizardLayout;
