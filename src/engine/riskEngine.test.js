import assert from 'assert';
import {
  VERDE,
  AMARILLO,
  NARANJA,
  ROJO,
  peor,
  clasificarFisura,
  calcularValoracion
} from './riskEngine.js';

function runTests() {
  console.log('Iniciando pruebas del Motor de Clasificación...');

  // 1. Prueba de la función peor()
  assert.strictEqual(peor(VERDE, NARANJA), NARANJA, 'peor(0, 2) debe ser 2');
  assert.strictEqual(peor(ROJO, AMARILLO), ROJO, 'peor(3, 1) debe ser 3');
  assert.strictEqual(peor(VERDE, VERDE), VERDE, 'peor(0, 0) debe ser 0');

  // 2. Pruebas de clasificarFisura
  // Caso Base: w1 o w2 -> VERDE
  assert.strictEqual(
    clasificarFisura({ elemento: 'Muro', tamano: 'w1', evolucion: 'lento' }, 'tradicional'),
    VERDE,
    'Fisura w1 debe ser VERDE'
  );

  // Valor de partida y escalamiento notorio
  assert.strictEqual(
    clasificarFisura({ elemento: 'Piso', tamano: 'w3', evolucion: 'igual' }, 'estructura_metalica'),
    AMARILLO,
    'Fisura w3 sin reglas especiales debe ser AMARILLO'
  );
  assert.strictEqual(
    clasificarFisura({ elemento: 'Piso', tamano: 'w3', evolucion: 'notorio' }, 'estructura_metalica'),
    NARANJA,
    'Fisura w3 con evolucion notoria debe escalar a NARANJA'
  );

  // Regla R9: Acero + Corrosion en fisura severa
  assert.strictEqual(
    clasificarFisura({
      elemento: 'Columna',
      tamano: 'w4',
      evolucion: 'lento',
      aceros: 'Sí',
      corrosion: 'Sí'
    }, 'mamp_confinada'),
    ROJO,
    'Fisura w4 en Columna con aceros y corrosion expuestos debe ser ROJO'
  );

  // 3. Pruebas de calcularValoracion y minForzado

  // Caso: Ficha con puntaje bajísimo pero con inclinación severa
  // Score esperado: Asentamiento inclinacion=Sí (6 pts). Score total = 6 -> AMARILLO
  // Pero Inclinacion fuerza NARANJA.
  const fichaBajaPuntajeCritica = {
    sistema: 'prefab',
    fisuras: [],
    asentamiento: {
      uniforme: 'No',
      diferencial: 'No',
      inclinacion: 'Sí', // fuerza NARANJA
      localizado: 'No'
    },
    suelo: {
      deslizamiento: 'No',
      caida_rocas: 'No',
      licuefaccion: 'No',
      cimentacion_expuesta: 'No'
    },
    elementosNoEstructurales: {}
  };

  const resultado1 = calcularValoracion(fichaBajaPuntajeCritica);
  assert.strictEqual(resultado1.puntaje_total, 6, 'Puntaje total debe ser 6');
  assert.strictEqual(resultado1.color_final, NARANJA, 'Mínimo forzado de inclinación debe elevar de AMARILLO a NARANJA');

  // Caso: Riesgo Inminente (Deslizamiento)
  // Score: Deslizamiento=Sí (6 pts). Score total = 6 -> AMARILLO.
  // Deslizamiento fuerza NARANJA.
  const fichaDeslizamiento = {
    sistema: 'mamp_estructural',
    fisuras: [],
    asentamiento: {},
    suelo: { deslizamiento: 'Sí' }, // +6 y fuerza NARANJA
    elementosNoEstructurales: {}
  };
  const resultado2 = calcularValoracion(fichaDeslizamiento);
  assert.strictEqual(resultado2.puntaje_total, 6);
  assert.strictEqual(resultado2.color_final, NARANJA, 'Deslizamiento debe forzar color final a NARANJA');

  // Caso: Fallas severas de ingeniería (Fisura ROJA forzando color final a pesar de bajo score global)
  // Score: Fisura w4 con aceros y corrosión = ROJO -> minForzado = ROJO. Score fisura = 10 pts.
  // Score total = 10 -> NARANJA.
  // Pero minForzado es ROJO.
  const fichaFisuraRoja = {
    sistema: 'mamp_confinada',
    fisuras: [
      {
        elemento: 'Columna',
        tamano: 'w4',
        evolucion: 'igual',
        aceros: 'Sí',
        corrosion: 'Sí'
      }
    ],
    asentamiento: {},
    suelo: {},
    elementosNoEstructurales: {}
  };
  const resultado3 = calcularValoracion(fichaFisuraRoja);
  assert.strictEqual(resultado3.puntaje_total, 10, 'Puntaje total debe ser 10');
  assert.strictEqual(resultado3.color_final, ROJO, 'Fisura ROJA debe forzar el color final a ROJO');

  // Caso: Elementos no estructurales peligrosos (Olor a gas)
  // Score: 1 hallazgo instalaciones = 1 pts -> VERDE.
  // Olor a gas fuerza NARANJA.
  const fichaGas = {
    sistema: 'tradicional',
    fisuras: [],
    asentamiento: {},
    suelo: {},
    elementosNoEstructurales: {
      instalaciones: ['Olor a gas']
    }
  };
  const resultado4 = calcularValoracion(fichaGas);
  assert.strictEqual(resultado4.puntaje_total, 1, 'Puntaje total debe ser 1');
  assert.strictEqual(resultado4.color_final, NARANJA, 'Olor a gas debe forzar color final a NARANJA');

  // Caso: Ficha sin problemas (Verde absoluto)
  const fichaSana = {
    sistema: 'estructura_metalica',
    fisuras: [
      { elemento: 'Muro', tamano: 'w1', evolucion: 'no_sabe' } // VERDE (0 pts)
    ],
    asentamiento: { uniforme: 'No' },
    suelo: { caida_rocas: 'No' },
    elementosNoEstructurales: {
      fachadas: ['Manchas de humedad'] // 1 pt
    }
  };
  const resultado5 = calcularValoracion(fichaSana);
  assert.strictEqual(resultado5.puntaje_total, 1, 'Puntaje total debe ser 1');
  assert.strictEqual(resultado5.color_final, VERDE, 'Edificación sana debe resultar en VERDE');

  // Caso: Aplicación de Bono de Vulnerabilidad
  // Sistema: mamp_no_reforzada o tradicional
  // Score parcial = 6 (por ej: Inclinacion = Sí)
  // Como score_parcial >= 6, bono = 2 -> Total = 8 -> AMARILLO.
  // Inclinacion fuerza NARANJA.
  const fichaBono = {
    sistema: 'mamp_no_reforzada',
    fisuras: [],
    asentamiento: { inclinacion: 'Sí' }, // +6 pts
    suelo: {},
    elementosNoEstructurales: {}
  };
  const resultado6 = calcularValoracion(fichaBono);
  assert.strictEqual(resultado6.puntaje_total, 8, 'El puntaje (6) + bono (2) debe ser 8');
  assert.strictEqual(resultado6.color_final, NARANJA, 'Color base es AMARILLO pero minForzado es NARANJA');

  console.log('✅ Todas las pruebas unitarias y casos simulados han pasado con éxito.');
}

runTests();
