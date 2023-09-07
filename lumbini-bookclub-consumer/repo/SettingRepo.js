import { doc, getDoc } from "firebase/firestore/lite";
import { firestore } from "../common/firebase.config";

const collectionName = "settings";
const generalDocId = "generalSetting";
const orderDocId = "orderSetting";

async function getGeneralSetting() {
  const db = firestore;
  let snapShot = await getDoc(doc(db, collectionName, generalDocId));

  return { ...snapShot.data() };
}

async function getOrderSetting() {
  const db = firestore;
  let snapShot = await getDoc(doc(db, collectionName, orderDocId));

  return { ...snapShot.data() };
}

export async function getTermsAndConditions() {
  const data = await getGeneralSetting();
  return data.termsAndConditions;
}

export async function getAboutUs() {
  const data = await getGeneralSetting();
  return data.aboutUs;
}

export async function getPayments() {
  const data = await getOrderSetting();
  return data.payments;
}

export async function getSiteSetting() {
  const orderSetting = await getOrderSetting();
  const generalSetting = await getGeneralSetting();
  const minimumOrderLimit = orderSetting.minimumOrderLimitPerProduct ?? 6;

  return {
    minimumOrderLimit: minimumOrderLimit,
    payments: orderSetting.payments,
    general: {
      contact: generalSetting.contact,
      appStoreUrl: generalSetting.appStoreUrl,
      playStoreUrl: generalSetting.playStoreUrl,
      socialMedias: generalSetting.socialMedias,
    },
  };
}
