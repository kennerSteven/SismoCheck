import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import CryptoJS from 'crypto-js';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

// Leer .env
const envPath = path.resolve('c:/Users/kenne/Desktop/Qatro/SismoCheck/SismoCheck/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valParts] = line.split('=');
  if (key && valParts.length > 0) {
    let val = valParts.join('=').trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    envVars[key.trim()] = val;
  }
});

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TOTAL_USERS = 200;

async function runTest() {
  console.log(`🚀 Iniciando prueba de estrés: ${TOTAL_USERS} escrituras concurrentes a Firestore...`);
  
  const startTime = performance.now();
  let successCount = 0;
  let failCount = 0;
  const latencies = [];

  // Create promises
  const promises = [];
  const createdHashes = [];
  const now = Date.now();
  
  for (let i = 0; i < TOTAL_USERS; i++) {
    const dummyCC = `STRESS_TEST_${now}_${i}`;
    const hashCC = CryptoJS.SHA256(dummyCC).toString(CryptoJS.enc.Hex);
    createdHashes.push(hashCC);
    const userRef = doc(db, 'users', hashCC);
    
    const requestStart = performance.now();
    const p = setDoc(userRef, {
      nombre: `Usuario Prueba ${i}`,
      fechaRegistro: new Date(),
      isTest: true
    })
    .then(() => {
      const duration = performance.now() - requestStart;
      latencies.push(duration);
      successCount++;
    })
    .catch(err => {
      failCount++;
      console.error(`Error en user ${i}:`, err.message);
    });
    
    promises.push(p);
  }

  // Wait for all writes
  await Promise.all(promises);

  const totalTime = performance.now() - startTime;
  
  // Metrics
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length || 0;
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);
  const writesPerSecond = (successCount / (totalTime / 1000)).toFixed(2);

  console.log(`\n✅ PRUEBA FINALIZADA ✅`);
  console.log(`Tiempo total: ${(totalTime/1000).toFixed(2)} segundos`);
  console.log(`Peticiones Exitosas: ${successCount}`);
  console.log(`Peticiones Fallidas: ${failCount}`);
  console.log(`Rendimiento (Escrituras/seg): ${writesPerSecond}`);
  console.log(`Latencia Promedio: ${avgLatency.toFixed(2)} ms`);
  console.log(`Latencia Mínima: ${minLatency.toFixed(2)} ms`);
  console.log(`Latencia Máxima: ${maxLatency.toFixed(2)} ms`);
  
  console.log('\n🧹 Limpiando datos de prueba...');
  const cleanupPromises = createdHashes.map(hash => deleteDoc(doc(db, 'users', hash)));
  await Promise.all(cleanupPromises);
  console.log('✅ Base de datos limpia de registros de prueba.');
  
  process.exit(0);
}

runTest();
