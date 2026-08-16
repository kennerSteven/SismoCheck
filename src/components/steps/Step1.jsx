import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useFormStore from '../../store/useFormStore';
import { handleFormError } from '../../utils/alerts';
import { Toast } from '../../utils/alerts';
import { compressImage } from '../../utils/compressImage';

const zNum = (msg, minVal, minMsg) => 
  z.any()
   .refine((val) => val !== '' && val !== undefined && val !== null && !Number.isNaN(val), { message: msg })
   .transform((val) => Number(val))
   .refine((val) => minVal === undefined || val >= minVal, { message: minMsg || msg });

const step1Schema = z.object({
  nombreDiligenciador: z.string().min(1, 'El nombre completo es obligatorio'),
  cedulaDiligenciador: z.string().min(1, 'La cédula es obligatoria'),
  telefonoDiligenciador: z.string().min(1, 'El teléfono de contacto es obligatorio'),
  correoDiligenciador: z.string().email('Correo inválido').optional().or(z.literal('')),
  direccion: z.string().optional().or(z.literal('')),
  barrio: z.string().min(1, 'El barrio es obligatorio'),
  vereda: z.string().optional(),
  municipio: z.string().min(1, 'El municipio es obligatorio'),
  numeroPisos: zNum('Debe ingresar un número', 1, 'Debe ser mínimo 1 piso'),
  numeroSotanos: zNum('Debe ingresar un número', 0, 'No puede ser negativo'),
  ancho: zNum('Debe ingresar el ancho', 0.1, 'Debe ser mayor a 0'),
  largo: zNum('Debe ingresar el largo', 0.1, 'Debe ser mayor a 0'),
  anoConstruccion: zNum('Debe ingresar un año', 1800, 'Ingrese un año válido'),
  usoActual: z.string({ required_error: 'Seleccione un uso de la lista', invalid_type_error: 'Seleccione un uso de la lista' }).min(1, 'Seleccione un uso de la lista'),
  latitud: zNum('Haga clic en el botón de ubicación'),
  longitud: zNum('Haga clic en el botón de ubicación'),
  fotoFachada: z.any()
    .refine((files) => !files || files.length === 0 || files.length === 1, 'Máximo 1 foto permitida')
    .optional(),
});

const usoOpciones = [
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'comercio', label: 'Comercio' },
  { value: 'educacion', label: 'Educación' },
  { value: 'salud', label: 'Salud' },
  { value: 'industria', label: 'Industria' },
  { value: 'oficinas', label: 'Oficinas' },
  { value: 'otro', label: 'Otro' }
];

const InputField = React.forwardRef(({ error, className = '', ...props }, ref) => (
  <div className="w-full">
    <input
      ref={ref}
      className={`w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-slate-800 text-sm md:text-base focus:outline-none transition-all duration-200 ${
        error 
          ? 'border-red-500 focus:border-red-600 bg-red-50' 
          : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white'
      } ${className}`}
      {...props}
    />
    {error && (
      <div className="flex items-center gap-1.5 mt-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg w-fit animate-in slide-in-from-top-1 fade-in duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
        <span className="text-sm font-bold tracking-tight">{error.message}</span>
      </div>
    )}
  </div>
));
InputField.displayName = 'InputField';

const SelectField = React.forwardRef(({ options, error, className = '', ...props }, ref) => (
  <div className="w-full">
    <select
      ref={ref}
      className={`w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-slate-800 text-sm md:text-base focus:outline-none transition-all duration-200 appearance-none ${
        error 
          ? 'border-red-500 focus:border-red-600 bg-red-50' 
          : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white'
      } ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 1rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        paddingRight: '2.5rem'
      }}
      {...props}
    >
      <option value="">Seleccione...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && (
      <div className="flex items-center gap-1.5 mt-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg w-fit animate-in slide-in-from-top-1 fade-in duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
        <span className="text-sm font-bold tracking-tight">{error.message}</span>
      </div>
    )}
  </div>
));
SelectField.displayName = 'SelectField';

export default function Step1({ onNext }) {
  const [isLocating, setIsLocating] = useState(false);
  const [previews, setPreviews] = useState([]);
  const { formData, setFormData } = useFormStore();
  
  const defaultValues = {
    nombreDiligenciador: formData.step1?.nombreDiligenciador || '',
    cedulaDiligenciador: formData.step1?.cedulaDiligenciador || '',
    telefonoDiligenciador: formData.step1?.telefonoDiligenciador || '',
    correoDiligenciador: formData.step1?.correoDiligenciador || '',
    usoActual: formData.step1?.usoActual || '',
    ...formData.step1
  };

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues
  });

  /* eslint-disable react-hooks/incompatible-library */
  const fotoFachadaFiles = watch('fotoFachada');
  const anchoVal = watch('ancho');
  const largoVal = watch('largo');
  /* eslint-enable react-hooks/incompatible-library */

  React.useEffect(() => {
    if (fotoFachadaFiles && fotoFachadaFiles.length > 0) {
      const newPreviews = Array.from(fotoFachadaFiles).map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    } else {
      setPreviews([]);
    }
  }, [fotoFachadaFiles]);

  const onSubmit = async (data) => {
    let fotoBase64 = null;
    if (fotoFachadaFiles && fotoFachadaFiles.length > 0) {
      try {
        fotoBase64 = await compressImage(fotoFachadaFiles[0], 600, 600, 0.6);
      } catch (e) {
        console.error("Error compressing facade image:", e);
      }
    }
    
    setFormData('step1', {
      ...data,
      fotoFachadaUrl: fotoBase64 || formData.step1?.fotoFachadaUrl
    });
    onNext();
  };

  const handleGetLocation = async (e) => {
    if (e) e.preventDefault();
    if (isLocating) return;
    setIsLocating(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulación fluida
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitud', position.coords.latitude, { shouldValidate: true });
          setValue('longitud', position.coords.longitude, { shouldValidate: true });
          setIsLocating(false);
        },
        (error) => {
          setIsLocating(false);
          Toast.fire({ icon: 'error', title: 'Error obteniendo ubicación: ' + error.message });
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      Toast.fire({ icon: 'error', title: 'Geolocalización no soportada' });
    }
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit, handleFormError)} className="w-full text-slate-700">
      
      {/* SECCIÓN: Datos de quien diligencia */}
      <div className="mb-10 md:mb-12">
        <div className="mb-6 px-2 md:px-0">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Datos de quien diligencia la ficha</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">NOMBRE COMPLETO</label>
            <InputField 
              placeholder="Nombres y apellidos"
              {...register('nombreDiligenciador')} 
              error={errors.nombreDiligenciador} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">CÉDULA</label>
            <InputField 
              placeholder="Número de cédula"
              {...register('cedulaDiligenciador')} 
              error={errors.cedulaDiligenciador} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">TELÉFONO</label>
            <InputField 
              type="tel"
              placeholder="Número de contacto"
              {...register('telefonoDiligenciador')} 
              error={errors.telefonoDiligenciador} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">CORREO ELECTRÓNICO (opcional)</label>
            <InputField 
              type="email"
              placeholder="correo@ejemplo.com"
              {...register('correoDiligenciador')} 
              error={errors.correoDiligenciador} 
            />
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-slate-200 mb-8 md:mb-10"></div>

      {/* SECCIÓN: Información básica */}
      <div className="mb-8 md:mb-10 px-2 md:px-0">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Datos de la construcción</h2>
        <p className="text-slate-500 mt-2 text-base md:text-lg">
          Datos generales de ubicación y dimensiones aproximadas. Si no conoce una medida exacta, escriba su mejor estimación.
        </p>
      </div>

      {/* Dirección */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-600 uppercase mb-0.5">DIRECCIÓN COMPLETA</label>
        <span className="block text-[11px] text-slate-500 mb-1">Opcional. Si no conoce la dirección exacta, puede dejarlo en blanco o escribir "No sé".</span>
        <InputField 
          placeholder="Calle / Carrera / Nomenclatura"
          {...register('direccion')} 
          error={errors.direccion} 
        />
      </div>

      {/* Barrio / Vereda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">BARRIO</label>
          <InputField 
            placeholder="Nombre del barrio (zona urbana)"
            {...register('barrio')} 
            error={errors.barrio} 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">VEREDA</label>
          <InputField 
            placeholder="Nombre de la vereda (zona rural)"
            {...register('vereda')} 
            error={errors.vereda} 
          />
        </div>
      </div>

      {/* Municipio / Pisos / Sótanos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">MUNICIPIO</label>
          <div className="text-[11px] text-transparent mb-1 hidden md:block">_</div>
          <InputField 
            placeholder="Ej. Chía, Cundinamarca"
            {...register('municipio')} 
            error={errors.municipio} 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-0.5">N.º DE PISOS</label>
          <span className="block text-[11px] text-slate-500 mb-1">incluyendo primer nivel</span>
          <InputField 
            type="number" 
            placeholder="Ej. 2"
            min="1"
            {...register('numeroPisos', { valueAsNumber: true })} 
            error={errors.numeroPisos} 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-0.5">N.º DE SÓTANOS</label>
          <span className="block text-[11px] text-slate-500 mb-1">0 si no tiene</span>
          <InputField 
            type="number" 
            placeholder="Ej. 0"
            min="0"
            {...register('numeroSotanos', { valueAsNumber: true })} 
            error={errors.numeroSotanos} 
          />
        </div>
      </div>

      {/* Dimensiones */}
      <div className="mb-5">
        <label className="block text-[11px] font-mono text-slate-600 uppercase tracking-widest mb-2">DIMENSIONES DE LA CONSTRUCCIÓN, EN PASOS</label>
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 flex flex-col">
            <InputField 
              type="number" step="1" min="0"
              placeholder="Pasos de frente"
              {...register('ancho', { valueAsNumber: true })} 
              error={errors.ancho} 
            />
            {!Number.isNaN(anchoVal) && anchoVal > 0 && (
              <span className="block text-[11px] text-[#1F3B5F] mt-1 font-medium ml-1">
                ≈ {(anchoVal * 0.75).toFixed(1)} m
              </span>
            )}
          </div>
          <span className="text-slate-400 font-mono text-lg font-bold self-start mt-3">×</span>
          <div className="flex-1 flex flex-col">
            <InputField 
              type="number" step="1" min="0"
              placeholder="Pasos de fondo"
              {...register('largo', { valueAsNumber: true })} 
              error={errors.largo} 
            />
            {!Number.isNaN(largoVal) && largoVal > 0 && (
              <span className="block text-[11px] text-[#1F3B5F] mt-1 font-medium ml-1">
                ≈ {(largoVal * 0.75).toFixed(1)} m
              </span>
            )}
          </div>
        </div>
        <span className="block text-[11px] text-slate-500 mt-2">
          Camine de borde a borde contando los pasos para cada lado de la construcción.
        </span>
      </div>

      {/* Año / Uso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">AÑO APROXIMADO DE CONSTRUCCIÓN</label>
          <InputField 
            type="number"
            min="1800"
            placeholder="Ej. 1998"
            {...register('anoConstruccion', { valueAsNumber: true })} 
            error={errors.anoConstruccion} 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">USO ACTUAL</label>
          <SelectField 
            options={usoOpciones} 
            {...register('usoActual')} 
            error={errors.usoActual} 
          />
        </div>
      </div>

      {/* Ubicación */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">UBICACIÓN (GEORREFERENCIACIÓN)</label>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LATITUD</label>
              <InputField 
                type="number" step="any"
                placeholder="Ej. 4.6097"
                {...register('latitud', { valueAsNumber: true })} 
                error={errors.latitud} 
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LONGITUD</label>
              <InputField 
                type="number" step="any"
                placeholder="Ej. -74.0817"
                {...register('longitud', { valueAsNumber: true })} 
                error={errors.longitud} 
              />
            </div>
          </div>

          {typeof watch('latitud') === 'number' && typeof watch('longitud') === 'number' && watch('latitud') >= -90 && watch('latitud') <= 90 && (
            <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner relative group">
              <div className="absolute inset-0 z-10 bg-transparent"></div>
              <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${watch('longitud')-0.005},${watch('latitud')-0.005},${watch('longitud')+0.005},${watch('latitud')+0.005}&layer=mapnik&marker=${watch('latitud')},${watch('longitud')}`}
                allowFullScreen
              ></iframe>
            </div>
          )}
          <button 
            type="button" 
            onClick={handleGetLocation}
            className={`w-full relative overflow-hidden group border-2 rounded-xl font-bold py-3.5 px-4 transition-all duration-200 flex items-center justify-center gap-2 ${
              isLocating 
                ? 'bg-blue-50 text-blue-700/70 border-blue-100 cursor-not-allowed' 
                : 'bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-200 hover:bg-blue-100'
            }`}
          >
            {isLocating ? (
              <span className="flex items-center gap-2 animate-pulse text-sm">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                UBICANDO...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                USAR MI UBICACIÓN ACTUAL
              </span>
            )}
          </button>
        </div>
        <span className="block text-[11px] text-slate-500 mt-1.5">
          Presione el botón estando en el sitio para completar la latitud y longitud automáticamente con el GPS del celular. También puede escribirlas a mano si ya las tiene.
        </span>
      </div>

      {/* Foto */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-600 uppercase mb-0.5">FOTO DE LA EDIFICACIÓN</label>
        <span className="block text-[11px] text-slate-500 mb-1.5">fachada principal, opcional</span>
        <div className="relative flex flex-col items-center justify-center w-full min-h-[140px] px-4 py-6 transition bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50/50">
          
          <input 
            type="file" 
            accept="image/*"
            capture="environment"
            className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${previews.length > 0 ? 'z-0 pointer-events-none' : 'z-10'}`}
            {...register('fotoFachada')}
          />

          {previews.length === 0 ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer group pointer-events-none">
              <div className="flex flex-col items-center text-center">
                <svg className="w-10 h-10 text-slate-400 group-hover:text-blue-500 mb-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span className="text-base font-bold text-slate-600 group-hover:text-blue-700 transition-colors">Toca para tomar foto</span>
                <span className="text-xs font-semibold text-slate-400 mt-1">1 imagen (PNG, JPG)</span>
              </div>
            </div>
          ) : (
            <div className="w-full relative z-0 flex justify-center">
              <div className="relative aspect-square w-full max-w-[200px] rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white">
                <img src={previews[0]} alt="Vista previa de fachada" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setValue('fotoFachada', undefined, { shouldValidate: true });
                  }}
                  className="absolute top-2 right-2 bg-white/90 text-slate-700 hover:text-red-600 hover:bg-white p-1.5 rounded-full shadow-md transition-all duration-200 z-20"
                  title="Eliminar foto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        {errors.fotoFachada && (
          <div className="flex items-center gap-1.5 mt-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg w-fit animate-in slide-in-from-top-1 fade-in duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            <span className="text-sm font-bold tracking-tight">{errors.fotoFachada.message}</span>
          </div>
        )}
      </div>

    </form>
  );
}
