import { collection, getDocs, orderBy, query } from "firebase/firestore/lite";
import { firestore } from "../common/firebase.config";

export async function getCategories() {
  const db = firestore;
  const categorySnapshot = await getDocs(
    query(collection(db, "categories"), orderBy("createdAt", "desc"))
  );

  return categorySnapshot.docs
    .map((doc) => {
      return { id: doc.id, name: doc.data().name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
