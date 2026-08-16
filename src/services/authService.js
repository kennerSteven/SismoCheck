import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../config/firebaseConfig';

let isAuthenticating = false; 

export const loginWithCedula = async (cedula) => {
  if (isAuthenticating) {
    return null;
  }
  
  isAuthenticating = true;
  const syntheticEmail = `${cedula}@sismocheck.local`;
  const syntheticPassword = `SismoCheck_${cedula}`;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, syntheticEmail, syntheticPassword);
    const token = await userCredential.user.getIdToken(true);
    return { user: userCredential.user, token };
  } catch (error) {
    throw error;
  } finally {
    isAuthenticating = false;
  }
};

export const registerWithCedula = async (nombre, cedula) => {
  if (isAuthenticating) return null;
  
  isAuthenticating = true;
  const syntheticEmail = `${cedula}@sismocheck.local`;
  const syntheticPassword = `SismoCheck_${cedula}`;

  try {
    // 1. Crear el usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, syntheticEmail, syntheticPassword);
    
    // 2. Guardar Nombre y Cédula reales en la Base de Datos (Firestore)
    await setDoc(doc(db, "usuarios", userCredential.user.uid), {
      nombre: nombre,
      cedula: cedula,
      rol: "inspector",
      createdAt: new Date().toISOString()
    });

    const token = await userCredential.user.getIdToken(true);
    return { user: userCredential.user, token };
  } catch (error) {
    throw error;
  } finally {
    isAuthenticating = false;
  }
};

export const loginWithGoogle = async () => {
  if (isAuthenticating) return null;
  
  isAuthenticating = true;
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken(true);
    return { user: userCredential.user, token };
  } catch (error) {
    throw error;
  } finally {
    isAuthenticating = false;
  }
};

export const logout = async () => {
  await auth.signOut();
};
