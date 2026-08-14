import React from 'react';
import { getColorStyles, getFisuraLabel, getRecomendacionFisura, clasificarFisura } from '../../engine/riskEngine';
import logoUrl from '../../assets/contro.ico';
import qatroLogoUrl from '../../assets/Qatro.png';
import nmLogoUrl from '../../assets/NM.png';

const Cell = ({ label, value, colSpan = 1, className = '', valueClass = '' }) => (
  <div className={`p-1 border-r border-b border-black flex flex-col justify-start col-span-${colSpan} ${className}`} style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}>
    <span className="text-[6px] font-bold text-black uppercase leading-tight mb-0.5">{label}</span>
    <span className={`text-[9px] text-black font-medium uppercase leading-tight ${valueClass}`}>{value || '\u00A0'}</span>
  </div>
);

const Section = ({ title, children, cols = 12, className = '' }) => (
  <div className={`mb-1.5 ${className}`}>
    <div className="bg-slate-200 border-t border-l border-r border-black px-1.5 py-0.5 -mb-px z-10 relative">
      <span className="text-[7px] font-extrabold text-black uppercase tracking-widest">{title}</span>
    </div>
    <div className="border-t border-l border-black bg-white" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {children}
    </div>
  </div>
);

export const PDFDocument = React.forwardRef(({ 
  fichaCompleta, 
  valoracion, 
  olorAGas, 
  step1, 
  step2, 
  step4, 
  step5, 
  step6,
  factores 
}, ref) => {
  const { color_final } = valoracion;
  const styles = getColorStyles(color_final);

  const renderPasos = (v) => v ? `${v} pasos aprox.` : '-';

  return (
    <div ref={ref} className="w-[794px] min-h-[1123px] bg-white text-black p-6 font-sans mx-auto box-border" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER TIPO FORMULARIO */}
      <div className="flex border border-black mb-1.5 bg-white">
        <div className="w-1/3 border-r border-black p-2 flex flex-col items-center justify-center">
          <div className="flex gap-2 items-center">
            <img src={logoUrl} alt="Controller" className="h-6 object-contain" />
            <img src={qatroLogoUrl} alt="Qatro" className="h-6 object-contain" />
            <img src={nmLogoUrl} alt="NM" className="h-6 object-contain" />
          </div>
        </div>
        
        <div className="w-2/3 flex items-center justify-center p-2 bg-slate-50">
          <h1 className="text-sm font-extrabold text-center uppercase tracking-wider">
            DICTAMEN TÉCNICO DE INSPECCIÓN POST-SISMO
          </h1>
        </div>
      </div>

      {/* 1. DATOS DE QUIEN DILIGENCIA */}
      <Section title="DATOS DE QUIEN DILIGENCIA" cols={12}>
        <Cell label="Nombre completo" value={step1?.nombreDiligenciador} colSpan={4} />
        <Cell label="Cédula" value={step1?.cedulaDiligenciador} colSpan={2} />
        <Cell label="Teléfono" value={step1?.telefonoDiligenciador} colSpan={3} />
        <Cell label="Correo electrónico" value={step1?.correoDiligenciador} colSpan={3} />
      </Section>

      {/* 2. DATOS BÁSICOS DE EDIFICACIÓN */}
      <Section title="DATOS BÁSICOS DE EDIFICACIÓN" cols={12}>
        <Cell label="Municipio" value={step1?.municipio} colSpan={3} />
        <Cell label="Vereda" value={step1?.vereda} colSpan={3} />
        <Cell label="Barrio" value={step1?.barrio} colSpan={6} />
        <Cell label="Dirección" value={step1?.direccion} colSpan={8} />
        <Cell label="Uso actual" value={step1?.usoActual} colSpan={4} />
        <Cell label="N.º de pisos" value={step1?.numeroPisos} colSpan={2} />
        <Cell label="N.º de sótanos" value={step1?.numeroSotanos} colSpan={2} />
        <Cell label="Ancho (Frente)" value={renderPasos(step1?.ancho)} colSpan={2} />
        <Cell label="Largo (Fondo)" value={renderPasos(step1?.largo)} colSpan={3} />
        <Cell label="Año construcción" value={step1?.anoConstruccion} colSpan={3} />
      </Section>

      {/* 3. SISTEMA ESTRUCTURAL */}
      <Section title="SISTEMA ESTRUCTURAL" cols={12}>
        <Cell label="Sistema Elegido" value={step2?.tipoConstruccion?.replace(/_/g, ' ')} colSpan={6} />
        <Cell label="Tipo de Cubierta" value={step2?.tipoCubierta?.replace(/_/g, ' ')} colSpan={3} />
        <Cell label="Tipo de Piso" value={step2?.tipoPiso?.replace(/_/g, ' ')} colSpan={3} />
      </Section>

      {/* 4. FISURAS, GRIETAS Y FALLAS */}
      <Section title={`FISURAS, GRIETAS Y FALLAS ESTRUCTURALES (${fichaCompleta.fisuras.length})`} cols={12}>
        <div className="col-span-12 p-1 border-b border-r border-black flex flex-col">
          {fichaCompleta.fisuras.length === 0 ? (
            <span className="text-[8px] italic">No se registraron fisuras o grietas.</span>
          ) : (
            fichaCompleta.fisuras.map((f, i) => {
              const col = clasificarFisura(f, fichaCompleta.sistema);
              return (
                <div key={i} className="text-[8px] border-b border-dashed border-gray-300 pb-1 mb-1 last:border-0 last:mb-0">
                  <span className="font-bold">{i + 1}. {f.elemento.toUpperCase()}</span> — {f._raw?.tipo?.replace(/_/g, ' ') || 'Fisura'} — Tamaño: {getFisuraLabel(f.tamano)} — Evolución: {getFisuraLabel(f.evolucion)} — Aceros expuestos: {f.aceros} {f.aceros === 'Sí' ? `(Corrosión: ${f.corrosion})` : ''}
                  <br />
                  <span className="text-[7px] text-gray-600">Recomendación: {getRecomendacionFisura(col)}</span>
                </div>
              );
            })
          )}
        </div>
      </Section>

      {/* 5. ASENTAMIENTO Y SUELO */}
      <Section title="TERRENO: ASENTAMIENTO E INCLINACIÓN Y EVALUACIÓN DEL SUELO" cols={12}>
        <div className="col-span-6 grid grid-cols-6">
          <div className="col-span-6 p-1 border-r border-b border-black flex flex-col justify-start">
            <span className="text-[6px] font-bold uppercase border-b border-gray-300 pb-0.5 mb-0.5">Asentamiento e Inclinación</span>
            <div className="flex justify-between text-[8px]"><span className="truncate pr-1">Asentamiento uniforme (parejo)</span> <span className="font-bold">{fichaCompleta.asentamiento.uniforme ? 'Sí' : 'No'}</span></div>
            <div className="flex justify-between text-[8px]"><span className="truncate pr-1">Asentamiento diferencial (disparejo)</span> <span className="font-bold">{fichaCompleta.asentamiento.diferencial ? 'Sí' : 'No'}</span></div>
            <div className="flex justify-between text-[8px]"><span className="truncate pr-1">Inclinación general</span> <span className="font-bold">{fichaCompleta.asentamiento.inclinacion ? 'Sí' : 'No'}</span></div>
            <div className="flex justify-between text-[8px]"><span className="truncate pr-1">Hundimiento localizado</span> <span className="font-bold">{fichaCompleta.asentamiento.localizado ? 'Sí' : 'No'}</span></div>
            <div className="mt-1 border-t border-gray-300 pt-0.5 text-[7px]"><span className="font-bold">Observaciones:</span> {step4?.observacionesAsentamiento || 'Ninguna'}</div>
          </div>
        </div>
        <div className="col-span-6 grid grid-cols-6">
          <div className="col-span-6 p-1 border-r border-b border-black flex flex-col justify-start">
            <span className="text-[6px] font-bold uppercase border-b border-gray-300 pb-0.5 mb-0.5">Evaluación del Suelo</span>
            <div className="flex justify-between text-[8px]"><span className="truncate pr-1">Deslizamiento de tierras</span> <span className="font-bold">{fichaCompleta.suelo.deslizamiento ? 'Sí' : 'No'}</span></div>
            <div className="flex justify-between text-[8px]"><span className="truncate pr-1">Caída de rocas</span> <span className="font-bold">{fichaCompleta.suelo.caida_rocas ? 'Sí' : 'No'}</span></div>
            <div className="flex justify-between text-[8px]"><span className="truncate pr-1">Licuefacción</span> <span className="font-bold">{fichaCompleta.suelo.licuefaccion ? 'Sí' : 'No'}</span></div>
            <div className="flex justify-between text-[8px]"><span className="truncate pr-1">Cimentación expuesta</span> <span className="font-bold">{fichaCompleta.suelo.cimentacion_expuesta ? 'Sí' : 'No'}</span></div>
            <div className="mt-1 border-t border-gray-300 pt-0.5 text-[7px]"><span className="font-bold">Observaciones:</span> {step5?.observacionesSuelo || 'Ninguna'}</div>
          </div>
        </div>
      </Section>

      {/* 6. ELEMENTOS NO ESTRUCTURALES */}
      <Section title="ELEMENTOS NO ESTRUCTURALES" cols={12}>
        <Cell label="Fachadas" value={fichaCompleta.elementosNoEstructurales.fachadas.join(', ') || 'Sin daños'} colSpan={6} />
        <Cell label="Puertas y ventanas" value={fichaCompleta.elementosNoEstructurales.puertas_ventanas.join(', ') || 'Sin daños'} colSpan={6} />
        <Cell label="Pisos y cielorrasos" value={fichaCompleta.elementosNoEstructurales.pisos_cielorrasos.join(', ') || 'Sin daños'} colSpan={6} />
        <Cell label="Muros interiores" value={fichaCompleta.elementosNoEstructurales.muros_interiores.join(', ') || 'Sin daños'} colSpan={6} />
        <Cell label="Instalaciones" value={fichaCompleta.elementosNoEstructurales.instalaciones.join(', ') || 'Sin daños'} colSpan={6} />
        <Cell label="Cubiertas" value={fichaCompleta.elementosNoEstructurales.cubiertas.join(', ') || 'Sin daños'} colSpan={6} />
        {step6?.sabeCantidadMuros === 'si' ? (
          <Cell label="Cantidad total de muros / Con daños severos" value={`${step6.cantidadMuros} / ${step6.murosDanos}`} colSpan={12} />
        ) : (
          <Cell label="¿Sabe cuántos muros tiene?" value="No" colSpan={12} />
        )}
      </Section>

      {/* 7. EVALUACIÓN FINAL */}
      <Section title="DICTAMEN Y FACTORES CONSIDERADOS" cols={12}>
        <div className="col-span-8 border-r border-b border-black p-2 flex flex-col bg-white">
          <span className="text-[7px] font-bold uppercase mb-1">Principales factores considerados:</span>
          <ul className="list-disc list-inside text-[8px] space-y-0.5 pl-1 mb-2">
            {factores.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          {olorAGas && <div className="text-[8px] font-black border border-black p-1 text-center uppercase">⚠️ Alerta de Seguridad: Se reportó olor a gas</div>}
        </div>
        <div className="col-span-4 border-b border-black flex flex-col justify-center p-2 items-center text-center">
          <span className="text-[6px] font-bold uppercase mb-1 border-b border-black pb-0.5 w-full">Clasificación de Riesgo</span>
          <div className={`w-full py-1 text-center font-black uppercase text-xs border-2 border-black ${styles.bg}`}>
            {color_final}
          </div>
          <span className="text-[7px] mt-1 uppercase font-bold leading-tight w-full">{styles.title}</span>
        </div>
      </Section>

      {/* 8. EVIDENCIA */}
      <Section title="EVIDENCIA GRÁFICA Y GEORREFERENCIACIÓN" cols={12}>
        <div className="col-span-12 grid grid-cols-2 p-1 border-r border-b border-black gap-1">
          <div className="border border-dashed border-gray-400 flex flex-col items-center justify-center relative p-1 h-32">
             <span className="text-[6px] font-bold uppercase absolute top-1 left-1 bg-white px-1">Fotografía de Fachada</span>
             {step1?.fotoFachadaUrl ? (
               <img src={step1.fotoFachadaUrl} alt="Fachada" className="w-full h-full object-contain" />
             ) : (
               <span className="text-[8px] text-slate-400 italic">No suministrada</span>
             )}
          </div>
          <div className="border border-dashed border-gray-400 flex flex-col items-center justify-center relative p-1 h-32 bg-slate-50">
             <span className="text-[6px] font-bold uppercase absolute top-1 left-1 bg-white px-1 z-10">Ubicación GPS</span>
             {step1?.latitud && step1?.longitud ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-xl mb-1">📍</span>
                  <span className="text-[9px] font-bold">LAT: {step1.latitud}</span>
                  <span className="text-[9px] font-bold">LNG: {step1.longitud}</span>
                </div>
             ) : (
               <span className="text-[8px] text-slate-400 italic">No registrada</span>
             )}
          </div>
        </div>
      </Section>

    </div>
  );
});
