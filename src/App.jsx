import React from 'react';
import WizardLayout from './components/layout/WizardLayout';
import Step1 from './components/steps/Step1';
import SistemaEstructuralForm from './components/steps/SistemaEstructuralForm';
import FisurasForm from './components/steps/FisurasForm';
import AsentamientoForm from './components/steps/AsentamientoForm';
import EvaluacionSueloForm from './components/steps/EvaluacionSueloForm';
import ElementosNoEstructuralesForm from './components/steps/ElementosNoEstructuralesForm';
import useFormStore from './store/useFormStore';

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
      // ... more steps will go here
      default:
        return (
          <div className="step-form">
            <h2>Paso {currentStep} (Próximamente)</h2>
          </div>
        );
    }
  };

  return (
    <WizardLayout>
      {renderStep()}
    </WizardLayout>
  );
}

export default App;
