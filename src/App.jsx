import React, { Suspense, lazy } from 'react';
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
        <Suspense fallback={<div className="flex h-64 items-center justify-center text-slate-500 font-medium">Cargando módulo...</div>}>
          {renderStep()}
        </Suspense>
      </WizardLayout>

    </>
  );
}

export default App;
