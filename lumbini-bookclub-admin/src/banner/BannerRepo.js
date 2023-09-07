import {
  doc,
  getDoc,
  runTransaction,
  Timestamp,
  updateDoc,
} from "firebase/firestore/lite";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { getFileExtension } from "../common/utils";
import { firestore, storage } from "../firebase.config";

const homeBannerId = "homeBanner";

export async function uploadImage(file) {
  const db = firestore;

  if (file === null || file.size <= 0) {
    throw new Error("Invalid image file.");
  }

  const docRef = doc(db, "banners", homeBannerId);
  const fileName = `${Timestamp.now().toMillis()}${getFileExtension(
    file.name
  )}`;
  const bannersRef = ref(storage, `banners/${fileName}`);

  try {
    await runTransaction(db, async (transaction) => {
      const bDoc = await transaction.get(docRef);

      if (!bDoc.exists()) {
        throw Error("Document does not exist!");
      }

      transaction.update(docRef, {
        images: [...bDoc.data().images, { name: fileName }],
      });

      await uploadBytes(bannersRef, file);
    });
    //console.log("Banner uploaded successfully!");
  } catch (e) {
    console.log("Banner upload failed: ", e);
    throw Error("Failed to upload banner.");
  }
}

export async function updateBanners(images = []) {
  const db = firestore;

  const docRef = doc(db, "banners", homeBannerId);
  await updateDoc(docRef, { images: [...images] });
}

export async function removeBanner({ images = [], image }) {
  const db = firestore;

  const docRef = doc(db, "banners", homeBannerId);
  const bannersRef = ref(storage, `banners/${image}`);

  try {
    await runTransaction(db, async (transaction) => {
      const bDoc = await transaction.get(docRef);

      if (!bDoc.exists()) {
        throw Error("Document does not exist!");
      }

      transaction.update(docRef, {
        images: images.filter((e) => e.name !== image),
      });

      try {
        await deleteObject(bannersRef);
      } catch (e) {
        console.log(e);
      }
    });
    //console.log("Banner deleted successfully!");
  } catch (e) {
    console.log("Banner delete failed: ", e);
    throw Error("Failed to delete banner.");
  }
}

export async function getBanners() {
  const db = firestore;

  let snapShot = await getDoc(doc(db, "banners", homeBannerId));

  return [...snapShot.get("images")];
}
