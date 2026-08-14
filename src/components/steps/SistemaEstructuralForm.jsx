import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useFormStore from '../../store/useFormStore';

import { CONSTRUCCION_OPTIONS, CUBIERTA_OPTIONS } from '../../constants/sistemaEstructuralData';

import imgPisoCemento from '../../assets/fotos/04_Pisos_y_cubiertas/Tipo_de_piso/1_Piso_duro_cemento.png';
import imgPisoTierra from '../../assets/fotos/04_Pisos_y_cubiertas/Tipo_de_piso/2_Piso_en_tierra.png';
import imgPisoMadera from '../../assets/fotos/04_Pisos_y_cubiertas/Tipo_de_piso/3_Piso_en_madera.png';
import imgPisoOtro from '../../assets/fotos/04_Pisos_y_cubiertas/Tipo_de_piso/4_Otro_no_se.png';

const PISO_OPTIONS = [
  { id: 'cemento', titulo: 'Piso duro en cemento', descripcion: 'Cualquier tipo de acabado duro sobre cemento.', imageSrc: imgPisoCemento },
  { id: 'tierra', titulo: 'Piso en tierra', descripcion: 'Suelo natural, sin cubierta rígida.', imageSrc: imgPisoTierra },
  { id: 'madera', titulo: 'Piso en madera', descripcion: 'Tablones o estibas de madera.', imageSrc: imgPisoMadera },
  { id: 'otro', titulo: 'Otro / No sé', descripcion: 'No es claro el tipo de piso.', imageSrc: imgPisoOtro }
];

const sistemaEstructuralSchema = z.object({
  tipoConstruccion: z.string().min(1, "Seleccione un tipo de construcción"),
  descripcionConstruccion: z.string().optional().or(z.literal('')),
  tipoCubierta: z.string().min(1, "Seleccione un tipo de cubierta"),
  tipoPiso: z.string().min(1, "Seleccione un tipo de piso"),
});
const SelectableImageCard = ({ title, description, imageSrc, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 flex flex-col h-full bg-white group ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50/50 shadow-md' 
          : 'border-2 border-slate-100 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="h-56 w-full bg-white p-2 flex items-center justify-center overflow-hidden relative">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className={`w-full h-full object-contain transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-110'}`} />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 font-medium text-sm">
            [Imagen]
          </div>
        )}
        
        {/* Animated Check Overlay */}
        <div className={`absolute inset-0 bg-blue-500/20 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}></div>
        
        <div className={`absolute top-3 right-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isSelected ? 'scale-100' : 'scale-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col items-center text-center justify-center relative">
        <h3 className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{title}</h3>
        {description && <p className="text-xs text-slate-500 mt-1.5">{description}</p>}
      </div>
    </div>
  );
};

export default function SistemaEstructuralForm({ onNext }) {
  const { formData, setFormData } = useFormStore();
  
  const defaultValues = {
    tipoConstruccion: formData.step2?.tipoConstruccion || '',
    descripcionConstruccion: formData.step2?.descripcionConstruccion || '',
    tipoCubierta: formData.step2?.tipoCubierta || '',
    tipoPiso: formData.step2?.tipoPiso || '',
  };

  const { control, register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(sistemaEstructuralSchema),
    defaultValues
  });

  const onSubmit = (data) => {
    setFormData('step2', data);
    if (onNext) onNext();
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="w-full text-slate-700">
      
      {/* SECCIÓN 1: Construcción */}
      <div className="mb-10">
        <div className="mb-6 md:mb-8 px-2 md:px-0">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">¿Cómo está construida la edificación?</h2>
          <p className="text-slate-500 mt-2 text-base md:text-lg">Observe las columnas, muros y cubierta (techo) y elija la imagen que más se parezca. Seleccione una opción.</p>
        </div>

        <Controller
          name="tipoConstruccion"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.values(CONSTRUCCION_OPTIONS).map((item) => (
                <SelectableImageCard
                  key={item.id}
                  title={item.titulo}
                  description={item.descripcion}
                  imageSrc={item.imageSrc}
                  isSelected={field.value === item.id}
                  onClick={() => field.onChange(item.id)}
                />
              ))}
            </div>
          )}
        />
        {errors.tipoConstruccion && (
          <span className="text-red-600 text-xs mt-3 block font-medium">{errors.tipoConstruccion.message}</span>
        )}
      </div>

      {/* SECCIÓN 1.1: Textarea Opcional */}
      <div className="mb-12 px-2 md:px-0">
        <label className="block text-xs font-bold text-slate-600 uppercase mb-0.5">
          ¿QUIERES DECIR ALGO MÁS?
        </label>
        <span className="block text-[11px] text-slate-500 mb-2">opcional</span>
        <textarea 
          className={`w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-slate-800 text-sm md:text-base focus:outline-none transition-all duration-200 min-h-[120px] resize-y ${
            errors.descripcionConstruccion 
              ? 'border-red-500 focus:border-red-600 bg-red-50' 
              : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white'
          }`}
          placeholder="Ej. Primer piso en pórticos de concreto, segundo piso ampliado en mampostería no reforzada..."
          {...register('descripcionConstruccion')}
        ></textarea>
        {errors.descripcionConstruccion && (
          <div className="flex items-center gap-1.5 mt-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg w-fit animate-in slide-in-from-top-1 fade-in duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            <span className="text-sm font-bold tracking-tight">{errors.descripcionConstruccion.message}</span>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: Tipo de cubierta */}
      <div className="mb-10">
        <div className="mb-6 md:mb-8 px-2 md:px-0 pt-6 border-t border-slate-200">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Tipo de cubierta o techo</h2>
          <p className="text-slate-500 mt-2 text-base md:text-lg">Observe el techo de la construcción desde afuera o desde adentro. Seleccione una opción.</p>
        </div>

        <Controller
          name="tipoCubierta"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Object.values(CUBIERTA_OPTIONS).map((item) => (
                <SelectableImageCard
                  key={item.id}
                  title={item.titulo}
                  description={item.descripcion}
                  imageSrc={item.imageSrc}
                  isSelected={field.value === item.id}
                  onClick={() => field.onChange(item.id)}
                />
              ))}
            </div>
          )}
        />
        {errors.tipoCubierta && (
          <span className="text-red-600 text-xs mt-3 block font-medium">{errors.tipoCubierta.message}</span>
        )}
      </div>

      {/* SECCIÓN 3: Tipo de piso */}
      <div className="mb-10 px-2 md:px-0 pt-6 border-t border-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Tipo de piso</h2>
          <p className="text-slate-500 mt-2 text-base md:text-lg">¿El piso de la construcción es duro en cemento (sin importar el acabado), en tierra, o en madera?</p>
        </div>
        
        <Controller
          name="tipoPiso"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PISO_OPTIONS.map((item) => (
                <SelectableImageCard
                  key={item.id}
                  title={item.titulo}
                  description={item.descripcion}
                  imageSrc={item.imageSrc}
                  isSelected={field.value === item.id}
                  onClick={() => field.onChange(item.id)}
                />
              ))}
            </div>
          )}
        />
        {errors.tipoPiso && (
          <span className="text-red-600 text-xs mt-3 block font-medium">{errors.tipoPiso.message}</span>
        )}
      </div>

    </form>
  );
}
