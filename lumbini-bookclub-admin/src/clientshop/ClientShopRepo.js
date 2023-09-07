import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  startAfter,
  getDoc,
  orderBy,
  limit,
  Timestamp,
  endBefore,
  limitToLast,
} from "firebase/firestore/lite";
import { firebaseAuth, firestore } from "../firebase.config";
import { pageSizeLimit } from "../common/app.config";
const collectionName = "clientShops";

export async function saveClientShop(clientShop) {
  const db = firestore;
  const auth = firebaseAuth;
  const now = Timestamp.now();

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  clientShop["updatedAt"] = now.toMillis();
  clientShop["updatedBy"] = auth.currentUser.email;

  if (clientShop.id) {
    const id = clientShop.id;
    delete clientShop.id;
    await updateDoc(doc(db, collectionName, id), clientShop);
    return { ...clientShop };
  }

  delete clientShop.id;
  clientShop["createdAt"] = now.toMillis();
  clientShop["createdBy"] = auth.currentUser.email;

  const docRef = await addDoc(collection(db, collectionName), clientShop);

  return { ...clientShop, id: docRef.id };
}

export async function getClientShop({ id }) {
  const db = firestore;

  let snapShot = await getDoc(doc(db, collectionName, id));

  if (!snapShot.exists()) {
    throw Error("Client shop not found.");
  }

  return { ...snapShot.data(), id: snapShot.id };
}

export async function deleteClientShop(id) {
  const db = firestore;

  await deleteDoc(doc(db, collectionName, id));
}

export async function getClientShops(q) {
  const db = firestore;
  const constraints = [
    collection(db, collectionName),
    orderBy("createdAt", "desc"),
  ];
  let dataQuery;

  if (q && q.last) {
    let snapShot = await getDoc(doc(db, collectionName, q.last));
    dataQuery = query(
      ...constraints,
      startAfter(snapShot),
      limit(pageSizeLimit + 1)
    );
  } else if (q && q.first) {
    let snapShot = await getDoc(doc(db, collectionName, q.first));
    dataQuery = query(
      ...constraints,
      endBefore(snapShot),
      limitToLast(pageSizeLimit)
    );
  } else {
    dataQuery = query(...constraints, limit(pageSizeLimit + 1));
  }
  const snapShot = await getDocs(dataQuery);
  const docs = snapShot.docs;
  let hasNext = !!q?.first || false;
  let hasPrev = false;

  if (docs.length > 0) {
    const prevQuery = query(...constraints, endBefore(docs[0]), limitToLast(1));
    const prevData = await getDocs(prevQuery);
    hasPrev = !prevData.empty;
  }

  if (!q?.first && docs.length > pageSizeLimit) {
    hasNext = true;
    docs.pop();
  }

  const list = docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return {
    list: list,
    hasPrev: hasPrev,
    hasNext: hasNext,
  };
}
