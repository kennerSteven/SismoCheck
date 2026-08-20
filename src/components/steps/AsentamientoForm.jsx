import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useFormStore from '../../store/useFormStore';
import { handleFormError } from '../../utils/alerts';

import imgUniforme from '../../assets/fotos/04_Asentamiento/uniforme__Asentamiento uniforme (parejo).jpg';
import imgDiferencial from '../../assets/fotos/04_Asentamiento/diferencial__Asentamiento diferencial (un lado baja más que el otro).jpg';
import imgInclinacion from '../../assets/fotos/04_Asentamiento/inclinacion__Inclinación general de toda la construcción (inclinación muy notoria).jpg';
import imgLocalizado from '../../assets/fotos/04_Asentamiento/localizado__Hundimiento localizado (una sola zona, esquina o columna dentro de la construcción).jpg';

import videoCanica from '../../assets/Media/inclinacion en suelos.mp4';
import videoPlomada from '../../assets/Media/Inclinacion vertical.mp4';

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
  realizoPruebaCanica: z.string().min(1, "Seleccione una opción"),
  rapidezCanica: z.string().optional(),
  realizoPruebaPlomada: z.string().min(1, "Seleccione una opción"),
  uniforme: z.string().min(1, "Seleccione una opción"),
  diferencial: z.string().min(1, "Seleccione una opción"),
  inclinacion: z.string().min(1, "Seleccione una opción"),
  localizado: z.string().min(1, "Seleccione una opción"),
  observacionesAsentamiento: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.realizoPruebaCanica === 'si' && !data.rapidezCanica) {
    ctx.addIssue({
      path: ['rapidezCanica'],
      code: z.ZodIssueCode.custom,
      message: 'Seleccione una opción'
    });
  }
});

export default function AsentamientoForm({ onNext }) {
  const { formData, setFormData } = useFormStore();

  const defaultValues = {
    realizoPruebaCanica: formData.step4?.realizoPruebaCanica || '',
    rapidezCanica: formData.step4?.rapidezCanica || '',
    realizoPruebaPlomada: formData.step4?.realizoPruebaPlomada || '',
    uniforme: formData.step4?.uniforme || '',
    diferencial: formData.step4?.diferencial || '',
    inclinacion: formData.step4?.inclinacion || '',
    localizado: formData.step4?.localizado || '',
    observacionesAsentamiento: formData.step4?.observacionesAsentamiento || '',
  };

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(asentamientoSchema),
    defaultValues
  });
  
  const realizoPruebaCanicaValue = watch('realizoPruebaCanica');

  const onSubmit = (data) => {
    setFormData('step4', data);
    if (onNext) onNext();
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit, handleFormError)} className="w-full text-slate-700 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Asentamiento e inclinación</h2>
        <p className="text-slate-500 mt-2 text-base md:text-lg">
          Evalúe si la edificación presenta hundimientos, desniveles o inclinaciones evidentes usando pruebas sencillas o mediante observación visual.
        </p>
      </div>

      {/* INSTRUCCIONES INICIALES (PRUEBAS) */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        
        {/* TARJETA CANICA */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm hover:border-[#1F3B5F] hover:shadow-md transition-all">
          <div className="w-full relative bg-slate-100">
            <video 
              src={videoCanica} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-48 md:h-56 object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#1F3B5F] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-2">
              <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center">1</span>
              La Canica
            </div>
          </div>
          <div className="p-5 md:p-6 flex flex-col flex-1">
            <p className="text-slate-700 font-medium text-sm mb-4 leading-relaxed">
              Suéltela en el centro del cuarto, sin empujarla. Si rueda sola hacia el mismo lado, ahí está más bajo.
            </p>
            <p className="text-[#a5432b] text-sm mb-6 leading-relaxed">
              <span className="font-bold">Importante:</span> no haga esta prueba en el baño. El piso del baño tiene una pendiente hecha a propósito para que el agua corra hacia el desagüe, así que la canica siempre rodará, aunque no haya ningún problema de asentamiento. Hágala en una habitación, sala, comedor u otro cuarto con piso plano.
            </p>
            <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="block text-[10px] md:text-xs font-mono font-bold text-slate-500 uppercase tracking-tight mb-2 leading-tight">
                ¿USTED REALIZÓ ESTA PRUEBA (LA DE LA CANICA) EN LA CONSTRUCCIÓN?
              </label>
              <select
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-800 text-sm font-medium focus:outline-none transition-colors appearance-none ${
                  errors.realizoPruebaCanica ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300 focus:border-[#1F3B5F]'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                  paddingRight: '2.5rem'
                }}
                {...register('realizoPruebaCanica')}
              >
                <option value="">Seleccione...</option>
                <option value="no">No, no la realicé</option>
                <option value="si">Sí, la realicé</option>
              </select>
              {errors.realizoPruebaCanica && <span className="text-red-500 text-xs mt-2 block font-bold">{errors.realizoPruebaCanica.message}</span>}
              
              {realizoPruebaCanicaValue === 'si' && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <label className="block text-[10px] md:text-xs font-mono font-bold text-slate-500 uppercase tracking-tight mb-2 leading-tight">
                    ¿QUÉ TAN RÁPIDO SE MOVIÓ LA CANICA?
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-800 text-sm font-medium focus:outline-none transition-colors appearance-none ${
                      errors.rapidezCanica ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300 focus:border-[#1F3B5F]'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 1rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.25em 1.25em',
                      paddingRight: '2.5rem'
                    }}
                    {...register('rapidezCanica')}
                  >
                    <option value="">Seleccione...</option>
                    <option value="quieta">No se movió, quedó quieta</option>
                    <option value="lento">Se movió lento</option>
                    <option value="rapido">Se movió rápido</option>
                  </select>
                  {errors.rapidezCanica && <span className="text-red-500 text-xs mt-2 block font-bold">{errors.rapidezCanica.message}</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TARJETA PLOMADA */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm hover:border-[#1F3B5F] hover:shadow-md transition-all">
          <div className="w-full relative bg-slate-100">
            <video 
              src={videoPlomada} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-48 md:h-56 object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#1F3B5F] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-2">
              <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center">2</span>
              La Plomada
            </div>
          </div>
          <div className="p-5 md:p-6 flex flex-col flex-1">
            <p className="text-slate-700 font-medium text-sm mb-6 leading-relaxed">
              Cuelgue un hilo con peso desde arriba de la pared. Si se separa de la pared, hay inclinación.
            </p>
            <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="block text-[10px] md:text-xs font-mono font-bold text-slate-500 uppercase tracking-tight mb-2 leading-tight">
                ¿USTED REALIZÓ ESTA PRUEBA (LA DE LA PLOMADA) EN LA CONSTRUCCIÓN?
              </label>
              <select
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-800 text-sm font-medium focus:outline-none transition-colors appearance-none ${
                  errors.realizoPruebaPlomada ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300 focus:border-[#1F3B5F]'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                  paddingRight: '2.5rem'
                }}
                {...register('realizoPruebaPlomada')}
              >
                <option value="">Seleccione...</option>
                <option value="no">No, no la realicé</option>
                <option value="si">Sí, la realicé</option>
              </select>
              {errors.realizoPruebaPlomada && <span className="text-red-500 text-xs mt-2 block font-bold">{errors.realizoPruebaPlomada.message}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE EVALUACIÓN (4 TARJETAS) */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">¿Qué observa?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ASENTAMIENTO_CARDS.map((card) => (
            <div key={card.id} className={`flex flex-col h-full border-2 rounded-2xl overflow-hidden transition-all duration-300 ${errors[card.id] ? 'border-red-300 bg-red-50/30' : 'border-slate-100 bg-white hover:border-slate-300 shadow-sm'}`}>
              
              {/* Imagen */}
              <div className="w-full h-64 bg-white p-4 pt-8 flex flex-col items-center justify-center overflow-hidden">
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
