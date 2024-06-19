import db from "../firebase";
import { doc, setDoc, collection } from "firebase/firestore";

export const addFormData = async (payloadData) => {
  const docRef = doc(collection(db, "FormData"));
  await setDoc(docRef, { ...payloadData, id: docRef.id, docID: docRef.id });
  return { status: 200 };
};

export const addRateData = async (payloadData) => {
  const docRef = doc(collection(db, "Rates"));
  await setDoc(docRef, { ...payloadData, id: docRef.id });
  return { status: 200 };
};
