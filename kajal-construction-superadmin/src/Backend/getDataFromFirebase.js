import db from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getSiteLocation = async () => {
  const locationRef = query(collection(db, "SiteData"));
  const siteLocationArray = [];
  try {
    const querySnapshot = await getDocs(locationRef);
    querySnapshot.forEach((doc) => {
      siteLocationArray.push(doc?.data()?.name);
    });
  } catch (error) {
    console.log(error);
  }

  return siteLocationArray;
};

export const getFormData = async (
  startDate,
  endDate,
  companyName,
  selectedVendor
) => {
  const data = [];
  const formRef = collection(db, "FormData");
  let dataRef = query(
    formRef,
    where("deliveryTime", ">=", startDate),
    where("deliveryTime", "<=", addDay(endDate))
  );

  if (companyName) {
    dataRef = query(dataRef, where("unloadedAt", "==", companyName));
  }

  if (selectedVendor) {
    dataRef = query(dataRef, where("vendorName", "==", selectedVendor));
  }

  try {
    const querySnapshot = await getDocs(dataRef);
    querySnapshot.forEach((doc) => {
      data.push(doc?.data());
    });
  } catch (error) {
    console.log(error);
  }
  return data;
};

export const getSupervisors = async () => {
  const supervisorRef = query(collection(db, "LoginPhones"));
  const supervisors = [];
  try {
    const querySnapshot = await getDocs(supervisorRef);
    querySnapshot.forEach((doc) => {
      const {
        name,
        phoneNumber: phone,
        SiteLocation: siteLocation,
      } = doc?.data();
      supervisors.push({ name, phone, siteLocation, id: doc.id });
    });
  } catch (error) {
    console.log(error);
  }

  return supervisors;
};

export const getVendors = async () => {
  const Ref = query(collection(db, "VendorData"));
  const data = [];
  try {
    const querySnapshot = await getDocs(Ref);
    querySnapshot.forEach((doc) => {
      data.push({ ...doc?.data(), id: doc.id });
    });
  } catch (error) {
    console.log(error);
  }

  return data;
};

export const getMaterials = async () => {
  const Ref = query(collection(db, "MaterialData"));
  const data = [];
  try {
    const querySnapshot = await getDocs(Ref);
    querySnapshot.forEach((doc) => {
      data.push(doc?.data());
    });
  } catch (error) {
    console.log(error);
  }

  return data;
};

export const getSites = async () => {
  const Ref = query(collection(db, "SiteData"));
  const data = [];
  try {
    const querySnapshot = await getDocs(Ref);
    querySnapshot.forEach((doc) => {
      data.push(doc?.data());
    });
  } catch (error) {
    console.log(error);
  }

  return data;
};

function addDay(inputDate) {
  let date = new Date(inputDate);
  date.setDate(date.getDate() + 1);
  return date;
}
