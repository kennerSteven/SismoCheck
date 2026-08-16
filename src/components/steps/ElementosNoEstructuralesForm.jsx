import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useFormStore from '../../store/useFormStore';
import { handleFormError } from '../../utils/alerts';

// --- DICCIONARIO DE DATOS ---
const GRUPOS = [
  {
    id: 'fachadas',
    titulo: '1. Fachadas',
    opciones: [
      'Sin daños aparentes',
      'Fisuras o grietas',
      'Baldosas sueltas',
      'Manchas o escurrimientos de humedad'
    ]
  },
  {
    id: 'puertas_ventanas',
    titulo: '2. Puertas y ventanas',
    opciones: [
      'Sin daños aparentes',
      'Puerta rota, caída o suelta',
      'Vidrios rotos',
      'Marcos sueltos'
    ]
  },
  {
    id: 'pisos_cielorasos',
    titulo: '3. Pisos y cielo rasos',
    opciones: [
      'Sin daños aparentes',
      'Piezas de piso sueltas o rotas',
      'Cielo rasos desprendidos o descolgados'
    ]
  },
  {
    id: 'muros_interiores',
    titulo: '4. Muros interiores',
    opciones: [
      'Sin daños aparentes',
      'Piezas de enchape sueltas o rotas',
      'Pintura abombada'
    ]
  },
  {
    id: 'instalaciones',
    titulo: '5. Instalaciones',
    opciones: [
      'Sin daños aparentes',
      'Tubería rota, pérdida de agua',
      'Presión baja',
      'Drenaje lento',
      'Olor a gas',
      'Tubería o cables eléctricos a la vista'
    ]
  },
  {
    id: 'cubiertas',
    titulo: '6. Cubiertas o techo',
    opciones: [
      'Sin daños aparentes',
      'Goteras o humedad',
      'Desprendimiento o rotura de algunas piezas',
      'Colapso (desprendimiento total)',
      'Desnivel o caída para un lado'
    ]
  }
];

const elementosSchema = z.object({
  fachadas: z.array(z.string()).min(1, "Debe seleccionar al menos una opción"),
  puertas_ventanas: z.array(z.string()).min(1, "Debe seleccionar al menos una opción"),
  pisos_cielorasos: z.array(z.string()).min(1, "Debe seleccionar al menos una opción"),
  muros_interiores: z.array(z.string()).min(1, "Debe seleccionar al menos una opción"),
  instalaciones: z.array(z.string()).min(1, "Debe seleccionar al menos una opción"),
  cubiertas: z.array(z.string()).min(1, "Debe seleccionar al menos una opción"),
  sabeTotalMuros: z.string().min(1, "Seleccione una opción"),
  totalMuros: z.string().optional().or(z.literal('')),
  murosConDanos: z.string().min(1, "Este campo es obligatorio"),
  observacionesMuros: z.string().optional().or(z.literal('')),
}).refine(data => {
  if (data.sabeTotalMuros === 'si') {
    return data.totalMuros && data.totalMuros.trim() !== '';
  }
  return true;
}, {
  message: "Especifique el número total de muros",
  path: ["totalMuros"]
}).refine(data => {
  if (data.sabeTotalMuros === 'si' && data.totalMuros && data.murosConDanos) {
    const total = parseInt(data.totalMuros, 10);
    const damages = parseInt(data.murosConDanos, 10);
    if (!isNaN(total) && !isNaN(damages)) {
      return damages <= total;
    }
  }
  return true;
}, {
  message: "Los muros con daños no pueden superar el total de muros",
  path: ["murosConDanos"]
});

// Componente Local: MultiSelectDropdown
const MultiSelectDropdown = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (opt) => {
    if (opt === 'Sin daños aparentes') {
      if (selected.includes(opt)) {
        onChange(selected.filter(i => i !== opt));
      } else {
        onChange([opt]); // Si selecciona Sin daños, deselecciona los demás
      }
      return;
    }

    // Si selecciona un daño, quita "Sin daños aparentes"
    if (selected.includes(opt)) {
      onChange(selected.filter(i => i !== opt));
    } else {
      onChange([...selected.filter(i => i !== 'Sin daños aparentes'), opt]);
    }
  };

  const getLabelText = () => {
    if (selected.length === 0) return 'Seleccionar hallazgos';
    if (selected.length === 1) return '1 hallazgo seleccionado';
    return `${selected.length} hallazgos seleccionados`;
  };

  return (
    <div className="relative w-full md:w-64" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${
          selected.length > 0 
            ? 'border-[#1F3B5F] bg-blue-50/50 text-[#1F3B5F]' 
            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
        }`}
      >
        <span className="truncate">{getLabelText()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto p-2">
            {options.map((opt, i) => (
              <label key={i} className="flex items-start gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors">
                <div className="relative flex items-center pt-0.5">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={selected.includes(opt)}
                    onChange={() => handleToggle(opt)}
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-[#1F3B5F] peer-checked:border-[#1F3B5F] peer-focus:ring-2 peer-focus:ring-blue-500/30 transition-all flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-slate-700 leading-snug group-hover:text-slate-900 select-none">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ElementosNoEstructuralesForm({ onNext }) {
  const { formData, setFormData } = useFormStore();

  const defaultValues = {
    fachadas: formData.step6?.fachadas || [],
    puertas_ventanas: formData.step6?.puertas_ventanas || [],
    pisos_cielorasos: formData.step6?.pisos_cielorasos || [],
    muros_interiores: formData.step6?.muros_interiores || [],
    instalaciones: formData.step6?.instalaciones || [],
    cubiertas: formData.step6?.cubiertas || [],
    sabeTotalMuros: formData.step6?.sabeTotalMuros || '',
    totalMuros: formData.step6?.totalMuros || '',
    murosConDanos: formData.step6?.murosConDanos || '',
    observacionesMuros: formData.step6?.observacionesMuros || '',
  };

  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(elementosSchema),
    defaultValues
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const sabeTotalMuros = watch('sabeTotalMuros');

  // Limpiar totalMuros si selecciona "No"
  useEffect(() => {
    if (sabeTotalMuros === 'no') {
      setValue('totalMuros', '');
    }
  }, [sabeTotalMuros, setValue]);

  const onSubmit = (data) => {
    setFormData('step6', data);
    if (onNext) onNext();
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit, handleFormError)} className="w-full text-slate-700 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Elementos no estructurales</h2>
        <p className="text-slate-500 mt-2 text-base md:text-lg">
          Revise detalladamente los siguientes elementos arquitectónicos y marque todos los hallazgos que apliquen para su construcción.
        </p>
      </div>

      {/* ADVERTENCIA DE SEGURIDAD */}
      <div className="bg-red-50/80 border border-red-200 rounded-xl p-5 mb-8 shadow-sm flex gap-4 animate-pulse-once">
        <div className="shrink-0 pt-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-600">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm text-red-900 leading-relaxed font-medium">
          <strong className="font-extrabold uppercase tracking-wide">Importante:</strong> Si en algún momento siente olor a gas, no prenda fósforos ni apague o prenda luces, ventile el lugar, cierre el registro si es seguro hacerlo, salga de la construcción y llame de inmediato a la línea de emergencias. Si ve chispas, escucha chisporroteo o siente olor a quemado en cables o enchufes, baje los tacos si puede, no toque nada, y llame a emergencias.
        </p>
      </div>

      {/* LISTA DE GRUPOS NO ESTRUCTURALES */}
      <div className="mb-12 border-t border-slate-100">
        {GRUPOS.map((grupo) => (
          <div key={grupo.id} className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-slate-100 gap-4">
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-slate-800 text-lg">{grupo.titulo}</h3>
            </div>
            <div className="flex flex-col items-end">
              <Controller
                name={grupo.id}
                control={control}
                render={({ field }) => (
                  <MultiSelectDropdown
                    options={grupo.opciones}
                    selected={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors[grupo.id] && (
                <span className="text-red-500 text-xs mt-2 font-bold animate-in fade-in">{errors[grupo.id].message}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN 06b: MUROS DE LA CONSTRUCCIÓN */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 mb-10 shadow-sm">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Muros de la construcción</h3>
        <p className="text-slate-500 text-sm mb-6">Complete la siguiente información acerca de los muros (paredes) de su edificación.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col h-full">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
              ¿Sabe cuántos muros (paredes) tiene la construcción?
            </label>
            <div className="relative mt-auto">
              <select
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-800 text-sm focus:outline-none transition-all appearance-none ${
                  errors.sabeTotalMuros ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300 focus:border-[#1F3B5F]'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                  paddingRight: '2.5rem'
                }}
                {...register('sabeTotalMuros')}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
              {errors.sabeTotalMuros && (
                <span className="text-red-500 text-xs mt-1.5 block font-bold animate-in fade-in">{errors.sabeTotalMuros.message}</span>
              )}
            </div>
          </div>

          {sabeTotalMuros === 'si' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col h-full">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                ¿Cuántos muros tiene?
              </label>
              <div className="relative mt-auto">
                <input
                  type="number"
                  min="0"
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-800 text-sm focus:outline-none transition-all ${
                    errors.totalMuros ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300 focus:border-[#1F3B5F]'
                  }`}
                  placeholder="Ej. 20"
                  {...register('totalMuros')}
                />
                {errors.totalMuros && (
                  <span className="text-red-500 text-xs mt-1.5 block font-bold animate-in fade-in">{errors.totalMuros.message}</span>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col h-full">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
              De esos muros, ¿cuántos tienen daños?
            </label>
            <div className="relative mt-auto">
              <input
                type="number"
                min="0"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-800 text-sm focus:outline-none transition-all ${
                  errors.murosConDanos ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300 focus:border-[#1F3B5F]'
                }`}
                placeholder="Ej. 2"
                {...register('murosConDanos')}
              />
              {errors.murosConDanos && (
                <span className="text-red-500 text-xs mt-1.5 block font-bold animate-in fade-in">{errors.murosConDanos.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
            ¿Quieres decir algo más? (opcional)
          </label>
          <textarea
            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-sm focus:outline-none hover:border-slate-300 focus:border-[#1F3B5F] transition-all min-h-[100px] resize-y"
            placeholder="Ej. La ventana de la sala tiene el vidrio roto, hay una gotera en el techo de la cocina..."
            {...register('observacionesMuros')}
          ></textarea>
        </div>
      </div>

    </form>
  );
}
