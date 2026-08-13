import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useFormStore from '../../store/useFormStore';
import CustomButton from '../ui/CustomButton';

// --- DICCIONARIOS DE DATOS ---
const ELEMENTO_OPTIONS = [
  { id: 'columna', label: 'Columna' },
  { id: 'viga', label: 'Viga' },
  { id: 'muro', label: 'Muro' },
  { id: 'escaleras', label: 'Escaleras' },
  { id: 'piso', label: 'Piso' },
  { id: 'techo', label: 'Techo' },
];

const TIPO_OPTIONS = [
  { id: 'vertical', label: 'Vertical' },
  { id: 'horizontal', label: 'Horizontal' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'escalonada', label: 'Escalonada' },
  { id: 'cruzadas', label: 'Cruzadas (en X)' },
  { id: 'telarana', label: 'Tipo telaraña' },
  { id: 'panete', label: 'Solo en el pañete/acabado' },
];

const TAMANO_OPTIONS = [
  { id: 'menos1mm', label: 'No entra nada (< 1mm)' },
  { id: '1a2mm', label: 'Borde de una uña (1 a 2mm)' },
  { id: '2a5mm', label: 'Mina de un lápiz (2 a 5mm)' },
  { id: '5a20mm', label: 'Dedo meñique (0.5 a 2cm)' },
  { id: 'mas30mm', label: 'Tres dedos juntos (> 3cm)' },
];

const EVOLUCION_OPTIONS = [
  { id: 'crecido', label: 'Ha crecido recientemente' },
  { id: 'igual', label: 'Sigue igual' },
  { id: 'nosabe', label: 'No sabe' },
];

const ACEROS_OPTIONS = [
  { id: 'si', label: 'Sí' },
  { id: 'no', label: 'No' },
  { id: 'nosabe', label: 'No sabe' },
];

const fisurasSchema = z.object({
  fisurasList: z.array(z.any())
});

export default function FisurasForm({ onNext }) {
  const { formData, setFormData, setFooterHidden } = useFormStore();
  
  // Estados Locales
  const [fisurasList, setFisurasList] = useState(
    Array.isArray(formData.step3?.fisurasList) ? formData.step3.fisurasList : []
  );
  
  const [isAdding, setIsAdding] = useState(false);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [tempFisura, setTempFisura] = useState({});

  // Form para el paso principal (solo para enviar al final)
  const { handleSubmit } = useForm({
    resolver: zodResolver(fisurasSchema),
    defaultValues: { fisurasList }
  });

  // Ocultar footer global cuando estamos en el subflujo
  useEffect(() => {
    setFooterHidden(isAdding);
    return () => setFooterHidden(false);
  }, [isAdding, setFooterHidden]);

  // Sincronizar estado local con Zod si quisiéramos, pero Submit directo usa la lista.
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
    if (window.confirm("¿Seguro que deseas eliminar esta fisura?")) {
      setFisurasList(prev => prev.filter((_, idx) => idx !== indexToDelete));
    }
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

  const getLabel = (options, id) => options.find(o => o.id === id)?.label || id;

  // --- VISTA 2: SUB-FLUJO ---
  if (isAdding) {
    return (
      <div className="w-full text-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
        
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-50 p-3 rounded-xl border border-slate-100">
          {[
            { step: 1, key: 'elemento', options: ELEMENTO_OPTIONS, name: 'Elemento' },
            { step: 2, key: 'tipo', options: TIPO_OPTIONS, name: 'Tipo' },
            { step: 3, key: 'tamano', options: TAMANO_OPTIONS, name: 'Tamaño' },
            { step: 4, key: 'evolucion', options: EVOLUCION_OPTIONS, name: 'Evolución' },
            { step: 5, key: 'acerosExpuestos', options: ACEROS_OPTIONS, name: 'Detalles' }
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

        {/* CONTENIDO DEL SUB-PASO */}
        <div className="mb-10 min-h-[300px]">
          {currentSubStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">1. ¿En qué elemento está la fisura?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ELEMENTO_OPTIONS.map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => selectOption('elemento', opt.id)}
                    className="border-2 border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1F3B5F] hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-slate-200 rounded-lg mb-3 flex items-center justify-center text-slate-400 font-medium text-xs">
                      [Imagen]
                    </div>
                    <span className="font-bold text-sm text-slate-700">{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSubStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">2. Tipo de fisura</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TIPO_OPTIONS.map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => selectOption('tipo', opt.id)}
                    className="border-2 border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1F3B5F] hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-slate-200 rounded-lg mb-3 flex items-center justify-center text-slate-400 font-medium text-xs">
                      [Imagen]
                    </div>
                    <span className="font-bold text-sm text-slate-700">{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSubStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">3. Tamaño aproximado</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TAMANO_OPTIONS.map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => selectOption('tamano', opt.id)}
                    className="border-2 border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1F3B5F] hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-slate-200 rounded-lg mb-3 flex items-center justify-center text-slate-400 font-medium text-xs">
                      [Imagen]
                    </div>
                    <span className="font-bold text-sm text-slate-700">{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSubStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">4. Evolución de la fisura</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {EVOLUCION_OPTIONS.map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => selectOption('evolucion', opt.id)}
                    className="border-2 border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1F3B5F] hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-slate-200 rounded-lg mb-3 flex items-center justify-center text-slate-400 font-medium text-xs">
                      [Imagen]
                    </div>
                    <span className="font-bold text-sm text-slate-700">{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSubStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">5. Detalles adicionales</h3>
              
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">FOTO DE LA FISURA (OPCIONAL)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#1F3B5F] hover:bg-blue-50/30 transition-colors cursor-pointer">
                   <span className="text-slate-500 font-medium text-sm">Toque aquí para adjuntar una foto</span>
                   <input type="file" accept="image/*" className="hidden" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-3">¿SE VEN ACEROS (VARILLAS) EXPUESTOS CERCA DE LA FISURA?</label>
                <div className="grid grid-cols-3 gap-4">
                  {ACEROS_OPTIONS.map(opt => (
                    <div 
                      key={opt.id}
                      onClick={() => setTempFisura(prev => ({ ...prev, acerosExpuestos: opt.id }))}
                      className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                        tempFisura.acerosExpuestos === opt.id 
                          ? 'border-[#1F3B5F] bg-blue-50' 
                          : 'border-slate-100 hover:border-[#1F3B5F] hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-16 h-16 bg-slate-200 rounded-lg mb-3 flex items-center justify-center text-slate-400 font-medium text-xs">
                        [Imagen]
                      </div>
                      <span className="font-bold text-sm text-slate-700">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer del Sub-flujo */}
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
          
          {currentSubStep === 5 && tempFisura.acerosExpuestos && (
            <button 
              type="button" 
              onClick={handleSaveFisura}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#1F3B5F] hover:bg-[#152a45] shadow-lg shadow-[#1F3B5F]/30 transition-all"
            >
              GUARDAR FISURA
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- VISTA 1: PRINCIPAL ---
  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="w-full text-slate-700 animate-in fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Fisuras, grietas, fallas</h2>
        <p className="text-slate-500 mt-2 text-base md:text-lg">
          Registre cada fisura, grieta o falla que encuentre, una por una (hasta 12). Presione "Agregar fisura" y vaya completando los datos paso a paso.
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
            <h3 className="font-bold text-slate-700 text-lg mb-1">Sin fisuras registradas</h3>
            <p className="text-slate-500 text-sm max-w-sm">Si su edificación no presenta fisuras, puede continuar. De lo contrario, agregue cada fisura encontrada.</p>
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
                    {ELEMENTO_OPTIONS.find(o => o.id === f.elemento)?.label}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold rounded-md">
                      {TIPO_OPTIONS.find(o => o.id === f.tipo)?.label}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold rounded-md">
                      {TAMANO_OPTIONS.find(o => o.id === f.tamano)?.label}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold rounded-md">
                      {EVOLUCION_OPTIONS.find(o => o.id === f.evolucion)?.label}
                    </span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 p-2 rounded-full transition-colors shrink-0"
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
            AGREGAR FISURA
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
