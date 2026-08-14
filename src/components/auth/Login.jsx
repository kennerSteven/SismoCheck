import React, { useState } from 'react';
import useFormStore from '../../store/useFormStore';
import CustomButton from '../ui/CustomButton';
import logoUrl from '../../assets/contro.ico';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

export default function Login() {
  const { login } = useFormStore();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  const [aceptoPolitica, setAceptoPolitica] = useState(false);
  const [error, setError] = useState('');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && !nombre.trim()) {
      setError('Por favor, ingresa tu Nombre Completo y Cédula.');
      return;
    }

    if (mode === 'login' && !documento.trim()) {
      setError('Por favor, ingresa tu número de Cédula.');
      return;
    }

    if (documento.trim().length < 5) {
      setError('La cédula debe tener al menos 5 dígitos.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Hashear la cédula
      const hashCC = CryptoJS.SHA256(documento.trim()).toString(CryptoJS.enc.Hex);
      const userRef = doc(db, 'users', hashCC);
      
      if (mode === 'register') {
        if (!aceptoPolitica) {
          setError('Debes aceptar la Política de Tratamiento de Datos Personales para registrarte.');
          setIsLoading(false);
          return;
        }
        
        // Verificar si existe
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setError('Esta cédula ya está registrada. Por favor, inicia sesión.');
          setIsLoading(false);
          return;
        }

        // Crear documento
        await setDoc(userRef, {
          nombre: nombre.trim(),
          fechaRegistro: serverTimestamp(),
          pdfUrls: [] // Inicializar array de PDFs
        });
        
        login(nombre.trim(), documento.trim());
        
      } else {
        // Modo Login
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const userData = snap.data();
          login(userData.nombre, documento.trim());
        } else {
          setError('Cédula no registrada. Por favor regístrate.');
        }
      }
    } catch (err) {
      console.error('Error con Firebase:', err);
      setError('Ocurrió un error al conectarse con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
        
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="flex items-center justify-center relative z-10 mb-2 w-full mx-auto">
            <img src="/morar.ok.png" alt="Morar OK" className="w-full max-w-[220px] md:max-w-[260px] object-contain drop-shadow-sm" />
          </div>
          <p className="text-slate-500 text-sm font-medium leading-relaxed px-2 mb-4">
            Guía Técnica para la Inspección de Edificaciones Después de un Sismo
          </p>

          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 mb-1">Un producto desarrollado por:</span>
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="Controller" className="w-6 h-6 object-contain" />
              <span className="font-bold text-slate-600 text-sm">Controller R.M.A</span>
            </div>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Iniciar Sesión / Recuperar
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1F3B5F]/20 focus:border-[#1F3B5F] transition-all"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Número de Documento (Cédula)</label>
            <input
              type="text"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              placeholder="Ej. 123456789"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1F3B5F]/20 focus:border-[#1F3B5F] transition-all"
            />
          </div>

          {mode === 'register' && (
            <div className="flex items-start gap-3 mt-2 px-1">
              <input 
                type="checkbox" 
                id="politica"
                checked={aceptoPolitica}
                onChange={(e) => setAceptoPolitica(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-[#1F3B5F] focus:ring-[#1F3B5F]"
              />
              <label htmlFor="politica" className="text-sm text-slate-600 leading-tight">
                He leído y acepto la{' '}
                <button 
                  type="button" 
                  onClick={() => setIsPolicyModalOpen(true)}
                  className="text-[#1F3B5F] font-bold underline underline-offset-2 hover:text-[#152a45]"
                >
                  Política de Tratamiento de Datos Personales
                </button>
              </label>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <CustomButton 
            type="submit" 
            variant="primary" 
            disabled={isLoading}
            className={`w-full py-3.5 text-base mt-2 bg-[#1F3B5F] hover:bg-[#152a45] shadow-lg shadow-[#1F3B5F]/20 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Procesando...' : (mode === 'register' ? 'Crear Cuenta' : 'Ingresar')}
            {!isLoading && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 inline-block">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            )}
          </CustomButton>
        </form>
      </div>

      <PrivacyPolicyModal 
        isOpen={isPolicyModalOpen} 
        onClose={() => setIsPolicyModalOpen(false)} 
      />
    </div>
  );
}
