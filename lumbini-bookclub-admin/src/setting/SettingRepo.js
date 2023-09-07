import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore/lite";
import { firebaseAuth, firestore } from "../firebase.config";

const collectionName = "settings";
const generalDocId = "generalSetting";
const productDocId = "productSetting";
const orderDocId = "orderSetting";

export async function saveGeneralSetting(generalSetting) {
  const db = firestore;
  const auth = firebaseAuth;
  const now = Timestamp.now();

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  generalSetting["updatedAt"] = now.toMillis();
  generalSetting["updatedBy"] = auth.currentUser.email;

  await updateDoc(doc(db, collectionName, generalDocId), generalSetting);
  return { ...generalSetting };
}

export async function saveProductSetting(productSetting) {
  const db = firestore;
  const auth = firebaseAuth;
  const now = Timestamp.now();

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  productSetting["updatedAt"] = now.toMillis();
  productSetting["updatedBy"] = auth.currentUser.email;

  await updateDoc(doc(db, collectionName, productDocId), productSetting);
  return { ...productSetting };
}

export async function saveOrderSetting(orderSetting) {
  const db = firestore;
  const auth = firebaseAuth;
  const now = Timestamp.now();

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  orderSetting["updatedAt"] = now.toMillis();
  orderSetting["updatedBy"] = auth.currentUser.email;

  await updateDoc(doc(db, collectionName, orderDocId), orderSetting);
  return { ...orderSetting };
}

export async function getGeneralSetting() {
  const db = firestore;

  let snapShot = await getDoc(doc(db, collectionName, generalDocId));

  return { ...snapShot.data() };
}

export async function getProductSetting() {
  const db = firestore;

  let snapShot = await getDoc(doc(db, collectionName, productDocId));

  return { ...snapShot.data() };
}

export async function getOrderSetting() {
  const db = firestore;

  let snapShot = await getDoc(doc(db, collectionName, orderDocId));

  return { ...snapShot.data() };
}
