import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore/lite";
import { firestore } from "../common/firebase.config";

const collectionName = "orders";

export async function getOrder(orderNumber) {
  const db = firestore;

  const q = query(
    collection(db, collectionName),
    where("orderNumber", "==", orderNumber),
    limit(1)
  );

  const snapShot = await getDocs(q);

  if (snapShot.empty) {
    throw Error("No order found.");
  }
  const doc = snapShot.docs[0];

  return { ...doc.data(), id: doc.id };
}
