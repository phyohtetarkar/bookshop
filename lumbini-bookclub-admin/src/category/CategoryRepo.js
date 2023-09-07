import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
  deleteDoc,
  query,
  limit,
  where,
  orderBy,
} from "firebase/firestore/lite";
import { firebaseAuth, firestore } from "../firebase.config";

const collectionName = "categories";

export async function saveCategory(category) {
  const db = firestore;
  const auth = firebaseAuth;
  const now = Timestamp.now();

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  category["updatedAt"] = now.toMillis();
  category["updatedBy"] = auth.currentUser.email;

  if (category.id) {
    const id = category.id;
    delete category.id;
    await updateDoc(doc(db, collectionName, id), category);
    return { ...category };
  }

  delete category.id;
  category["createdAt"] = now.toMillis();
  category["createdBy"] = auth.currentUser.email;

  const docRef = await addDoc(collection(db, collectionName), category);

  return { ...category, id: docRef.id };
}

export async function getCategory(id) {
  const db = firestore;

  let snapShot = await getDoc(doc(db, collectionName, id));

  return { ...snapShot.data(), id: snapShot.id };
}

export async function deleteCategory(id) {
  const db = firestore;

  const q = query(
    collection(db, "books"),
    where("category", "==", id),
    limit(1)
  );

  const snapShot = await getDocs(q);

  if (!snapShot.empty) {
    throw Error("Category referenced by books.");
  }

  await deleteDoc(doc(db, collectionName, id));
}

export async function getCategories() {
  const db = firestore;
  // let q;

  // if (lastDocumentId) {
  //   let last = await getDoc(doc(db, collectionName, lastDocumentId));
  //   q = query(
  //     collection(db, collectionName),
  //     startAfter(last),
  //     orderBy("createdAt", "desc"),
  //     limit(15)
  //   );
  // } else if (firstDocumentId) {
  //   let first = await getDoc(doc(db, collectionName, firstDocumentId));
  //   q = query(
  //     collection(db, collectionName),
  //     endBefore(first),
  //     orderBy("createdAt", "desc"),
  //     limit(15)
  //   );
  // } else {
  //   q = query(
  //     collection(db, collectionName),
  //     orderBy("createdAt", "desc"),
  //     limit(15)
  //   );
  // }

  const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));

  const snapShot = await getDocs(q);

  return snapShot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
}
