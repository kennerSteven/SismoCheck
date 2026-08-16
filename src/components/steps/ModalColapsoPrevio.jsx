import React, { useState } from 'react';
import { AlertTriangle, User, Phone, Ban, ArrowRight } from 'lucide-react';
import imgEjemplo1 from '../../assets/fotos/13_Alerta_colapso/ejemplo_1.jpg';
import imgEjemplo2 from '../../assets/fotos/13_Alerta_colapso/ejemplo_2.jpg';
import imgEjemplo3 from '../../assets/fotos/13_Alerta_colapso/ejemplo_3.jpg';
import imgEjemplo4 from '../../assets/fotos/13_Alerta_colapso/ejemplo_4.jpg';

export default function ModalColapsoPrevio() {
  const [estado, setEstado] = useState('preguntando'); // 'preguntando' | 'inhabitable' | 'cerrado'

  if (estado === 'cerrado') return null;

  if (estado === 'inhabitable') {
    return (
      <div className="bg-[#B93826] fixed inset-0 z-[60] flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-300">
        <AlertTriangle className="w-24 h-24 mb-2 text-white opacity-90" />
        <span className="text-sm tracking-widest mt-4 uppercase font-bold opacity-90">Nivel Rojo</span>
        <h1 className="text-4xl md:text-6xl font-black mt-2 tracking-tight">INHABITABLE</h1>
        
        <p className="text-lg font-medium mt-6 max-w-2xl text-red-50">
          La construcción presenta colapso total o parcial. No debe ingresar ni permanecer dentro de la vivienda.
        </p>
        
        <ul className="text-left mt-6 space-y-4 max-w-xl text-base md:text-lg font-medium bg-black/10 p-6 rounded-2xl border border-white/20">
          <li className="flex items-start gap-3">
            <User className="w-6 h-6 shrink-0 mt-0.5" />
            Evacúe y manténgase alejado de la estructura.
          </li>
          <li className="flex items-start gap-3">
            <Phone className="w-6 h-6 shrink-0 mt-0.5" />
            Reporte esta condición a emergencias.
          </li>
          <li className="flex items-start gap-3">
            <Ban className="w-6 h-6 shrink-0 mt-0.5" />
            No es necesario continuar con esta ficha: la vivienda ya se clasifica como inhabitable.
          </li>
        </ul>

        <p className="text-sm mt-12 opacity-80 font-medium">
          Para iniciar una nueva evaluación, recargue esta página.
        </p>
      </div>
    );
  }

  // ESTADO: 'preguntando'
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        
        <div className="p-6 md:p-8 flex-1 overflow-y-auto text-center">
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase block mb-3">ANTES DE COMENZAR</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#1F3B5F] leading-tight">
            ¿La vivienda se ve así de dañada?
          </h2>
          <p className="text-gray-600 mt-4 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Mire estas imágenes de referencia. Si la construcción tiene un colapso total o parcial como estos ejemplos —techo caído, muros derrumbados, o la estructura recostada, hundida o a punto de caer— seleccione "Sí".
          </p>

          <div className="mt-6 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 p-2 shadow-inner">
            <div className="grid grid-cols-2 gap-2">
              <img src={imgEjemplo1} alt="Ejemplo 1" className="w-full h-auto object-cover rounded-lg" />
              <img src={imgEjemplo2} alt="Ejemplo 2" className="w-full h-auto object-cover rounded-lg" />
              <img src={imgEjemplo3} alt="Ejemplo 3" className="w-full h-auto object-cover rounded-lg" />
              <img src={imgEjemplo4} alt="Ejemplo 4" className="w-full h-auto object-cover rounded-lg" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-gray-200">
          <button 
            onClick={() => setEstado('inhabitable')}
            className="bg-[#BC4736] hover:bg-[#a33827] text-white font-black py-5 md:py-6 text-lg transition-colors focus:outline-none focus:ring-4 focus:ring-red-500/30 flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-6 h-6" /> Sí, se ve así
          </button>
          
          <button 
            onClick={() => setEstado('cerrado')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-5 md:py-6 text-lg transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200 sm:border-l border-gray-200 flex items-center justify-center gap-2"
          >
            No, no está así <ArrowRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
}
