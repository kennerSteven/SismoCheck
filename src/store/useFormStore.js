import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFormStore = create(
  persist(
    (set) => ({
      formData: {
        step1: null,
        step2: null,
        step3: null,
        step4: null,
        step5: null,
        step6: null,
      },
      currentStep: 1,
      isFooterHidden: false,
      setFooterHidden: (hidden) => set({ isFooterHidden: hidden }),
      setFormData: (step, data) => set((state) => {
        console.log(`\n=== DATOS CAPTURADOS: ${step.toUpperCase()} ===`);
        console.log(data);
        console.log('===================================\n');
        return {
          formData: {
            ...state.formData,
            [step]: data
          }
        };
      }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      setStep: (step) => set({ currentStep: step }),
      resetDiagnostico: () => set({
        currentStep: 1,
        formData: { step1: null, step2: null, step3: null, step4: null, step5: null, step6: null }
      })
    }),
    {
      name: 'diagnostico-sismos-storage',
    }
  )
);

export default useFormStore;
