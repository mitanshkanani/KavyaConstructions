import db from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export const updateFormData = async (payloadData) => {
  const collectionRef = doc(db, "FormData", `${payloadData?.id}`);
  await updateDoc(collectionRef, payloadData);
  return { status: 200 };
};

export const updateRateData = async (payloadData) => {
  const collectionRef = doc(db, "Rates", `${payloadData?.id}`);
  await updateDoc(collectionRef, payloadData);
  return { status: 200 };
};
