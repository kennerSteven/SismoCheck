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
          console.log(`[FormStore DEBUG] Guardando datos para la fase: ${step}`);
          console.log(`[FormStore DEBUG] Datos capturados:`, data);
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
            fotoFachadaUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
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
                tamano: "w4",
                evolucion: "lento",
                aceros: "Sí",
                corrosion: "No",
                fotoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
                _raw: { tipo: "diagonal_cortante", fotoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" }
              },
              {
                id: "test2",
                elemento: "Muro",
                tipo: "cruzadas",
                tamano: "w3",
                evolucion: "igual",
                aceros: "No",
                corrosion: "No",
                fotoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
                _raw: { tipo: "cruzadas", fotoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" }
              },
              {
                id: "test3",
                elemento: "Viga",
                tipo: "vertical",
                tamano: "w2",
                evolucion: "igual",
                aceros: "Sí",
                corrosion: "Sí",
                fotoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
                _raw: { tipo: "vertical", fotoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" }
              },
              {
                id: "test4",
                elemento: "Piso",
                tipo: "escalonada",
                tamano: "w5",
                evolucion: "notorio",
                aceros: "No",
                corrosion: "No",
                fotoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
                _raw: { tipo: "escalonada", fotoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" }
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
