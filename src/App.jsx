import React, { Suspense, lazy, useEffect } from 'react';
import WizardLayout from './components/layout/WizardLayout';
import ModalColapsoPrevio from './components/steps/ModalColapsoPrevio';
import Login from './components/auth/Login';
import useFormStore from './store/useFormStore';

// Lógica de Performance Serverless:
// Para soportar picos de alto tráfico simultáneo (miles de inspectores),
// los formularios pesados se importan con Lazy Loading. 
// Esto reduce dramáticamente el tamaño del bundle inicial y el Time To Interactive de la pantalla de Login.
const Step1 = lazy(() => import('./components/steps/Step1'));
const SistemaEstructuralForm = lazy(() => import('./components/steps/SistemaEstructuralForm'));
const FisurasForm = lazy(() => import('./components/steps/FisurasForm'));
const AsentamientoForm = lazy(() => import('./components/steps/AsentamientoForm'));
const EvaluacionSueloForm = lazy(() => import('./components/steps/EvaluacionSueloForm'));
const ElementosNoEstructuralesForm = lazy(() => import('./components/steps/ElementosNoEstructuralesForm'));
const ResumenForm = lazy(() => import('./components/steps/ResumenForm'));

function App() {
  const { currentStep, nextStep } = useFormStore();

  const logout = useFormStore(state => state.logout);

  useEffect(() => {
    if (!useFormStore.getState().user) return;

    const TEN_MINUTES = 10 * 60 * 1000;

    // Verificar si expiró mientras la página estaba cerrada
    const lastActive = localStorage.getItem('qatro_last_active');
    if (lastActive && Date.now() - parseInt(lastActive, 10) > TEN_MINUTES) {
      logout();
      return; // Ya no iniciamos los listeners porque se cerró sesión
    }

    let timeoutId;
    const resetTimer = () => {
      localStorage.setItem('qatro_last_active', Date.now().toString());
      clearTimeout(timeoutId);
      // 10 minutos de inactividad
      timeoutId = setTimeout(() => {
        logout();
      }, TEN_MINUTES);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Inicializar timer
    resetTimer();
    
    // Agregar event listeners
    events.forEach(event => document.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [logout]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={nextStep} />;
      case 2:
        return <SistemaEstructuralForm onNext={nextStep} onPrev={() => useFormStore.getState().prevStep()} />;
      case 3:
        return <FisurasForm onNext={nextStep} />;
      case 4:
        return <AsentamientoForm onNext={nextStep} />;
      case 5:
        return <EvaluacionSueloForm onNext={nextStep} />;
      case 6:
        return <ElementosNoEstructuralesForm onNext={nextStep} />;
      case 7:
        return <ResumenForm />;
      // ... more steps will go here
      default:
        return (
          <div className="step-form">
            <h2>Paso {currentStep} (Próximamente)</h2>
          </div>
        );
    }
  };

  if (!useFormStore(state => state.user)) {
    return <Login />;
  }

  return (
    <>
      <ModalColapsoPrevio />
      <WizardLayout>
        {/* Usamos Suspense para mostrar un fallback ligero mientras se descarga el chunk del formulario por demanda */}
        <Suspense fallback={
          <div className="flex flex-col h-64 items-center justify-center text-[#1F3B5F] font-bold tracking-wide gap-4 animate-in fade-in duration-300">
            <svg className="animate-spin h-10 w-10 text-[#1F3B5F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando...
          </div>
        }>
          {renderStep()}
        </Suspense>
      </WizardLayout>

    </>
  );
}

export default App;
