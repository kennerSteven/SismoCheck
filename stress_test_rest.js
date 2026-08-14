import fs from 'fs';
import path from 'path';

// --- 1. LEER VARIABLES DE ENTORNO ---
const envPath = path.resolve('./.env');
const envFile = fs.readFileSync(envPath, 'utf-8');

const getEnvVar = (key) => {
  const match = envFile.match(new RegExp(`${key}="(.*?)"`)) || envFile.match(new RegExp(`${key}=(.*)`));
  return match ? match[1] : null;
};

const API_KEY = getEnvVar('VITE_FIREBASE_API_KEY');
const PROJECT_ID = getEnvVar('VITE_FIREBASE_PROJECT_ID');
const COLLECTION = 'evaluaciones_test_rest'; // Usamos otra colección para no ensuciar la real

const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?key=${API_KEY}`;

// --- 2. CONFIGURACIÓN DEL TEST ---
const TOTAL_USERS = 300;

// Payload formateado para Firestore REST API
const createPayload = (index) => {
  return {
    fields: {
      timestamp: { timestampValue: new Date().toISOString() },
      cedulaDiligenciador: { stringValue: `REST_${9990000 + index}` },
      nombreDiligenciador: { stringValue: `Usuario REST ${index}` },
      telefonoDiligenciador: { stringValue: `300${1000000 + index}` },
      color_final: { stringValue: 'AMARILLO' },
      origen: { stringValue: 'stress_test_rest_api' }
    }
  };
};

// --- 3. EJECUTAR PRUEBA ---
async function runRestTest() {
  console.log(`🚀 Iniciando Stress Test usando API REST pura (Sin Firebase SDK)`);
  console.log(`👥 Simulando ${TOTAL_USERS} usuarios concurrentes...`);
  
  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;

  // Creamos un array de promesas de fetch
  const requests = [];
  for (let i = 0; i < TOTAL_USERS; i++) {
    const req = fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createPayload(i))
    })
    .then(async (res) => {
      if (res.ok) {
        successCount++;
        // Extraemos el ID del documento creado para luego borrarlo
        const data = await res.json();
        return data.name; // Ej: projects/sismocheck-a7728/databases/(default)/documents/evaluaciones_test_rest/12345
      } else {
        const errorText = await res.text();
        if (failCount === 0) console.log('Error de ejemplo:', errorText);
        failCount++;
        return null;
      }
    })
    .catch(() => {
      failCount++;
      return null;
    });

    requests.push(req);
  }

  console.log(`📡 Peticiones disparadas al instante. Esperando respuestas de los servidores de Google...`);

  // Esperamos que TODAS terminen al mismo tiempo
  const documentNames = await Promise.all(requests);
  const endTime = Date.now();

  const totalTime = ((endTime - startTime) / 1000).toFixed(2);
  const avgTime = (totalTime / TOTAL_USERS).toFixed(3);

  console.log(`\n======================================================`);
  console.log(`✅ TEST REST COMPLETADO EN ${totalTime} SEGUNDOS`);
  console.log(`======================================================`);
  console.log(`✔️  Éxitos: ${successCount}`);
  console.log(`❌  Fallos: ${failCount}`);
  console.log(`⏱️  Tiempo promedio por usuario: ${avgTime} segundos`);
  console.log(`======================================================\n`);

  // --- 4. LIMPIEZA ---
  console.log(`🧹 Limpiando los ${successCount} documentos de prueba creados...`);
  const validDocs = documentNames.filter(name => name !== null);
  
  const deleteRequests = validDocs.map(docName => {
    return fetch(`https://firestore.googleapis.com/v1/${docName}?key=${API_KEY}`, {
      method: 'DELETE'
    });
  });

  await Promise.all(deleteRequests);
  console.log(`✨ Limpieza completada. La colección ${COLLECTION} está limpia.`);
}

runRestTest();
