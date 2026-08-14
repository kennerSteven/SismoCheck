import React, { useMemo, useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import useFormStore from '../../store/useFormStore';
import { Toast } from '../../utils/alerts';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import CryptoJS from 'crypto-js';
import { calcularValoracion, clasificarFisura, AMARILLO, NARANJA, ROJO, getColorStyles, getRecomendacionFisura, getFisuraLabel } from '../../engine/riskEngine';
import CustomButton from '../ui/CustomButton';
import FormHeader from '../layout/FormHeader';
import { PDFDocument } from '../layout/PDFDocument';

// --- COMPONENTES AUXILIARES ---

const Row = ({ label, value }) => (
  <div className="flex justify-between items-end py-2 border-b border-dotted border-gray-400">
    <span className="text-gray-600 text-sm font-semibold pr-4">{label}</span>
    <span className="text-gray-900 text-sm font-medium text-right">{value}</span>
  </div>
);

const Badge = ({ children, colorClass = "bg-gray-100 text-gray-800 border-gray-300" }) => (
  <span className={`inline-block px-2 py-1 rounded border text-xs font-bold uppercase tracking-wide ${colorClass}`}>
    {children}
  </span>
);

const YesNoBadge = ({ label, value }) => {
  const isYes = value === 'Sí';
  const colorClass = isYes 
    ? 'bg-amber-100 border-amber-300 text-amber-900' 
    : 'bg-gray-50 border-gray-200 text-gray-600';
  return (
    <Badge colorClass={colorClass}>
      <span className="font-medium mr-1">{label} -</span> <span className="font-extrabold">{value || 'No sabe'}</span>
    </Badge>
  );
};

// --- FUNCIONES DE MAPEO ---

const mapBoolean = (val) => {
  if (val === 'si' || val === 'Sí') return 'Sí';
  if (val === 'no' || val === 'No') return 'No';
  if (val === 'nosabe' || val === 'nose' || val === 'No sabe') return 'No sabe';
  return 'No sabe';
};

const mapSistema = (uiSistema) => {
  const map = {
    'muros_concreto': 'muros_carga_concreto',
    'mamposteria_confinada': 'mamp_confinada',
    'mamposteria_estructural': 'mamp_estructural',
    'mamposteria_simple': 'mamp_no_reforzada',
    'construccion_tradicional': 'tradicional',
    'construccion_palafitica': 'palafitica',
    'construccion_prefabricada': 'prefab',
    'madera_portante': 'madera_pesada',
    'estructura_metalica': 'estructura_metalica',
    'otro_mixto': 'otro'
  };
  return map[uiSistema] || 'otro';
};

const mapElemento = (val) => {
  const map = { columna: 'Columna', viga: 'Viga', muro: 'Muro', escaleras: 'Escaleras', piso: 'Piso', techo: 'Techo' };
  return map[val] || val || 'Muro';
};

const renderPasos = (val) => {
  if (!val) return '-';
  const metros = (parseFloat(val) * 0.75).toFixed(1);
  return `${val} (≈ ${metros} m)`;
};

export default function ResumenForm() {
  const { formData, user, setFooterHidden, prevStep, resetDiagnostico } = useFormStore();
  const contentRef = useRef(null);
  const pdfRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  React.useEffect(() => {
    setFooterHidden(true);
    return () => setFooterHidden(false);
  }, [setFooterHidden]);

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      const node = pdfRef.current;
      
      if (!node) throw new Error("Referencia del PDF no encontrada");

      // 1. Instanciar jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      const blocks = Array.from(node.querySelectorAll('.pdf-block'));
      if (blocks.length === 0) throw new Error("No se encontraron bloques para el PDF");

      let currentY = margin;
      const containerRect = node.getBoundingClientRect();
      const scale = (pdfWidth - 2 * margin) / 794;

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        
        // Generar imagen de alta calidad del bloque
        const dataUrl = await toJpeg(block, { 
          quality: 0.98, 
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          style: { margin: '0' }
        });

        const blockRect = block.getBoundingClientRect();
        const xOffset = blockRect.left - containerRect.left;
        
        const blockX = margin + (xOffset * scale);
        const scaledWidth = block.offsetWidth * scale;
        const scaledHeight = block.offsetHeight * scale;
        
        // Si el bloque no cabe en la página actual, saltar de página
        if (currentY + scaledHeight > pdfHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.addImage(dataUrl, 'JPEG', blockX, currentY, scaledWidth, scaledHeight, undefined, 'FAST');
        
        // Separación vertical entre bloques en la misma página
        currentY += scaledHeight + (4 * scale); 
      }

      // 2. Guardar el archivo localmente
      pdf.save('morar.ok_Dictamen.pdf');

      /* ======== DESHABILITADO TEMPORALMENTE ========
      // 3. Subir a Firebase Storage
      const blob = pdf.output('blob');
      const timestamp = new Date().getTime();
      const hashCC = CryptoJS.SHA256(user.documento.trim()).toString(CryptoJS.enc.Hex);
      const fileName = `dictamenes/${hashCC}/morar.ok_${timestamp}.pdf`;
      const storageRef = ref(storage, fileName);
      
      Toast.fire({ icon: 'info', title: 'Subiendo copia a la nube...', timer: 2000 });
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // 4. Actualizar Firestore
      const userRef = doc(db, 'users', hashCC);
      await updateDoc(userRef, {
        pdfUrls: arrayUnion(downloadURL)
      });
      ================================================ */
      
      Toast.fire({ icon: 'success', title: 'PDF generado exitosamente.' });
    } catch (error) {
      console.error('Error generando PDF o subiendo a Firebase:', error);
      Toast.fire({ icon: 'error', title: 'Error al generar o subir PDF: ' + (error.message || 'Desconocido') });
    } finally {
      setIsGenerating(false);
    }
  };

  const { step1, step2, step3, step4, step5, step6 } = formData;
  const fisurasRaw = step3?.fisurasList || [];
  const instalacionesRaw = step6?.instalaciones || [];

  // 1. Preparar ficha completa
  const fichaCompleta = useMemo(() => {
    return {
      sistema: mapSistema(step2?.tipoConstruccion),
      fisuras: fisurasRaw.map(f => ({
        elemento: mapElemento(f.elemento),
        tamano: f.tamano,
        evolucion: f.evolucion,
        aceros: f.aceros || mapBoolean(f.acerosExpuestos) || 'No',
        corrosion: f.corrosion || 'No',
        sonido: mapBoolean(f.sonido),
        _raw: f
      })),
      asentamiento: {
        uniforme: mapBoolean(step4?.uniforme),
        diferencial: mapBoolean(step4?.diferencial),
        inclinacion: mapBoolean(step4?.inclinacion),
        localizado: mapBoolean(step4?.localizado)
      },
      suelo: {
        deslizamiento: mapBoolean(step5?.deslizamiento),
        caida_rocas: mapBoolean(step5?.caida_rocas),
        licuefaccion: mapBoolean(step5?.licuefaccion),
        cimentacion_expuesta: mapBoolean(step5?.cimentacion_expuesta)
      },
      elementosNoEstructurales: {
        fachadas: step6?.fachadas || [],
        puertas_ventanas: step6?.puertas_ventanas || [],
        pisos_cielorrasos: step6?.pisos_cielorasos || [],
        muros_interiores: step6?.muros_interiores || [],
        instalaciones: instalacionesRaw,
        cubiertas: step6?.cubiertas || []
      }
    };
  }, [step2, step4, step5, step6, fisurasRaw, instalacionesRaw]);

  // 2. Ejecutar motor de cálculo y obtener factores
  const { valoracion, factores } = useMemo(() => {
    const val = calcularValoracion(fichaCompleta);
    const facts = [];
    
    fichaCompleta.fisuras.forEach((f) => {
      const col = clasificarFisura(f, fichaCompleta.sistema);
      if (col === ROJO) facts.push(`Fisura en ${f.elemento} (${getFisuraLabel(f.tamano)}) — nivel ROJO`);
      else if (col === NARANJA) facts.push(`Fisura en ${f.elemento} (${getFisuraLabel(f.tamano)}) — nivel NARANJA`);
      else if (col === AMARILLO) facts.push(`Fisura en ${f.elemento} (${getFisuraLabel(f.tamano)}) — nivel AMARILLO`);
    });

    if (fichaCompleta.asentamiento.uniforme === 'Sí') facts.push('Asentamiento uniforme (parejo).');
    if (fichaCompleta.asentamiento.diferencial === 'Sí') facts.push('Asentamiento diferencial (disparejo).');
    if (fichaCompleta.asentamiento.inclinacion === 'Sí') facts.push('Inclinación general de toda la construcción.');
    if (fichaCompleta.asentamiento.localizado === 'Sí') facts.push('Hundimiento localizado.');

    if (fichaCompleta.suelo.deslizamiento === 'Sí') facts.push('Deslizamiento de tierras en el terreno.');
    if (fichaCompleta.suelo.caida_rocas === 'Sí') facts.push('Caída de rocas o piedras de la montaña.');
    if (fichaCompleta.suelo.licuefaccion === 'Sí') facts.push('Suelo arenoso o blando cerca de ríos (Licuefacción).');
    if (fichaCompleta.suelo.cimentacion_expuesta === 'Sí') facts.push('Cimentación expuesta en el terreno.');

    if (fichaCompleta.elementosNoEstructurales.instalaciones.includes('Olor a gas')) facts.push('Se reportó olor a gas.');
    if (fichaCompleta.elementosNoEstructurales.cubiertas.includes('Colapso (desprendimiento total)')) facts.push('Colapso (desprendimiento total) reportado en cubiertas.');

    if (val.puntaje_total >= 6 && ['mamp_no_reforzada', 'tradicional'].includes(fichaCompleta.sistema)) {
      facts.push('Vulnerabilidad por sistema constructivo de baja resistencia a sismos.');
    }

    if (facts.length === 0) facts.push('No se detectaron fallas estructurales graves ni factores de riesgo inminentes.');

    return { valoracion: val, factores: facts };
  }, [fichaCompleta]);

  const { color_final } = valoracion;
  const styles = getColorStyles(color_final);
  const olorAGas = instalacionesRaw.includes('Olor a gas');

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto pb-28 px-2 md:px-0 print:overflow-visible print:pb-0">
        
        <div ref={contentRef} className="space-y-8 bg-white p-2 print:p-0" id="resumen-content">
          <FormHeader />
          
          {/* DISCLAIMER MOVIDO AL PRINCIPIO */}
          <div className="mb-6 text-xs leading-relaxed text-justify p-4 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm">
            <strong className="block mb-1 text-sm font-bold text-slate-800">⚠ Aviso importante</strong>
            Esta valoración es un resultado orientativo, calculado automáticamente a partir de lo registrado en esta ficha (lesiones, asentamientos, suelo y elementos no estructurales). Se basa en criterios generales de clasificación por colores utilizados en evaluaciones rápidas de construcciones (verde / amarillo / naranja / rojo), como una primera aproximación al estado de la edificación.<br/><br/>
            Este resultado no reemplaza la visita, el análisis detallado mediante ensayos destructivos y no destructivos de acuerdo al sistema constructivo en particular; tampoco constituye estrictamente un estudio de vulnerabilidad sísmica, ni el diagnóstico profesional de un ingeniero o arquitecto habilitado, quien es el único profesional autorizado para determinar oficialmente la habitabilidad de la construcción. No obstante, si usted ha seguido todos los pasos, este es un registro completo que le servirá como primer insumo para un diagnóstico profesional.
          </div>

          {/* BANNER DINÁMICO */}
          <div className={`p-6 md:p-8 rounded-2xl border-l-8 border-y-2 border-r-2 ${styles.border} ${styles.bg} shadow-sm relative`}>
          <div className="flex items-center space-x-3 mb-2">
            <span className={`w-4 h-4 rounded-full ${styles.badge} shadow-sm border border-black/10 shrink-0`}></span>
            <span className={`text-xl font-bold ${styles.text}`}>
              {styles.title}
            </span>
          </div>
          
          <h2 className={`text-sm font-semibold uppercase tracking-tight mb-6 ${styles.text}`}>
            {styles.subtitle}
          </h2>

          {olorAGas && (
            <div className="mb-6 bg-red-100 border-2 border-red-700 text-red-900 p-4 rounded-xl flex gap-4 shadow-sm items-start">
              <span className="text-2xl leading-none">⚠️</span>
              <div>
                <strong className="block text-sm uppercase tracking-wide mb-1 font-black">Alerta Crítica de Seguridad</strong>
                <span className="text-sm font-medium">Se reportó olor a gas: siga primero las recomendaciones de seguridad indicadas en el paso de Elementos no estructurales.</span>
              </div>
            </div>
          )}

          <div className={`mt-6 ${styles.text}`}>
            <h4 className="font-bold text-sm uppercase tracking-wide opacity-80 mb-3">Principales factores considerados:</h4>
            <ul className="list-disc list-inside space-y-2 font-medium text-sm md:text-base opacity-90">
              {factores.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>

          </div>

        {/* SECCIONES DE DATOS */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 md:p-8 shadow-sm">
          
          {/* Datos del Diligenciador */}
          <section className="mb-10">
            <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-900 pb-2 mb-4 uppercase tracking-tight">Datos de quien diligencia</h3>
            <Row label="Nombre completo" value={step1?.nombreDiligenciador || '-'} />
            <Row label="Cédula" value={step1?.cedulaDiligenciador || '-'} />
            <Row label="Teléfono" value={step1?.telefonoDiligenciador || '-'} />
            <Row label="Correo electrónico" value={step1?.correoDiligenciador || '-'} />
          </section>

          {/* Datos Básicos */}
          <section className="mb-10">
            <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-900 pb-2 mb-4 uppercase tracking-tight">Datos básicos de edificación</h3>
            
            {step1?.fotoFachadaUrl && (
              <div className="mb-6 w-full h-48 md:h-64 rounded-xl overflow-hidden border border-gray-200 bg-slate-50">
                <img src={step1.fotoFachadaUrl} alt="Fachada de la propiedad" className="w-full h-full object-cover" />
              </div>
            )}

            <Row label="Dirección" value={`${step1?.direccion || '-'}, ${step1?.barrio || '-'}`} />
            {step1?.vereda && <Row label="Vereda" value={step1.vereda} />}
            <Row label="Municipio" value={step1?.municipio || '-'} />
            <Row label="N.º de pisos / Sótanos" value={`${step1?.numeroPisos || '-'} / ${step1?.numeroSotanos || '0'}`} />
            
            <Row label="Ancho (Frente)" value={renderPasos(step1?.ancho)} />
            <Row label="Largo (Fondo)" value={renderPasos(step1?.largo)} />
            
            <Row label="Año de construcción" value={step1?.anoConstruccion || '-'} />
            <Row label="Uso actual" value={step1?.usoActual?.toUpperCase() || '-'} />
            
            <div className="mt-6 mb-2">
              <strong className="block text-sm text-gray-500 uppercase tracking-widest mb-3">Ubicación GPS</strong>
              {typeof step1?.latitud === 'number' && typeof step1?.longitud === 'number' && step1.latitud >= -90 && step1.latitud <= 90 ? (
                <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden border border-gray-200 relative group">
                  <div className="absolute inset-0 z-10 bg-transparent"></div>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${step1.longitud-0.005},${step1.latitud-0.005},${step1.longitud+0.005},${step1.latitud+0.005}&layer=mapnik&marker=${step1.latitud},${step1.longitud}`}
                  ></iframe>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No registrada</div>
              )}
            </div>
          </section>

          {/* Sistema Estructural */}
          <section className="mb-10">
            <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-900 pb-2 mb-4 uppercase tracking-tight">Sistema Estructural</h3>
            <Row 
              label="Sistema elegido" 
              value={<Badge colorClass="bg-blue-50 text-blue-800 border-blue-200">{step2?.tipoConstruccion?.replace(/_/g, ' ') || 'No definido'}</Badge>} 
            />
            <Row label="Tipo de cubierta" value={step2?.tipoCubierta?.replace(/_/g, ' ').toUpperCase() || '-'} />
            <Row label="Tipo de piso" value={step2?.tipoPiso?.replace(/_/g, ' ').toUpperCase() || '-'} />
          </section>

          {/* Fisuras */}
          <section className="mb-10">
            <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-900 pb-2 mb-4 uppercase tracking-tight">
              Fisuras, grietas y fallas ({fichaCompleta.fisuras.length})
            </h3>
            {fichaCompleta.fisuras.length === 0 ? (
              <div className="py-4 text-center text-gray-500 font-medium italic border-b border-dotted border-gray-400">
                No se registraron fisuras o grietas.
              </div>
            ) : (
              <div className="space-y-0">
                {fichaCompleta.fisuras.map((f, idx) => {
                  const col = clasificarFisura(f, fichaCompleta.sistema);
                  const sColor = getColorStyles(col);
                  return (
                    <div key={idx} className="flex flex-col sm:flex-row py-5 border-b border-dotted border-gray-400 gap-4 sm:gap-6 items-start">
                      {f._raw?.fotoUrl ? (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0">
                          <img src={f._raw.fotoUrl} alt={`Foto daño ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-slate-50 border border-gray-200 flex items-center justify-center shrink-0">
                          <span className="text-xs text-gray-400 italic">Sin foto</span>
                        </div>
                      )}
                      <div className="flex-1 text-left flex flex-col justify-center h-full">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gray-900 font-black text-base">#{idx + 1} - {f.elemento.toUpperCase()}</span>
                          <Badge colorClass={sColor.badgeClass}>{sColor.colorName}</Badge>
                        </div>
                        <span className="text-gray-800 text-sm font-medium mb-1">
                          <span className="text-gray-500 font-normal">Tipo:</span> {f._raw?.tipo?.replace(/_/g, ' ') || 'Fisura'}
                        </span>
                        <span className="text-gray-800 text-sm font-medium mb-1">
                          <span className="text-gray-500 font-normal">Tamaño:</span> {getFisuraLabel(f.tamano)} <span className="text-gray-400 mx-1">|</span> <span className="text-gray-500 font-normal">Evolución:</span> {getFisuraLabel(f.evolucion)}
                        </span>
                        <span className="text-gray-800 text-sm font-medium mb-2">
                          <span className="text-gray-500 font-normal">Aceros expuestos:</span> {f.aceros} {f.aceros === 'Sí' ? `(Corrosión: ${f.corrosion})` : ''}
                        </span>
                        <span className="text-gray-500 text-xs italic leading-tight">
                          Recomendación: {getRecomendacionFisura(col)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Asentamiento */}
          <section className="mb-10">
            <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-900 pb-2 mb-4 uppercase tracking-tight">Asentamiento e inclinación</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <YesNoBadge label="Asentamiento uniforme (parejo)" value={fichaCompleta.asentamiento.uniforme} />
              <YesNoBadge label="Asentamiento diferencial (disparejo)" value={fichaCompleta.asentamiento.diferencial} />
              <YesNoBadge label="Inclinación general" value={fichaCompleta.asentamiento.inclinacion} />
              <YesNoBadge label="Hundimiento localizado" value={fichaCompleta.asentamiento.localizado} />
            </div>
            <Row label="Observaciones" value={step4?.observacionesAsentamiento || 'Ninguna'} />
          </section>

          {/* Suelo */}
          <section className="mb-10">
            <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-900 pb-2 mb-4 uppercase tracking-tight">Evaluación del suelo</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <YesNoBadge label="Deslizamiento de tierras" value={fichaCompleta.suelo.deslizamiento} />
              <YesNoBadge label="Caída de rocas" value={fichaCompleta.suelo.caida_rocas} />
              <YesNoBadge label="Licuefacción" value={fichaCompleta.suelo.licuefaccion} />
              <YesNoBadge label="Cimentación expuesta" value={fichaCompleta.suelo.cimentacion_expuesta} />
            </div>
            <Row label="Observaciones" value={step5?.observacionesSuelo || 'Ninguna'} />
          </section>

          {/* Elementos no estructurales */}
          <section>
            <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-900 pb-2 mb-4 uppercase tracking-tight">Elementos no estructurales</h3>
            <Row label="Fachadas" value={fichaCompleta.elementosNoEstructurales.fachadas.join(', ') || 'Sin daños'} />
            <Row label="Puertas y ventanas" value={fichaCompleta.elementosNoEstructurales.puertas_ventanas.join(', ') || 'Sin daños'} />
            <Row label="Pisos y cielorrasos" value={fichaCompleta.elementosNoEstructurales.pisos_cielorrasos.join(', ') || 'Sin daños'} />
            <Row label="Muros interiores" value={fichaCompleta.elementosNoEstructurales.muros_interiores.join(', ') || 'Sin daños'} />
            <Row label="Instalaciones" value={fichaCompleta.elementosNoEstructurales.instalaciones.join(', ') || 'Sin daños'} />
            <Row label="Cubiertas" value={fichaCompleta.elementosNoEstructurales.cubiertas.join(', ') || 'Sin daños'} />
            
            {step6?.sabeCantidadMuros === 'si' && (
              <>
                <Row label="¿Sabe cuántos muros tiene?" value="Sí" />
                <Row label="Cantidad total de muros" value={step6?.cantidadMuros || '-'} />
                <Row label="Muros con daños" value={step6?.murosDanos || '-'} />
              </>
            )}
            {step6?.sabeCantidadMuros === 'no' && (
              <Row label="¿Sabe cuántos muros tiene?" value="No" />
            )}
          </section>

        </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-between gap-3 z-50 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] print:hidden">
        <CustomButton 
          variant="outline" 
          onClick={prevStep}
          className="px-4 md:px-6 font-bold text-slate-500 border-slate-300 hover:bg-slate-50"
        >
          Atrás
        </CustomButton>

        <div className="flex-1 flex gap-2 md:gap-3 justify-end">
          <CustomButton 
            variant="primary"
            onClick={async () => {
              await handleDownloadPDF();
              Toast.fire({ icon: 'success', title: 'Dictamen guardado y exportado exitosamente' });
              resetDiagnostico();
            }}
            disabled={isGenerating}
            className="font-bold px-4 md:px-8 shadow-md text-sm md:text-base bg-[#1F3B5F] hover:bg-[#152a45] text-white"
          >
            {isGenerating ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            )}
            {isGenerating ? 'GENERANDO...' : 'GUARDAR Y EXPORTAR PDF'}
          </CustomButton>
        </div>
      </div>
      {/* COMPONENTE OCULTO PARA GENERAR EL PDF FORMAL (A4) */}
      <div className="absolute top-[-10000px] left-[-10000px] w-auto h-auto pointer-events-none -z-50">
        <PDFDocument 
          ref={pdfRef}
          fichaCompleta={fichaCompleta}
          valoracion={valoracion}
          olorAGas={olorAGas}
          step1={step1}
          step2={step2}
          step4={step4}
          step5={step5}
          step6={step6}
          factores={factores}
        />
      </div>

    </div>
  );
}
