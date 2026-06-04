import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ──────────────────────────────────────
//  PROJECTS COLLECTION HELPERS
// ──────────────────────────────────────
const projectsCol = collection(db, "projects");

export async function getProjects() {
  const q = query(projectsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addProject(data) {
  return addDoc(projectsCol, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateProject(id, data) {
  const ref = doc(db, "projects", id);
  return updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProject(id) {
  const ref = doc(db, "projects", id);
  return deleteDoc(ref);
}

// ──────────────────────────────────────
//  CONTACTS COLLECTION HELPERS
// ──────────────────────────────────────
const contactsCol = collection(db, "contacts");

export async function getContacts() {
  const q = query(contactsCol, orderBy("timestamp", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addContact(data) {
  return addDoc(contactsCol, {
    ...data,
    timestamp: serverTimestamp(),
    read: false,
  });
}

export async function markContactRead(id, read = true) {
  const ref = doc(db, "contacts", id);
  return updateDoc(ref, { read });
}

export async function deleteContact(id) {
  const ref = doc(db, "contacts", id);
  return deleteDoc(ref);
}

// ──────────────────────────────────────
//  CLOUDINARY UPLOAD HELPER
// ──────────────────────────────────────
export async function uploadToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.secure_url;
}
