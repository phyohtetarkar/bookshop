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
import { ref, uploadBytes, deleteObject } from "firebase/storage";
import { pageSizeLimit } from "../common/app.config";
import { getFileExtension } from "../common/utils";
import { firebaseAuth, firestore, storage } from "../firebase.config";
const collectionName = "activities";

export async function saveActivity(activity) {
  const db = firestore;
  const auth = firebaseAuth;
  const now = Timestamp.now();
  const file = activity.file;
  const oldCover = activity.cover;
  delete activity.file;

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  if (file) {
    const fileName = `${Timestamp.now().toMillis()}${getFileExtension(
      file.name
    )}`;
    const imageRef = ref(storage, `activities/${fileName}`);
    await uploadBytes(imageRef, file);

    activity["cover"] = fileName;
  }

  try {
    if (file && oldCover && oldCover.trim().length > 0) {
      const imageRef = ref(storage, `activities/${oldCover}`);
      await deleteObject(imageRef);
    }
  } catch (e) {
    console.log("Failed to delete image");
  }

  activity["updatedAt"] = now.toMillis();
  activity["updatedBy"] = auth.currentUser.email;

  if (activity.id) {
    const id = activity.id;
    delete activity.id;

    await updateDoc(doc(db, collectionName, id), activity);
    return { ...activity };
  }

  delete activity.id;
  activity["createdAt"] = now.toMillis();
  activity["createdBy"] = auth.currentUser.email;
  const docRef = await addDoc(collection(db, collectionName), activity);

  return { ...activity, id: docRef.id };
}

export async function getActivity({ id }) {
  const db = firestore;
  let snapShot = await getDoc(doc(db, collectionName, id));

  if (!snapShot.exists()) {
    throw Error("Activity not found.");
  }

  return { ...snapShot.data(), id: snapShot.id };
}

export async function deleteActivity(id) {
  const db = firestore;
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  const cover = snapshot.data().cover;

  await deleteDoc(docRef);

  try {
    if (cover && cover.trim().length > 0) {
      await deleteObject(ref(storage, `activities/${cover}`));
    }
  } catch (e) {
    console.log("Failed to delete cover: ", e);
  }
}

export async function getActivities(q) {
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
