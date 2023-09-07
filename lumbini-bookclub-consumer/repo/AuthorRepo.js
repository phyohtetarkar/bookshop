import { collection, getDocs, orderBy, query } from "firebase/firestore/lite";
import { firestore } from "../common/firebase.config";

export async function getAuthors() {
  const db = firestore;
  const authorSnapshot = await getDocs(
    query(collection(db, "authors"), orderBy("createdAt", "desc"))
  );

  return authorSnapshot.docs
    .map((doc) => {
      return { id: doc.id, name: doc.data().name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
