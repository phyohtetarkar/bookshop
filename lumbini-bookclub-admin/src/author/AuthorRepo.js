import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { firebaseAuth, firestore } from "../firebase.config";

const collectionName = "authors";

export async function saveAuthor(author) {
  const db = firestore;
  const auth = firebaseAuth;
  const now = Timestamp.now();

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  author["updatedAt"] = now.toMillis();
  author["updatedBy"] = auth.currentUser.email;

  if (author.id) {
    const id = author.id;
    delete author.id;
    await updateDoc(doc(db, collectionName, id), author);
    return { ...author };
  }

  delete author.id;
  author["createdAt"] = now.toMillis();
  author["createdBy"] = auth.currentUser.email;

  const docRef = await addDoc(collection(db, collectionName), author);

  return { ...author, id: docRef.id };
}

export async function getAuthor(id) {
  const db = firestore;

  let snapShot = await getDoc(doc(db, collectionName, id));

  return { ...snapShot.data(), id: snapShot.id };
}

export async function deleteAuthor(id) {
  const db = firestore;

  const q = query(collection(db, "books"), where("author", "==", id), limit(1));

  const snapShot = await getDocs(q);

  if (!snapShot.empty) {
    throw Error("Author referenced by books.");
  }

  await deleteDoc(doc(db, collectionName, id));
}

export async function getAuthors() {
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
