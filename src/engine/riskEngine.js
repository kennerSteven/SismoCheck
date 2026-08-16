/**
 * Motor de Clasificación de Riesgo y Habitabilidad
 * Implementación pura, determinista y basada en reglas con mínimo forzado.
 */

/**
 * @typedef {0 | 1 | 2 | 3} Color
 */
export const VERDE = 0;
export const AMARILLO = 1;
export const NARANJA = 2;
export const ROJO = 3;

/**
 * Operación global de escalamiento.
 * Garantiza que nunca se baje un nivel de severidad ya asignado.
 * @param {Color} a 
 * @param {Color} b 
 * @returns {Color}
 */
export function peor(a, b) {
  return Math.max(a, b);
}

/**
 * Clasificación individual de una fisura.
 * @param {Object} f 
 * @param {string} f.elemento 'Columna' | 'Viga' | 'Muro' | 'Escaleras' | 'Piso' | 'Techo'
 * @param {string} f.tamano 'w1' | 'w2' | 'w3' | 'w4' | 'w5'
 * @param {string} f.evolucion 'no_sabe' | 'igual' | 'lento' | 'notorio'
 * @param {string|null} f.aceros 'Sí' | 'No' | 'No sabe' | null
 * @param {string|null} f.sonido 'Sí' | 'No' | 'No sabe' | null
 * @param {string} sistema
 * @returns {Color}
 */
export function clasificarFisura(f, sistema) {
  // 1. Corte temprano (Daño superficial / fisuras muy pequeñas)
  // Aplica para TODOS los sistemas constructivos sin importar evolución
  if (f.tamano === 'w1' || f.tamano === 'w2') {
    return VERDE;
  }

  // 2. Valor Base para fisuras más grandes
  let color = AMARILLO;

  // 2. Evolución
  if (f.evolucion === 'notorio') {
    color = peor(color, NARANJA);
  }

  // 3. Reglas de Escalamiento (R1 a R9)

  // R1
  if (['Columna', 'Viga', 'Techo', 'Piso'].includes(f.elemento) && ['mamp_confinada', 'otro'].includes(sistema)) {
    color = peor(color, NARANJA);
    if (f.evolucion === 'notorio') {
      color = peor(color, ROJO);
    }
  }

  // R2
  if (f.elemento === 'Muro' && ['mamp_estructural', 'muros_carga_concreto', 'mamp_no_reforzada'].includes(sistema)) {
    color = peor(color, NARANJA);
  }

  // R3
  if (f.elemento === 'Muro' && sistema === 'tradicional') {
    if (f.tamano === 'w4') color = peor(color, NARANJA);
    if (f.tamano === 'w5') color = peor(color, ROJO);
  }

  // R4 / R6 / R7
  const cond467 = (
    (['palafitica', 'madera_pesada', 'tradicional'].includes(sistema) && ['Columna', 'Viga'].includes(f.elemento)) ||
    (sistema === 'estructura_metalica' && ['Columna', 'Viga'].includes(f.elemento)) ||
    (sistema === 'prefab' && f.elemento === 'Muro')
  );
  if (cond467) {
    if (f.tamano === 'w4') color = peor(color, NARANJA);
    if (f.tamano === 'w5') color = peor(color, ROJO);
  }

  // R5
  if (f.sonido === 'Sí') {
    color = peor(color, NARANJA);
    if (f.evolucion === 'notorio') {
      color = peor(color, ROJO);
    }
  }

  // R8
  if (f.elemento === 'Escaleras' && ['w4', 'w5'].includes(f.tamano)) {
    color = peor(color, AMARILLO); // redundante matemáticamente pero fiel a la regla
    if (['lento', 'notorio'].includes(f.evolucion)) {
      color = peor(color, ROJO);
    }
  }

  // R9
  if (['Columna', 'Viga', 'Muro'].includes(f.elemento) && ['w4', 'w5'].includes(f.tamano)) {
    if (f.aceros === 'Sí' && f.corrosion === 'Sí') {
      color = peor(color, ROJO);
    }
  }

  return color;
}

/**
 * Puntaje y Clasificación Agregada
 * @param {Object} fichaCompleta
 * @returns {{ color_final: Color, puntaje_total: number, peorFisura: Color }}
 */
export function calcularValoracion(fichaCompleta) {
  const { sistema, fisuras = [], asentamiento = {}, suelo = {}, elementosNoEstructurales = {} } = fichaCompleta;

  let minForzado = VERDE;
  let peorFisura = VERDE;

  // 1. Puntaje por Fisuras
  let score_fisuras = 0;
  const puntosFisura = { [VERDE]: 0, [AMARILLO]: 2, [NARANJA]: 5, [ROJO]: 10 };

  for (const f of fisuras) {
    const col = clasificarFisura(f, sistema);
    score_fisuras += puntosFisura[col];
    peorFisura = peor(peorFisura, col);
  }

  if (peorFisura === ROJO || peorFisura === NARANJA) {
    minForzado = peor(minForzado, peorFisura);
  }

  // 2. Puntaje por Asentamiento e Inclinación
  let score_asentamiento = 0;
  const asenPesos = { uniforme: 2, diferencial: 4, inclinacion: 6, localizado: 4 };

  for (const [key, peso] of Object.entries(asenPesos)) {
    const resp = asentamiento[key];
    if (resp === 'Sí') {
      score_asentamiento += peso;
      if (key === 'inclinacion') {
        minForzado = peor(minForzado, NARANJA);
      }
    } else if (resp === 'No sabe') {
      score_asentamiento += 1;
    }
  }

  // 3. Puntaje por Evaluación del Suelo
  let score_suelo = 0;
  const graves = ['deslizamiento', 'caida_rocas', 'licuefaccion', 'cimentacion_expuesta'];
  for (const item of graves) {
    const resp = suelo[item];
    if (resp === 'Sí') {
      score_suelo += 6;
      minForzado = peor(minForzado, NARANJA);
    } else if (resp === 'No sabe') {
      score_suelo += 1;
    }
  }

  // 4. Puntaje por Elementos No Estructurales
  let score_elementos = 0;
  const elementosPesos = {
    fachadas: 1,
    instalaciones: 1,
    cubiertas: 1,
    puertas_ventanas: 0.5,
    pisos_cielorrasos: 0.5,
    muros_interiores: 0.5
  };

  for (const [grupo, peso] of Object.entries(elementosPesos)) {
    let hallazgos = elementosNoEstructurales[grupo] || [];
    // Filtrar "Sin daños aparentes" para que no cuente como un hallazgo negativo
    hallazgos = hallazgos.filter(h => h !== 'Sin daños aparentes');
    
    score_elementos += peso * hallazgos.length;

    // Reglas especiales de seguridad
    if (grupo === 'instalaciones' && hallazgos.includes('Olor a gas')) {
      minForzado = peor(minForzado, NARANJA);
    }
    if (grupo === 'cubiertas' && hallazgos.includes('Colapso (desprendimiento total)')) {
      minForzado = peor(minForzado, NARANJA);
    }
  }

  // 5. Subtotal, Bono y Color Base (Función Escalonada)
  const score_parcial = score_fisuras + score_asentamiento + score_suelo + score_elementos;
  let bono = 0;
  
  if (['mamp_no_reforzada', 'tradicional'].includes(sistema) && score_parcial >= 6) {
    bono = 2;
  }

  const score_total = score_parcial + bono;
  
  let color_base = VERDE;
  if (score_total >= 4 && score_total <= 8) {
    color_base = AMARILLO;
  } else if (score_total >= 9 && score_total <= 15) {
    color_base = NARANJA;
  } else if (score_total > 15) {
    color_base = ROJO;
  }

  // 6. Cálculo del Color Final
  const color_final = peor(color_base, minForzado);

  return {
    color_final,
    puntaje_total: score_total,
    peorFisura // Opcional, incluido para trazabilidad
  };
}

export const getColorStyles = (colorId) => {
  switch (colorId) {
    case VERDE:
      return { 
        bg: 'bg-emerald-50', border: 'border-emerald-600', text: 'text-emerald-900', badge: 'bg-emerald-500', 
        title: 'VERDE — Desempeño bueno', subtitle: 'HABITABLE',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300', colorName: 'VERDE'
      };
    case AMARILLO:
      return { 
        bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-900', badge: 'bg-amber-400', 
        title: 'AMARILLO — Habitable con seguimiento', subtitle: 'REGULAR',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300', colorName: 'AMARILLO'
      };
    case NARANJA:
      return { 
        bg: 'bg-orange-50', border: 'border-orange-600', text: 'text-orange-900', badge: 'bg-orange-500', 
        title: 'NARANJA — No habitable hasta revisión', subtitle: 'MALO',
        badgeClass: 'bg-orange-100 text-orange-800 border-amber-300', colorName: 'NARANJA'
      };
    case ROJO:
      return { 
        bg: 'bg-red-100', border: 'border-red-600', text: 'text-red-900', badge: 'bg-red-600', 
        title: 'ROJO — Riesgo de colapso', subtitle: 'NO HABITABLE',
        badgeClass: 'bg-red-100 text-red-800 border-red-300', colorName: 'ROJO'
      };
    default:
      return { 
        bg: 'bg-slate-50', border: 'border-slate-400', text: 'text-slate-800', badge: 'bg-slate-500', 
        title: 'SIN CLASIFICAR — No evaluado', subtitle: 'DESCONOCIDO',
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-300', colorName: 'GRIS'
      };
  }
};

export const getRecomendacionFisura = (color) => {
  switch (color) {
    case VERDE: return "Daño leve. Monitorear periódicamente.";
    case AMARILLO: return "Daño moderado. Requiere seguimiento de su evolución y evaluación profesional si aumenta.";
    case NARANJA: return "Daño severo. Se requiere evaluación estructural inmediata por un ingeniero calificado.";
    case ROJO: return "Daño crítico. Peligro de colapso. Restrinja el acceso y contacte a las autoridades.";
    default: return "";
  }
};

export const getFisuraLabel = (id) => {
  const map = {
    'w1': 'No entra nada (< 1mm)',
    'w2': 'Borde de una uña (1-2mm)',
    'w3': 'Mina de un lápiz (2-5mm)',
    'w4': 'Dedo meñique completo (0.5-2cm)',
    'w5': 'Caben tres dedos juntos (> 3cm)',
    'no_sabe': 'No sabe',
    'igual': 'Sigue igual',
    'lento': 'Aumentó lento',
    'notorio': 'Aumentó notorio'
  };
  return map[id] || id;
};
