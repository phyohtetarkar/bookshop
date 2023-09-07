import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore/lite";
import { pageSizeLimit } from "../common/app.config";
import { firestore } from "../common/firebase.config";

const collectionName = "activities";

export async function getActivity(id) {
  const db = firestore;
  let snapShot = await getDoc(doc(db, collectionName, id));

  if (!snapShot.exists()) {
    throw Error("Activity not found.");
  }

  return { ...snapShot.data(), id: snapShot.id };
}

export async function getActivities(q) {
  const db = firestore;
  let dataQuery;

  if (q && q.last) {
    const snapshot = await getDoc(doc(db, collectionName, q.last));

    dataQuery = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc"),
      startAfter(snapshot),
      limit(pageSizeLimit)
    );
  } else {
    dataQuery = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc"),
      limit(pageSizeLimit)
    );
  }
  const activitySnapshot = await getDocs(dataQuery);

  //console.log("get activities");

  return activitySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
}
