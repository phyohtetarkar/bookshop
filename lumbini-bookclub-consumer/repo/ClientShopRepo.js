import {
  collection,
  doc,
  getDocs,
  getDoc,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore/lite";
import { pageSizeLimit } from "../common/app.config";
import { firestore } from "../common/firebase.config";

const collectionName = "clientShops";

export async function getClientShops(q) {
  const db = firestore;
  const constraints = [
    collection(db, collectionName),
    orderBy("createdAt", "desc"),
  ];
  let dataQuery;

  if (q && q.last) {
    const snapShot = await getDoc(doc(db, collectionName, q.last));

    dataQuery = query(
      ...constraints,
      startAfter(snapShot),
      limit(pageSizeLimit)
    );
  } else {
    dataQuery = query(...constraints, limit(pageSizeLimit));
  }

  const snapShot = await getDocs(dataQuery);

  //console.log("get clientshops");

  return snapShot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
}
