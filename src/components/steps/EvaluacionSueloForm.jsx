import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useFormStore from '../../store/useFormStore';

// --- DICCIONARIO DE DATOS ---
const EVALUACION_CARDS = [
  {
    id: 'deslizamiento',
    titulo: 'Deslizamiento de tierras',
    descripcion: 'Mire el lote y los alrededores, si hay una loma, ladera o corte de tierra cerca. ¿Ve grietas largas en el suelo, como si la tierra se hubiera partido en pedazos; una parte del terreno que se ve hundida o corrida hacia abajo; árboles, postes o cercas inclinados sin razón; o tierra y lodo acumulados en la parte baja del lote?',
  },
  {
    id: 'caida_rocas',
    titulo: 'Caída de rocas',
    descripcion: 'Revise. ¿Ve piedras o rocas sueltas en la parte alta que se puedan caer, rocas que ya cayeron y quedaron cerca de la construcción, o golpes y marcas recientes de piedras en paredes, techos o el piso?',
  },
  {
    id: 'licuefaccion',
    titulo: 'Licuefacción',
    descripcion: '¿El suelo parece arena movediza, gelatina o lodo blando, en vez de solar firme? ¿Ha visto que salga arena o agua del suelo sin explicación?',
  },
  {
    id: 'cimentacion_expuesta',
    titulo: 'Cimentación expuesta',
    descripcion: 'Mire la base de la construcción. ¿Se alcanza a ver la estructura, como si la tierra de alrededor se hubiera lavado, erosionado o caído?',
  }
];

const OPTIONS = [
  { value: '', label: 'Seleccione...' },
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
  { value: 'nose', label: 'No sé' },
];

const evaluacionSueloSchema = z.object({
  deslizamiento: z.string().min(1, "Seleccione una opción"),
  caida_rocas: z.string().min(1, "Seleccione una opción"),
  licuefaccion: z.string().min(1, "Seleccione una opción"),
  cimentacion_expuesta: z.string().min(1, "Seleccione una opción"),
  observacionesSuelo: z.string().optional().or(z.literal('')),
});

export default function EvaluacionSueloForm({ onNext }) {
  const { formData, setFormData } = useFormStore();

  const defaultValues = {
    deslizamiento: formData.step5?.deslizamiento || '',
    caida_rocas: formData.step5?.caida_rocas || '',
    licuefaccion: formData.step5?.licuefaccion || '',
    cimentacion_expuesta: formData.step5?.cimentacion_expuesta || '',
    observacionesSuelo: formData.step5?.observacionesSuelo || '',
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(evaluacionSueloSchema),
    defaultValues
  });

  const onSubmit = (data) => {
    setFormData('step5', data);
    if (onNext) onNext();
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="w-full text-slate-700 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Evaluación del suelo</h2>
        <p className="text-slate-500 mt-2 text-base md:text-lg">
          Revise el terreno alrededor de la construcción (el lote, los taludes o laderas cercanas, y la base de la construcción). Para cada punto responda si lo observa: Sí, No, o No sé.
        </p>
      </div>

      {/* GRID DE EVALUACIÓN (4 TARJETAS) */}
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EVALUACION_CARDS.map((card) => (
            <div key={card.id} className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${errors[card.id] ? 'border-red-300 bg-red-50/30' : 'border-slate-100 bg-white hover:border-slate-300 shadow-sm'}`}>
              
              {/* Imagen Placeholder */}
              <div className="w-full h-36 bg-slate-100 flex flex-col items-center justify-center text-slate-400 font-medium text-sm">
                [Imagen]
              </div>
              
              {/* Contenido de la Tarjeta */}
              <div className="p-5 flex flex-col h-[calc(100%-9rem)]">
                <h4 className="font-extrabold text-slate-800 text-[15px] mb-2 leading-snug">{card.titulo}</h4>
                <p className="text-xs text-slate-500 mb-5 flex-1">{card.descripcion}</p>
                
                {/* Select Input */}
                <div className="mt-auto">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    ¿LO OBSERVA?
                  </label>
                  <div className="relative">
                    <select
                      className={`w-full px-3 py-2.5 rounded-lg border-2 bg-slate-50 text-slate-700 text-sm focus:outline-none transition-all appearance-none font-medium ${
                        errors[card.id]
                          ? 'border-red-400 focus:border-red-500 bg-red-50'
                          : 'border-slate-200 hover:border-slate-300 focus:border-[#1F3B5F] focus:bg-white'
                      }`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25em 1.25em',
                        paddingRight: '2rem'
                      }}
                      {...register(card.id)}
                    >
                      {OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {errors[card.id] && (
                      <span className="text-red-500 text-xs mt-1.5 block font-bold tracking-tight animate-in fade-in">
                        {errors[card.id].message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OBSERVACIONES (TEXTAREA) */}
      <div className="mb-12">
        <label className="block text-xs font-bold text-slate-600 uppercase mb-0.5">
          ¿QUIERES DECIR ALGO MÁS?
        </label>
        <span className="block text-[11px] text-slate-500 mb-2">opcional</span>
        <textarea
          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-sm md:text-base focus:outline-none hover:border-slate-300 focus:border-[#1F3B5F] focus:bg-white transition-all duration-200 min-h-[120px] resize-y"
          placeholder="Ej. Hay una grieta larga en el patio, cerca del talud del vecino..."
          {...register('observacionesSuelo')}
        ></textarea>
      </div>
      
    </form>
  );
}
