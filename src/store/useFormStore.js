import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFormStore = create(
  persist(
    (set) => ({
      user: null, // { nombre: string, documento: string }
      login: (nombre, documento) => set({ user: { nombre, documento } }),
      logout: () => set({ user: null, currentStep: 1, formData: { step1: null, step2: null, step3: null, step4: null, step5: null, step6: null } }),
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
      setFormData: (step, data) => 
        set((state) => {
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
      }),
      fillTestData: () => set({
        currentStep: 7,
        formData: {
          step1: {
            nombreDiligenciador: "Ingeniero de Prueba",
            cedulaDiligenciador: "123456789",
            telefonoDiligenciador: "3001234567",
            correoDiligenciador: "prueba@qatro.com",
            municipio: "Bogotá",
            vereda: "-",
            barrio: "Chapinero",
            direccion: "Cra 7 # 60-15",
            usoActual: "comercio",
            numeroPisos: "4",
            numeroSotanos: "1",
            ancho: "10",
            largo: "20",
            anoConstruccion: "2005",
            fotoFachadaUrl: "https://picsum.photos/seed/fachada/400/300",
            latitud: 4.60971,
            longitud: -74.08175
          },
          step2: {
            tipoConstruccion: "porticos_concreto",
            tipoCubierta: "losa_concreto",
            tipoPiso: "losa_concreto"
          },
          step3: {
            tieneFisuras: "si",
            fisurasList: [
              {
                id: "test1",
                elemento: "columna",
                tipo: "diagonal_cortante",
                tamano: "severo",
                evolucion: "aumento_notorio",
                aceros: "Sí",
                corrosion: "No",
                fotoUrl: "https://picsum.photos/seed/fisura1/400/300",
                _raw: { tipo: "diagonal_cortante", fotoUrl: "https://picsum.photos/seed/fisura1/400/300" }
              },
              {
                id: "test2",
                elemento: "muro",
                tipo: "x_cortante",
                tamano: "moderado",
                evolucion: "sin_cambios",
                aceros: "No",
                corrosion: "No",
                fotoUrl: "https://picsum.photos/seed/fisura2/400/300",
                _raw: { tipo: "x_cortante", fotoUrl: "https://picsum.photos/seed/fisura2/400/300" }
              },
              {
                id: "test3",
                elemento: "viga",
                tipo: "vertical_flexion",
                tamano: "leve",
                evolucion: "sin_cambios",
                aceros: "Sí",
                corrosion: "Sí",
                fotoUrl: "https://picsum.photos/seed/fisura3/400/300",
                _raw: { tipo: "vertical_flexion", fotoUrl: "https://picsum.photos/seed/fisura3/400/300" }
              },
              {
                id: "test4",
                elemento: "losa",
                tipo: "paralela",
                tamano: "severo",
                evolucion: "aumento_notorio",
                aceros: "No",
                corrosion: "No",
                fotoUrl: "https://picsum.photos/seed/fisura4/400/300",
                _raw: { tipo: "paralela", fotoUrl: "https://picsum.photos/seed/fisura4/400/300" }
              }
            ]
          },
          step4: {
            uniforme: "si",
            diferencial: "no",
            inclinacion: "no",
            localizado: "si",
            observacionesAsentamiento: "Hundimiento en el patio posterior."
          },
          step5: {
            deslizamiento: "no",
            caida_rocas: "no",
            licuefaccion: "no",
            cimentacion_expuesta: "si",
            observacionesSuelo: "Socavación por fuga de agua."
          },
          step6: {
            fachadas: ["Fisuras o grietas"],
            puertas_ventanas: ["Vidrios rotos"],
            pisos_cielorasos: ["Sin daños aparentes"],
            muros_interiores: ["Sin daños aparentes"],
            instalaciones: ["Tubería rota, pérdida de agua"],
            cubiertas: ["Goteras o humedad"],
            sabeTotalMuros: "si",
            totalMuros: "10",
            murosConDanos: "2"
          }
        }
      })
    }),
    {
      name: 'diagnostico-sismos-storage',
    }
  )
);

export default useFormStore;
