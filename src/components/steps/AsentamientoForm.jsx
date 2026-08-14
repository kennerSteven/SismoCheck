import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useFormStore from '../../store/useFormStore';

import imgUniforme from '../../assets/fotos/05_Terreno_cimentacion_asentamientos/Asentamientos_deformaciones/5_Asentamiento_uniforme_parejo.png';
import imgDiferencial from '../../assets/fotos/05_Terreno_cimentacion_asentamientos/Asentamientos_deformaciones/6_Asentamiento_diferencial.png';
import imgInclinacion from '../../assets/fotos/05_Terreno_cimentacion_asentamientos/Asentamientos_deformaciones/7_Inclinacion_general_construccion.png';
import imgLocalizado from '../../assets/fotos/05_Terreno_cimentacion_asentamientos/Asentamientos_deformaciones/8_Hundimiento_localizado.png';

// --- DICCIONARIO DE DATOS ---
const ASENTAMIENTO_CARDS = [
  {
    id: 'uniforme',
    titulo: 'Asentamiento uniforme [pasan]',
    descripcion: 'Toda la construcción baja al mismo ritmo, sin doblarse hasta ningún lado, sin desniveles.',
    imageSrc: imgUniforme
  },
  {
    id: 'diferencial',
    titulo: 'Asentamiento diferencial [un lado baja más que el otro]',
    descripcion: 'Una parte de la construcción baja más que el resto.',
    imageSrc: imgDiferencial
  },
  {
    id: 'inclinacion',
    titulo: 'Inclinación general de toda la construcción [Inclinación muy distinta]',
    descripcion: 'Toda la construcción se inclina hacia un lado como una torre inclinada.',
    imageSrc: imgInclinacion
  },
  {
    id: 'localizado',
    titulo: 'Hundimiento localizado [una sola esquina, esquina o columna dentro de la construcción]',
    descripcion: 'Hundimiento localizado en su misma área abierta.',
    imageSrc: imgLocalizado
  }
];

const OPTIONS = [
  { value: '', label: 'Seleccione...' },
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
  { value: 'nosabe', label: 'No sabe' },
];

const asentamientoSchema = z.object({
  uniforme: z.string().min(1, "Seleccione una opción"),
  diferencial: z.string().min(1, "Seleccione una opción"),
  inclinacion: z.string().min(1, "Seleccione una opción"),
  localizado: z.string().min(1, "Seleccione una opción"),
  observacionesAsentamiento: z.string().optional().or(z.literal('')),
});

export default function AsentamientoForm({ onNext }) {
  const { formData, setFormData } = useFormStore();

  const defaultValues = {
    uniforme: formData.step4?.uniforme || '',
    diferencial: formData.step4?.diferencial || '',
    inclinacion: formData.step4?.inclinacion || '',
    localizado: formData.step4?.localizado || '',
    observacionesAsentamiento: formData.step4?.observacionesAsentamiento || '',
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(asentamientoSchema),
    defaultValues
  });

  const onSubmit = (data) => {
    setFormData('step4', data);
    if (onNext) onNext();
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="w-full text-slate-700 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Asentamiento e inclinación</h2>
        <p className="text-slate-500 mt-2 text-base md:text-lg">
          Evalúe si la edificación presenta hundimientos, desniveles o inclinaciones evidentes usando pruebas sencillas o mediante observación visual.
        </p>
      </div>

      {/* INSTRUCCIONES INICIALES (PRUEBAS) */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            PRUEBA 1... LA CANICA
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Coloque una canica o elemento esférico en el piso. Si rueda hacia un lado específico de manera acelerada, puede indicar un hundimiento o desnivel importante en esa dirección.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
            <span className="bg-slate-200 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            PRUEBA 2... LA PLOMADA
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Desde la parte superior de un muro o columna, deje caer una plomada (o un peso atado a una cuerda). Si la distancia entre la cuerda y la pared varía drásticamente abajo, la construcción podría estar inclinada.
          </p>
        </div>
      </div>

      {/* GRID DE EVALUACIÓN (4 TARJETAS) */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">¿Qué observa?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ASENTAMIENTO_CARDS.map((card) => (
            <div key={card.id} className={`flex flex-col h-full border-2 rounded-2xl overflow-hidden transition-all duration-300 ${errors[card.id] ? 'border-red-300 bg-red-50/30' : 'border-slate-100 bg-white hover:border-slate-300 shadow-sm'}`}>
              
              {/* Imagen */}
              <div className="w-full h-56 bg-white p-2 flex flex-col items-center justify-center overflow-hidden">
                {card.imageSrc ? (
                  <img src={card.imageSrc} alt={card.titulo} className="w-full h-full object-contain transition-transform duration-500 hover:scale-110" />
                ) : (
                  <span className="text-slate-400 font-medium text-sm">[Imagen]</span>
                )}
              </div>
              
              {/* Contenido de la Tarjeta */}
              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-extrabold text-slate-800 text-[15px] mb-2 leading-snug">{card.titulo}</h4>
                <p className="text-xs text-slate-500 mb-5 flex-1">{card.descripcion}</p>
                
                {/* Select Input */}
                <div className="mt-auto">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    ¿Presenta este problema?
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
          ¿Quieres anotar notas adicionales?
        </label>
        <span className="block text-[11px] text-slate-500 mb-2">opcional</span>
        <textarea
          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-sm md:text-base focus:outline-none hover:border-slate-300 focus:border-[#1F3B5F] focus:bg-white transition-all duration-200 min-h-[120px] resize-y"
          placeholder="Ej. La esquina del garaje se hunde más que el resto, la puerta principal ya no cierra bien..."
          {...register('observacionesAsentamiento')}
        ></textarea>
      </div>
      
    </form>
  );
}
