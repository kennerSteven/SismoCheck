import React from 'react';
import logoUrl from '../../assets/contro.ico';
import qatroLogoUrl from '../../assets/Qatro.png';
import nmLogoUrl from '../../assets/NM.png';

import useFormStore from '../../store/useFormStore';

export default function FormHeader() {
  const logout = useFormStore(state => state.logout);
  const fillTestData = useFormStore(state => state.fillTestData);
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).toUpperCase();

  return (
    <div className="w-full mb-8 font-sans">
      <div className="flex justify-center w-full mb-4">
        <img src="/morar.ok.png" alt="Morar OK" className="w-full max-w-[180px] sm:max-w-[220px] object-contain drop-shadow-sm" />
      </div>
      {/* 1. SECCIÓN DE LOGOS (TOP BAR) */}
      <div className="grid grid-cols-3 border-2 border-slate-900 bg-white divide-x divide-slate-300 rounded-lg overflow-hidden mb-5">
        
        {/* Columna 1: Controller */}
        <div className="flex flex-col items-center justify-center py-2 sm:py-4 px-1 sm:px-2">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
            <img src={logoUrl} alt="Controller" className="w-6 h-6 sm:w-10 sm:h-10 object-contain" />
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-800 text-[10px] sm:text-lg leading-none tracking-tight">Controller</span>
              <span className="font-bold text-slate-500 text-[7px] sm:text-[10px] tracking-widest uppercase">R.M.A SAS</span>
            </div>
          </div>
        </div>

        {/* Columna 2: QATRO */}
        <div className="flex flex-col items-center justify-center p-0 bg-slate-50/50 overflow-hidden">
          <img src={qatroLogoUrl} alt="Qatro" className="h-16 sm:h-32 w-full object-contain scale-110 sm:scale-125" />
        </div>

        {/* Columna 3: NM */}
        <div className="flex flex-col items-center justify-center p-0 bg-white overflow-hidden">
          <img src={nmLogoUrl} alt="NM" className="h-14 sm:h-24 w-full object-contain scale-110 sm:scale-110" />
        </div>
      </div>

      {/* 2. SECCIÓN DE TÍTULO Y FECHA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[#1F3B5F] mb-6 relative">
        <h3 className="text-xs sm:text-sm font-bold tracking-widest uppercase opacity-80">
          Evaluación Previa de Construcción
        </h3>
        
        <div className="relative flex items-center gap-2">
          <button 
            type="button" 
            onClick={fillTestData}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-md hover:bg-blue-200 transition-colors shadow-sm hidden md:block border border-blue-200"
            title="Llenar datos de prueba"
          >
            DATA TEST
          </button>
          <span className="font-mono text-sm sm:text-base font-medium px-4 py-1.5 bg-slate-100 rounded-md border border-slate-200">
            {currentDate}
          </span>
        </div>
      </div>

      {/* 3. SECCIÓN DE INTRODUCCIÓN */}
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3B5F] mb-3 leading-tight">
          Ficha de reconocimiento visual de la construcción
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-4xl">
          <strong className="text-slate-700">Diligencie esta ficha antes de la visita técnica.</strong> No necesita conocimientos de ingeniería: seleccione las opciones que más se parezcan a lo que observa en su vivienda o local. Esta información es un insumo preliminar y no reemplaza la evaluación de un profesional en el sitio.
        </p>
      </div>
      
      <hr className="mt-6 border-slate-200 border-t-2" />
    </div>
  );
}
