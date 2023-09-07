import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  Timestamp,
} from "firebase/firestore/lite";
import { pageSizeLimit } from "../common/app.config";
import { firebaseAuth, firestore } from "../firebase.config";

const collectionName = "notifications";

export async function saveNotification(notification) {
  const db = firestore;
  const auth = firebaseAuth;
  const now = Timestamp.now();

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  delete notification.id;
  notification["createdAt"] = now.toMillis();
  notification["createdBy"] = auth.currentUser.email;

  const docRef = await addDoc(collection(db, collectionName), notification);

  await sendFCMNotification({
    title: notification.title,
    description: notification.description,
  });

  return { ...notification, id: docRef.id };
}

export async function deleteNotification(id) {
  const db = firestore;

  await deleteDoc(doc(db, collectionName, id));
}

export async function getNotifications(q) {
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

async function sendFCMNotification({ title, description }) {
  try {
    const URL = "https://fcm.googleapis.com/fcm/send";

    const topic = "/topics/general";

    var body = {
      to: topic,
      priority: "high",
      contentAvailable: true,
      notification: {
        body: description,
        title: title,
        sound: "default",
      },
    };

    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "key=" + process.env.REACT_APP_SERVER_KEY,
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.log("Failed to send fcm: ", e);
  }
}
