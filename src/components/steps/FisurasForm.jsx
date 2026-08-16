import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useFormStore from '../../store/useFormStore';
import { handleFormError } from '../../utils/alerts';
import { DangerConfirmModal, Toast } from '../../utils/alerts';
import { compressImage } from '../../utils/compressImage';

const imageModules = import.meta.glob('../../assets/fotos/**/*.{png,jpg,jpeg,svg}', { eager: true });
const allImages = Object.fromEntries(
  Object.entries(imageModules).map(([path, mod]) => [path, mod.default || mod])
);

// --- FUNCIONES DE GRUPO ---
const getSistemaGrupo = (tipoConstruccion) => {
  if (['construccion_tradicional', 'construccion_palafitica', 'madera_portante'].includes(tipoConstruccion)) return 'madera';
  if (['estructura_metalica'].includes(tipoConstruccion)) return 'metal';
  if (['construccion_prefabricada'].includes(tipoConstruccion)) return 'prefab';
  return 'concreto'; // muros_concreto, mamposteria_*, otro_mixto
};

// --- DICCIONARIOS DE DATOS ---
const ELEMENTO_OPTIONS_ALL = [
  { 
    id: 'Columna', 
    label: 'Columna',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="#1F3B5F">
        <path d="M7 4h10v3H7V4zm3 3h4v10h-4V7zm-3 10h10v3H7v-3z" />
      </svg>
    )
  },
  { 
    id: 'Viga', 
    label: 'Viga',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="#1F3B5F">
        <path d="M4 8h3v8H4V8zm3 3h10v2H7v-2zm10-3h3v8h-3V8z" />
      </svg>
    )
  },
  { 
    id: 'Muro', 
    label: 'Muro',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="#CF895C">
        <path d="M4 6h16v2H4V6zm0 3h7v2H4V9zm8 0h8v2h-8V9zm-8 3h16v2H4v-2zm0 3h7v2H4v-2zm8 0h8v2h-8v-2z" />
      </svg>
    )
  },
  { 
    id: 'Escaleras', 
    label: 'Escaleras',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="#1F3B5F">
        <path d="M6 18h12v-3h-3v-3h-3V9H9V6H6v12z" />
      </svg>
    )
  },
  { 
    id: 'Piso', 
    label: 'Piso',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="14" width="14" height="3" fill="#CBB696" stroke="#908068" strokeWidth="1" />
        <path d="M6 14l-2 -3M10 14l-2 -3M14 14l-2 -3M18 14l-2 -3" stroke="#908068" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  },
  { 
    id: 'Techo', 
    label: 'Techo',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="7" width="14" height="3" fill="#D3CEBB" stroke="#8E8B79" strokeWidth="1" />
        <path d="M6 10l-2 3M10 10l-2 3M14 10l-2 3M18 10l-2 3" stroke="#8E8B79" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  },
];

// Ya no es necesario ELEMENTO_MAPPING, usamos directamente elementoId

const TIPO_OPTIONS_CONCRETO = [
  { id: 'vertical', label: 'Vertical', match: 'vertical' },
  { id: 'horizontal', label: 'Horizontal', match: 'horizontal' },
  { id: 'diagonal', label: 'Diagonal', match: 'diagonal' },
  { id: 'escalonada', label: 'Escalonada', match: 'escalonada' },
  { id: 'cruzadas', label: 'Cruzadas (en X)', match: 'x_cruzada' },
  { id: 'telarana', label: 'Tipo telaraña', match: 'mapa' },
  { id: 'panete', label: 'Solo en el pañete/acabado', match: 'revoque' },
];

const TIPO_OPTIONS_MADERA = [
  { id: 'torcedura', label: 'Torcedura', match: 'torcedura_madera' },
  { id: 'rajadura', label: 'Rajadura', match: 'rajadura' },
  { id: 'hueco', label: 'Hueco', match: 'hueco' },
  { id: 'horizontal_cortante', label: 'Fisura horizontal (cortante)', match: 'fisura_horizontal_madera' },
  { id: 'diagonal_cortante', label: 'Fisura diagonal (cortante)', match: 'fisura_diagonal_madera' },
];

const TIPO_OPTIONS_METAL = [
  { id: 'torcedura', label: 'Torcedura', match: 'torcedura_metal' },
  { id: 'corrosion', label: 'Corrosión u óxido', match: 'corrosion_metal' },
  { id: 'abolladura', label: 'Abolladura', match: 'abolladura' },
  { id: 'desplome', label: 'Desplome', match: 'desplome' },
  { id: 'separacion', label: 'Separación piso-techo', match: 'separacion_piso_techo' },
  { id: 'falla_uniones', label: 'Falla en uniones o soldaduras', match: 'falla_uniones' },
];

const TIPO_OPTIONS_PREFAB = [
  ...TIPO_OPTIONS_CONCRETO,
  { id: 'separacion_paneles', label: 'Separación entre paneles', match: 'separacion_paneles' }
];

const getTipoList = (grupo, elementoId) => {
  if (grupo === 'madera') return TIPO_OPTIONS_MADERA;
  if (grupo === 'metal') {
    if (elementoId === 'Muro' || elementoId === 'Piso') return TIPO_OPTIONS_CONCRETO;
    return TIPO_OPTIONS_METAL;
  }
  if (grupo === 'prefab') return TIPO_OPTIONS_PREFAB;
  return TIPO_OPTIONS_CONCRETO;
};

const getFisuraImage = (grupo, elementoId, tipoMatch) => {
  let isPrefab = false;
  if (grupo === 'prefab') {
    isPrefab = true;
    grupo = 'concreto';
  }
  
  if (grupo === 'metal' && (elementoId === 'Muro' || elementoId === 'Piso')) {
    grupo = 'concreto';
  }
  
  let folderMatch = '05_Fisuras_concreto_por_elemento';
  if (grupo === 'madera') folderMatch = '06_Fisuras_madera_por_elemento';
  if (grupo === 'metal') folderMatch = '07_Fisuras_metal_por_elemento';

  let matchKey = Object.keys(allImages).find(key => 
    key.includes(folderMatch) && key.includes(`/${elementoId}/`) && key.includes(tipoMatch)
  );

  if (!matchKey) {
     let genericFolder = '08_Fisuras_concreto_generico';
     if (grupo === 'madera') genericFolder = '09_Fisuras_madera_generico';
     if (grupo === 'metal') genericFolder = '10_Fisuras_metal_generico';
     
     if (isPrefab && tipoMatch === 'separacion_paneles') genericFolder = '11_Fisuras_prefab';

     matchKey = Object.keys(allImages).find(key => 
       key.includes(genericFolder) && key.includes(tipoMatch)
     );
  }

  return matchKey ? allImages[matchKey] : null;
};

// NUEVOS DICCIONARIOS CON EMOJIS Y IDS PARA EL ENGINE
const TAMANO_OPTIONS = [
  { id: 'w1', emoji: '🧵', label: 'No entra nada', desc: 'rayón con la uña (menos de 1 mm)' },
  { id: 'w2', emoji: '💅', label: 'Borde de una uña', desc: 'o el filo de una hoja (1 a 2 mm)' },
  { id: 'w3', emoji: '✏️', label: 'Mina de un lápiz', desc: 'o el canto de una moneda (2 a 5 mm)' },
  { id: 'w4', emoji: '🤏', label: 'Dedo meñique completo', desc: 'de punta a punta (0,5 a 2 cm)' },
  { id: 'w5', emoji: '🖐️', label: 'Caben tres dedos juntos', desc: 'índice, medio y anular (más de 3 cm)' },
];

const EVOLUCION_OPTIONS = [
  { id: 'no_sabe', emoji: '❓', label: 'No sabe', desc: 'no ha hecho seguimiento' },
  { id: 'igual', emoji: '➖', label: 'Sigue igual', desc: 'se ve igual desde hace tiempo' },
  { id: 'lento', emoji: '↗️', label: 'Aumentó lento', desc: 'poco a poco' },
  { id: 'notorio', emoji: '⚠️', label: 'Aumentó notorio', desc: 'de forma notoria o reciente' },
];

const ACEROS_OPTIONS = [
  { id: 'Sí', emoji: '⚠️', label: 'Sí' },
  { id: 'No', emoji: '✅', label: 'No' },
  { id: 'No sabe', emoji: '❓', label: 'No sabe' },
];

const CORROSION_OPTIONS = [
  { id: 'Sí', emoji: '🟠', label: 'Sí' },
  { id: 'No', emoji: '✅', label: 'No' },
  { id: 'No sabe', emoji: '❓', label: 'No sabe' },
];

const fisurasSchema = z.object({
  fisurasList: z.array(z.any())
});

export default function FisurasForm({ onNext }) {
  const { formData, setFormData, setFooterHidden } = useFormStore();
  
  const [fisurasList, setFisurasList] = useState(
    Array.isArray(formData.step3?.fisurasList) ? formData.step3.fisurasList : []
  );
  
  const [isAdding, setIsAdding] = useState(false);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [tempFisura, setTempFisura] = useState({});

  const grupoEstructural = useMemo(() => {
    return getSistemaGrupo(formData.step2?.tipoConstruccion || '');
  }, [formData.step2?.tipoConstruccion]);

  const tipoPisoTierra = formData.step2?.tipoPiso === 'tierra';

  const elementoOptions = useMemo(() => {
    return tipoPisoTierra ? ELEMENTO_OPTIONS_ALL.filter(e => e.id !== 'Piso') : ELEMENTO_OPTIONS_ALL;
  }, [tipoPisoTierra]);

  const tipoOptions = useMemo(() => {
    return getTipoList(grupoEstructural, tempFisura.elemento);
  }, [grupoEstructural, tempFisura.elemento]);

  const { handleSubmit } = useForm({
    resolver: zodResolver(fisurasSchema),
    defaultValues: { fisurasList }
  });

  useEffect(() => {
    setFooterHidden(isAdding);
    return () => setFooterHidden(false);
  }, [isAdding, setFooterHidden]);

  const onSubmit = () => {
    setFormData('step3', { fisurasList });
    if (onNext) onNext();
  };

  const handleStartAdd = () => {
    setTempFisura({});
    setCurrentSubStep(1);
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setTempFisura({});
    setIsAdding(false);
  };

  const handleDelete = (indexToDelete) => {
    DangerConfirmModal.fire({
      title: '¿Eliminar daño?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setFisurasList(prev => prev.filter((_, idx) => idx !== indexToDelete));
      }
    });
  };

  const handleSaveFisura = () => {
    setFisurasList(prev => [...prev, tempFisura]);
    setIsAdding(false);
  };

  const selectOption = (key, value) => {
    setTempFisura(prev => ({ ...prev, [key]: value }));
    if (currentSubStep < 5) {
      setCurrentSubStep(prev => prev + 1);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Toast.fire({ icon: 'warning', title: 'La foto debe pesar menos de 10MB.' });
        return;
      }
      try {
        const base64Light = await compressImage(file, 600, 600, 0.6);
        setTempFisura(prev => ({ 
          ...prev, 
          foto: file, 
          fotoName: file.name,
          fotoUrl: base64Light
        }));
      } catch (err) {
        Toast.fire({ icon: 'error', title: 'Error procesando la foto.' });
      }
    }
  };

  const getLabel = (options, id) => options.find(o => o.id === id)?.label || id;

  if (isAdding) {
    return (
      <div className="w-full text-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-50 p-3 rounded-xl border border-slate-100">
          {[
            { step: 1, key: 'elemento', options: elementoOptions, name: 'Elemento' },
            { step: 2, key: 'tipo', options: tipoOptions, name: 'Tipo' },
            { step: 3, key: 'tamano', options: TAMANO_OPTIONS, name: 'Tamaño' },
            { step: 4, key: 'evolucion', options: EVOLUCION_OPTIONS, name: 'Evolución' },
            { step: 5, key: 'aceros', options: ACEROS_OPTIONS, name: 'Detalles' }
          ].map((b, i) => {
            const hasValue = !!tempFisura[b.key];
            const isActive = currentSubStep === b.step;
            
            return (
              <React.Fragment key={b.step}>
                {i > 0 && <span className="text-slate-300">/</span>}
                <div 
                  onClick={() => hasValue && setCurrentSubStep(b.step)}
                  className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md transition-colors ${
                    hasValue && !isActive ? 'cursor-pointer text-slate-600 hover:bg-slate-200' : ''
                  } ${
                    isActive 
                      ? 'bg-[#1F3B5F] text-white' 
                      : hasValue 
                        ? 'bg-slate-200 text-slate-700' 
                        : 'text-slate-400'
                  }`}
                >
                  {hasValue ? getLabel(b.options, tempFisura[b.key]) : `${b.step}. ${b.name}`}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="mb-10 min-h-[300px]">
          {/* PASO 1: ELEMENTO */}
          {currentSubStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">1. ¿En qué elemento está el daño?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {elementoOptions.map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => selectOption('elemento', opt.id)}
                    className={`border-2 rounded-xl p-5 py-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                      tempFisura.elemento === opt.id
                        ? 'border-[#1F3B5F] bg-blue-50/50'
                        : 'border-slate-200 hover:border-[#1F3B5F] hover:bg-slate-50'
                    }`}
                  >
                    {opt.icon && <div className="mb-4">{opt.icon}</div>}
                    <span className="font-extrabold text-sm text-slate-800">{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2: TIPO DE DAÑO */}
          {currentSubStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">2. Tipo de daño</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tipoOptions.map(opt => {
                  const imgSrc = tempFisura.elemento ? getFisuraImage(grupoEstructural, tempFisura.elemento, opt.match) : null;
                  return (
                    <div 
                      key={opt.id}
                      onClick={() => selectOption('tipo', opt.id)}
                      className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                        tempFisura.tipo === opt.id
                          ? 'border-[#1F3B5F] bg-blue-50'
                          : 'border-slate-100 hover:border-[#1F3B5F] hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-full h-36 sm:h-56 bg-white p-4 pt-6 rounded-lg mb-3 flex items-center justify-center text-slate-400 font-medium text-xs overflow-hidden">
                        {imgSrc ? (
                          <img src={imgSrc} alt={opt.label} className="w-full h-full object-contain" />
                        ) : (
                          <span>[Genérico]</span>
                        )}
                      </div>
                      <span className="font-bold text-sm text-slate-700 leading-tight">{opt.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 3: TAMAÑO (TARJETAS CON EMOJIS) */}
          {currentSubStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">3. ¿Qué tan ancho es el daño?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TAMANO_OPTIONS.map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => selectOption('tamano', opt.id)}
                    className={`border-2 rounded-xl p-5 flex flex-col justify-center text-left cursor-pointer transition-colors ${
                      tempFisura.tamano === opt.id
                        ? 'border-[#1F3B5F] bg-blue-50'
                        : 'border-slate-100 hover:border-[#1F3B5F] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="font-extrabold text-[15px] text-slate-800 leading-tight">{opt.label}</span>
                    </div>
                    {opt.desc && <span className="text-xs text-slate-500 font-medium ml-9">{opt.desc}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 4: EVOLUCIÓN (TARJETAS CON EMOJIS) */}
          {currentSubStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">4. Evolución del daño</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {EVOLUCION_OPTIONS.map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => selectOption('evolucion', opt.id)}
                    className={`border-2 rounded-xl p-5 flex flex-col justify-center text-left cursor-pointer transition-colors ${
                      tempFisura.evolucion === opt.id
                        ? 'border-[#1F3B5F] bg-blue-50'
                        : 'border-slate-100 hover:border-[#1F3B5F] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="font-extrabold text-[15px] text-slate-800 leading-tight">{opt.label}</span>
                    </div>
                    {opt.desc && <span className="text-xs text-slate-500 font-medium ml-9">{opt.desc}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 5: DETALLES, FOTO Y CORROSIÓN */}
          {currentSubStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">5. Detalles adicionales</h3>
              
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">FOTO DEL DAÑO (OPCIONAL)</label>
                <label htmlFor="fotoFisura" className={`border-2 border-dashed border-slate-300 rounded-xl overflow-hidden text-center hover:border-[#1F3B5F] transition-colors cursor-pointer block ${tempFisura.fotoUrl ? 'bg-slate-100 p-0' : 'bg-slate-50 p-6 hover:bg-blue-50/30'}`}>
                   {tempFisura.fotoUrl ? (
                     <div className="relative group w-full h-48 flex items-center justify-center">
                       <img src={tempFisura.fotoUrl} alt="Vista previa" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-white font-bold text-sm bg-[#1F3B5F] px-4 py-2 rounded-full shadow-lg">Cambiar foto</span>
                       </div>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                         <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                       </svg>
                       <span className="text-slate-600 font-medium text-sm">Toque aquí para tomar una foto</span>
                     </div>
                   )}
                   <input type="file" id="fotoFisura" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase tracking-widest mb-3">
                  {grupoEstructural === 'madera' 
                    ? '¿SE ESCUCHAN CHASQUIDOS, CHIRRIDOS O CRUJIDOS EN ESTA PIEZA DE MADERA?'
                    : '¿SE VEN ACEROS (VARILLAS / PERFILES) EXPUESTOS CERCA DEL DAÑO?'}
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {ACEROS_OPTIONS.map(opt => (
                    <div 
                      key={opt.id}
                      onClick={() => {
                        setTempFisura(prev => {
                          const newFisura = { ...prev, aceros: opt.id };
                          if (opt.id !== 'Sí') {
                            newFisura.corrosion = null;
                          }
                          return newFisura;
                        });
                      }}
                      className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                        tempFisura.aceros === opt.id 
                          ? 'border-[#1F3B5F] bg-blue-50' 
                          : 'border-slate-100 hover:border-[#1F3B5F] hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl mb-1">{opt.emoji}</span>
                      <span className="font-bold text-sm text-slate-700">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {tempFisura.aceros === 'Sí' && ['estructura_metalica', 'otro_mixto'].includes(formData.step2?.tipoConstruccion) && (
                <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-3">¿ESOS ACEROS TIENEN CORROSIÓN (ÓXIDO)?</label>
                  <div className="grid grid-cols-3 gap-4">
                    {CORROSION_OPTIONS.map(opt => (
                      <div 
                        key={opt.id}
                        onClick={() => setTempFisura(prev => ({ ...prev, corrosion: opt.id }))}
                        className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                          tempFisura.corrosion === opt.id 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-slate-100 hover:border-orange-400 hover:bg-orange-50/50'
                        }`}
                      >
                        <span className="text-2xl mb-1">{opt.emoji}</span>
                        <span className="font-bold text-sm text-slate-700">{opt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                  )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-4">
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => currentSubStep > 1 ? setCurrentSubStep(prev => prev - 1) : handleCancelAdd()}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              &lt;- Atrás
            </button>
            <button 
              type="button" 
              onClick={handleCancelAdd}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors hidden sm:block"
            >
              Cancelar
            </button>
          </div>
          
          {currentSubStep === 5 && (tempFisura.aceros && (tempFisura.aceros !== 'Sí' || !['estructura_metalica', 'otro_mixto'].includes(formData.step2?.tipoConstruccion) || tempFisura.corrosion)) && (
            <button 
              type="button" 
              onClick={handleSaveFisura}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#1F3B5F] hover:bg-[#152a45] shadow-lg shadow-[#1F3B5F]/30 transition-all"
            >
              GUARDAR DAÑO
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- VISTA 1: PRINCIPAL ---
  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit, handleFormError)} className="w-full text-slate-700 animate-in fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Fisuras, grietas, fallas</h2>
        <p className="text-slate-500 mt-2 text-base md:text-lg">
          Registre cada daño que encuentre, uno por uno (hasta 12). Presione "Agregar daño" y vaya completando los datos. Las opciones variarán según el material de su estructura.
        </p>
      </div>

      <div className="mb-8">
        {fisurasList.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-700 text-lg mb-1">Sin daños registrados</h3>
            <p className="text-slate-500 text-sm max-w-sm">Si su edificación no presenta fisuras o daños graves, puede continuar. De lo contrario, agregue cada daño encontrado.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {fisurasList.map((f, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 items-start shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-sm sm:text-base border border-blue-100">
                  {index + 1}
                </div>
                <div className="flex-1 pt-0.5">
                  <h4 className="font-extrabold text-slate-800 text-sm sm:text-base mb-2">
                    {elementoOptions.find(o => o.id === f.elemento)?.label || f.elemento}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold rounded-md">
                      {getLabel(tipoOptions, f.tipo)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold rounded-md">
                      {getLabel(TAMANO_OPTIONS, f.tamano)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold rounded-md">
                      {getLabel(EVOLUCION_OPTIONS, f.evolucion)}
                    </span>
                  </div>
                </div>
                
                {f.fotoUrl && (
                  <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm ml-2">
                    <img src={f.fotoUrl} alt={`Foto de daño ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                )}

                <button 
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 p-2 rounded-full transition-colors shrink-0 ml-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {fisurasList.length < 12 && (
        <div className="flex justify-center mb-10">
          <button
            type="button"
            onClick={handleStartAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            AGREGAR DAÑO
          </button>
        </div>
      )}

      {/* Nota Inferior */}
      <div className="bg-red-50/50 border-l-4 border-red-500 p-4 rounded-r-lg mt-8 text-xs text-red-900 shadow-sm">
        <p><span className="font-extrabold uppercase tracking-wide">Nota:</span> este registro es orientativo para recolectar información en campo. Únicamente un profesional en ingeniería o arquitectura, mediante inspección directa, puede determinar la causa real, la severidad y si existe compromiso de la capacidad estructural.</p>
      </div>

    </form>
  );
}
