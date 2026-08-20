import React from 'react';
import { getColorStyles, getFisuraLabel, getRecomendacionFisura, clasificarFisura } from '../../engine/riskEngine';
import logoUrl from '../../assets/contro.ico';
import qatroLogoUrl from '../../assets/Qatro.png';
import nmLogoUrl from '../../assets/NM.png';
import logoAscolpat from '../../assets/LogosPDF/ASCOLPAT.png';
import logoUnigranadinos from '../../assets/LogosPDF/UNIGRANADINOS.png';

const StaticTileMap = ({ lat, lon, zoom }) => {
  // Slippy Map math
  const n = Math.pow(2, zoom);
  const latRad = (lat * Math.PI) / 180;
  const xtileExact = n * ((lon + 180) / 360);
  const ytileExact = (n * (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI)) / 2;

  const xtile = Math.floor(xtileExact);
  const ytile = Math.floor(ytileExact);

  // Pixel offset from the top-left of the center tile (256x256)
  const px = (xtileExact - xtile) * 256;
  const py = (ytileExact - ytile) * 256;

  // We want the exact coordinate to be at the center of the container.
  // The container is 100% width/height. We'll make the grid 3x3 tiles (768x768px).
  // The exact coordinate inside the 768x768 grid is at (256 + px, 256 + py).
  // We offset the grid by - (256 + px) and - (256 + py) plus 50% of the container to center it.

  const tiles = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({ x: xtile + dx, y: ytile + dy, key: `${xtile + dx}-${ytile + dy}` });
    }
  }

  return (
    <div className="absolute inset-0 z-10 bg-[#AAD3DF] pointer-events-none" style={{ overflow: 'hidden' }}>
      <div
        className="absolute"
        style={{
          width: '768px', height: '768px',
          top: '50%', left: '50%',
          transform: `translate(calc(-50% - ${px}px + 128px), calc(-50% - ${py}px + 128px))`
        }}
      >
        {tiles.map((t, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          return (
            <img
              key={t.key}
              src={`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`}
              crossOrigin="anonymous"
              alt="Map Tile"
              style={{
                position: 'absolute',
                left: `${col * 256}px`,
                top: `${row * 256}px`,
                width: '256px',
                height: '256px'
              }}
            />
          );
        })}
      </div>
      {/* Red Pin exactly in the center of the container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-20 pb-2">
        <span className="text-4xl drop-shadow-md">📍</span>
      </div>
    </div>
  );
};

const Cell = ({ label, value, colSpan = 1, className = '', valueClass = '' }) => (
  <div className={`p-3 border-r border-b border-slate-100 flex flex-col justify-start col-span-${colSpan} ${className}`} style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</span>
    <span className={`text-xs text-slate-800 font-bold leading-snug break-words break-all ${valueClass}`}>{value || '\u00A0'}</span>
  </div>
);

const Section = ({ title, children, cols = 12, className = '' }) => (
  <div className={`mb-4 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0 pdf-block ${className}`}>
    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center">
      <span className="text-xs font-extrabold text-[#1F3B5F] uppercase tracking-widest">{title}</span>
    </div>
    <div className="grid bg-white" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
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
    <div ref={ref} className="w-[794px] bg-slate-50 text-slate-900 font-sans mx-auto box-border" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>

      {/* ================= MAIN CONTENT ================= */}
      <div className="p-8 box-border relative flex flex-col gap-1">
        {/* LOGO SUPERIOR */}
        <div className="flex items-center justify-center mb-4 pdf-block">
          <img src="/morar.ok.png" alt="Morar OK" className="w-full max-w-[200px] object-contain drop-shadow-sm" />
        </div>

        {/* HEADER MODERNO */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 pdf-block">
          <div className="flex gap-6 items-center">
            <img src={logoUrl} alt="Controller" className="h-14 object-contain drop-shadow-sm" />
            <div className="w-px h-12 bg-slate-200"></div>
            <img src={qatroLogoUrl} alt="Qatro" className="h-16 object-contain drop-shadow-sm" />
            <div className="w-px h-12 bg-slate-200"></div>
            <img src={nmLogoUrl} alt="NM" className="h-14 object-contain drop-shadow-sm" />
          </div>
          <div className="flex-1 ml-8 text-right">
            <h1 className="text-xl font-black text-[#1F3B5F] uppercase tracking-tight leading-tight">
              DICTAMEN TÉCNICO DE<br />INSPECCIÓN POST-SISMO
            </h1>
            <div className="mt-2 inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* DISCLAIMER MOVIDO AL PRINCIPIO */}
        <div className="mb-4 text-[9px] leading-relaxed text-justify p-4 rounded-xl border border-slate-200 bg-white text-slate-600 pdf-block shadow-sm">
          <strong className="block mb-1 text-[10px] text-slate-800 font-bold">⚠ Aviso importante</strong>
          Esta valoración es un resultado orientativo, calculado automáticamente a partir de lo registrado en esta ficha (lesiones, asentamientos, suelo y elementos no estructurales). Se basa en criterios generales de clasificación por colores utilizados en evaluaciones rápidas de construcciones (verde / amarillo / naranja / rojo), como una primera aproximación al estado de la edificación.<br /><br />
          Este resultado no reemplaza la visita, el análisis detallado mediante ensayos destructivos y no destructivos de acuerdo al sistema constructivo en particular; tampoco constituye estrictamente un estudio de vulnerabilidad sísmica, ni el diagnóstico profesional de un ingeniero o arquitecto habilitado, quien es el único profesional autorizado para determinar oficialmente la habitabilidad de la construcción. No obstante, si usted ha seguido todos los pasos, este es un registro completo que le servirá como primer insumo para un diagnóstico profesional.
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
        <div className="mb-4 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center rounded-t-xl pdf-block">
            <span className="text-xs font-extrabold text-[#1F3B5F] uppercase tracking-widest">{`FISURAS, GRIETAS Y FALLAS ESTRUCTURALES (${fichaCompleta.fisuras.length})`}</span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {fichaCompleta.fisuras.length === 0 ? (
              <div className="text-sm text-slate-500 italic text-center py-4 pdf-block">No se registraron fisuras o grietas.</div>
            ) : (
              fichaCompleta.fisuras.map((f, i) => {
                const col = clasificarFisura(f, fichaCompleta.sistema);
                return (
                  <div key={i} className="flex gap-4 border border-slate-100 rounded-xl p-3 bg-slate-50/50 shadow-sm items-start pdf-block">
                    {f._raw?.fotoUrl ? (
                      <img src={f._raw.fotoUrl} alt="Foto daño" className="h-24 w-24 rounded-lg object-cover border border-slate-200 shadow-sm shrink-0" />
                    ) : (
                      <div className="h-24 w-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-slate-400 font-medium">SIN FOTO</span>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-[#1F3B5F] text-white text-[10px] font-black px-2 py-0.5 rounded-md">#{i + 1}</span>
                        <span className="font-black text-sm text-slate-800">{f.elemento.toUpperCase()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2">
                        <span className="text-slate-700"><strong className="text-slate-500 font-semibold">Tipo:</strong> {f._raw?.tipo?.replace(/_/g, ' ') || 'Fisura'}</span>
                        <span className="text-slate-700"><strong className="text-slate-500 font-semibold">Tamaño:</strong> {getFisuraLabel(f.tamano)}</span>
                        <span className="text-slate-700"><strong className="text-slate-500 font-semibold">Evolución:</strong> {getFisuraLabel(f.evolucion)}</span>
                        <span className="text-slate-700"><strong className="text-slate-500 font-semibold">Aceros exp.:</strong> {f.aceros} {f.aceros === 'Sí' ? `(Óxido: ${f.corrosion})` : ''}</span>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-lg p-2 text-[10px] text-slate-600 font-medium italic shadow-sm">
                        <strong className="text-slate-800 not-italic">Recomendación:</strong> {getRecomendacionFisura(col)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Page break before next section */}
        <div className="html2pdf__page-break"></div>

        {/* 5. ASENTAMIENTO Y SUELO */}
        <Section title="TERRENO: ASENTAMIENTO E INCLINACIÓN Y EVALUACIÓN DEL SUELO" cols={12}>
          <div className="col-span-6 border-r border-slate-100 p-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Asentamiento e Inclinación</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Asentamiento uniforme (parejo)</span> <span className={`font-bold px-2 py-0.5 rounded-full ${fichaCompleta.asentamiento.uniforme === 'Sí' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{fichaCompleta.asentamiento.uniforme.toUpperCase()}</span></div>
              <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Asentamiento diferencial (disparejo)</span> <span className={`font-bold px-2 py-0.5 rounded-full ${fichaCompleta.asentamiento.diferencial === 'Sí' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{fichaCompleta.asentamiento.diferencial.toUpperCase()}</span></div>
              <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Inclinación general</span> <span className={`font-bold px-2 py-0.5 rounded-full ${fichaCompleta.asentamiento.inclinacion === 'Sí' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{fichaCompleta.asentamiento.inclinacion.toUpperCase()}</span></div>
              <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Hundimiento localizado</span> <span className={`font-bold px-2 py-0.5 rounded-full ${fichaCompleta.asentamiento.localizado === 'Sí' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{fichaCompleta.asentamiento.localizado.toUpperCase()}</span></div>
            </div>
            <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px] text-slate-600">
              <strong className="text-slate-800 uppercase block mb-1">Observaciones:</strong>
              {step4?.observacionesAsentamiento || 'Ninguna'}
            </div>
          </div>
          <div className="col-span-6 p-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Evaluación del Suelo</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Deslizamiento de tierras</span> <span className={`font-bold px-2 py-0.5 rounded-full ${fichaCompleta.suelo.deslizamiento === 'Sí' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{fichaCompleta.suelo.deslizamiento.toUpperCase()}</span></div>
              <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Caída de rocas</span> <span className={`font-bold px-2 py-0.5 rounded-full ${fichaCompleta.suelo.caida_rocas === 'Sí' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{fichaCompleta.suelo.caida_rocas.toUpperCase()}</span></div>
              <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Licuefacción</span> <span className={`font-bold px-2 py-0.5 rounded-full ${fichaCompleta.suelo.licuefaccion === 'Sí' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{fichaCompleta.suelo.licuefaccion.toUpperCase()}</span></div>
              <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Cimentación expuesta</span> <span className={`font-bold px-2 py-0.5 rounded-full ${fichaCompleta.suelo.cimentacion_expuesta === 'Sí' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{fichaCompleta.suelo.cimentacion_expuesta.toUpperCase()}</span></div>
            </div>
            <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px] text-slate-600">
              <strong className="text-slate-800 uppercase block mb-1">Observaciones:</strong>
              {step5?.observacionesSuelo || 'Ninguna'}
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
          {step6?.sabeTotalMuros === 'si' ? (
            <Cell label="Cantidad total de muros / Con daños " value={`${step6.totalMuros} / ${step6.murosConDanos}`} colSpan={12} />
          ) : (
            <Cell label="¿Sabe cuántos muros tiene?" value="No" colSpan={12} />
          )}
        </Section>

        {/* 7. EVALUACIÓN FINAL */}
        <Section title="DICTAMEN Y FACTORES CONSIDERADOS" cols={12} className="border-2 border-[#1F3B5F]/20">
          <div className="col-span-8 border-r border-slate-200 p-6 flex flex-col bg-white">
            <span className="text-xs font-black text-[#1F3B5F] uppercase mb-3 tracking-wide">Principales factores que sustentan el dictamen:</span>
            <ul className="list-disc list-outside text-xs space-y-1.5 pl-4 mb-4 text-slate-700 font-medium">
              {factores.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            {olorAGas && (
              <div className="mt-auto bg-red-100 border border-red-500 text-red-800 text-xs font-black p-3 rounded-lg flex items-center justify-center uppercase shadow-sm">
                ALERTA DE SEGURIDAD CRÍTICA: SE REPORTÓ OLOR A GAS
              </div>
            )}
          </div>
          <div className="col-span-4 p-6 flex flex-col justify-center items-center text-center bg-slate-50">
            <span className="text-[10px] font-black uppercase mb-3 tracking-widest text-slate-500">Clasificación de Riesgo Sugerida</span>
            <div className={`w-full py-4 px-2 text-center font-black uppercase text-xl border-[4px] rounded-2xl shadow-sm ${styles.bg} ${styles.border} ${styles.text}`}>
              {color_final}
            </div>
            <span className={`text-xs mt-3 uppercase font-black tracking-widest w-full ${styles.badge} text-white py-2 rounded-lg shadow-md`}>
              {styles.title}
            </span>
            <span className="text-[9px] text-slate-400 mt-3 italic leading-tight">Esta clasificación es preliminar y requiere validación en sitio por un experto.</span>
          </div>
        </Section>

        {/* METODOLOGÍA AVALADA POR */}
        <div className="flex flex-col items-center justify-center mt-4 mb-2 pdf-block">
          <span className="text-[10px] font-black uppercase mb-1 tracking-widest text-slate-500">Metodología avalada por:</span>
          <div className="flex items-center gap-16 justify-center">
            <img src={logoAscolpat} alt="ASCOLPAT" className="h-48 scale-125 translate-y-6 object-contain drop-shadow-sm" />
            <img src={logoUnigranadinos} alt="UNIGRANADINOS" className="h-24 object-contain drop-shadow-sm" />
          </div>
        </div>

        {/* Page break before EVIDENCIA */}
        <div className="html2pdf__page-break"></div>

        {/* 8. EVIDENCIA */}
        <Section title="EVIDENCIA GRÁFICA Y GEORREFERENCIACIÓN" cols={12}>
          <div className="col-span-12 grid grid-cols-1 gap-6 p-6">
            <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center relative p-4 h-96 bg-white overflow-hidden">
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-full z-10 shadow-sm">
                <span className="text-xs font-bold uppercase text-slate-700">Fotografía de Fachada</span>
              </div>
              {step1?.fotoFachadaUrl ? (
                <img src={step1.fotoFachadaUrl} alt="Fachada" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-300">
                  <span className="text-xs font-medium uppercase tracking-widest">No suministrada</span>
                </div>
              )}
            </div>
            <div className="border-2 border-slate-200 rounded-xl flex flex-col items-center justify-center relative p-2 h-96 bg-slate-100 overflow-hidden">
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-full z-20 shadow-sm">
                <span className="text-xs font-bold uppercase text-slate-700">Ubicación GPS</span>
              </div>
              {step1?.latitud && step1?.longitud ? (
                <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden rounded-lg bg-[#AAD3DF]">
                  <StaticTileMap lat={step1.latitud} lon={step1.longitud} zoom={16} />
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-lg text-xs font-black z-30 flex flex-col shadow-lg text-slate-700">
                    <span>LAT: {step1.latitud}</span>
                    <span>LNG: {step1.longitud}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-widest">Sin Coordenadas</span>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* FOOTER */}
        <div className="mt-6 text-center border-t border-slate-200 pt-4 pb-4 pdf-block">
          <span className="text-[10px] text-slate-400 font-medium">Dictamen Generado por morar.ok — Desarrollado por Qatro y Controller.</span>
        </div>
      </div>

    </div>
  );
});
