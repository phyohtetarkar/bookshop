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
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { getAuthors } from "../author/AuthorRepo";
import { getCategories } from "../category/CategoryRepo";
import { pageSizeLimit } from "../common/app.config";
import { getFileExtension } from "../common/utils";
import { firebaseAuth, firestore, storage } from "../firebase.config";
import { getProductSetting } from "../setting/SettingRepo";
import { initialProductData } from "./ProductEdit";

const collectionName = "books";

export async function saveProduct(product) {
  const db = firestore;
  const auth = firebaseAuth;
  const now = Timestamp.now();

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  const urls = product.urls ?? [];
  const files = product.files ?? [];
  const deletedImages = product.images.filter((e) => !urls.includes(e));

  delete product.urls;
  delete product.files;

  product["updatedAt"] = now.toMillis();
  product["updatedBy"] = auth.currentUser.email;
  product["nameLowercase"] = product.name.toLowerCase();
  product["images"] = urls;

  for (let f of files) {
    const fileName = `${Timestamp.now().toMillis()}${getFileExtension(f.name)}`;
    const imageRef = ref(storage, `books/${fileName}`);

    await uploadBytes(imageRef, f);

    product.images.push(fileName);
  }

  for (let img of deletedImages) {
    try {
      const imageRef = ref(storage, `books/${img}`);
      await deleteObject(imageRef);
    } catch (e) {
      console.log("Failed to delete image: ", e);
    }
  }

  if (product.id) {
    const id = product.id;
    delete product.id;
    await updateDoc(doc(db, collectionName, id), product);
    return { ...product };
  }

  delete product.id;
  product["createdAt"] = now.toMillis();
  product["createdBy"] = auth.currentUser.email;

  const docRef = await addDoc(collection(db, collectionName), product);
  return {
    ...product,
    id: docRef.id,
  };
}

export async function getProduct(id) {
  const db = firestore;

  let snapShot = await getDoc(doc(db, collectionName, id));

  if (!snapShot.exists()) {
    throw Error("Book not found.");
  }

  const data = snapShot.data();

  return {
    ...data,
    id: snapShot.id,
  };
}

export async function getProductEdit(id) {
  const product = id ? await getProduct(id) : { ...initialProductData };

  const categories = await getCategories();
  const authors = await getAuthors();
  const productSetting = await getProductSetting();

  if (!product.id) {
    product.category = categories.length > 0 ? categories[0].id : "";
    //product.author = authors.length > 0 ? authors[0].id : "";

    //const publishers = productSetting.publishers ?? [];
    //product.publisher = publishers.length > 0 ? publishers[0] : "";
  }

  return {
    product: product,
    categories: categories,
    authors: authors,
    productSetting: productSetting,
  };
}

export async function deleteProduct(id) {
  const db = firestore;
  const docRef = doc(db, collectionName, id);
  const snapShot = await getDoc(docRef);
  const images = snapShot.data().images ?? [];

  await deleteDoc(docRef);

  for (let img of images) {
    try {
      const imageRef = ref(storage, `books/${img}`);
      await deleteObject(imageRef);
    } catch (e) {
      console.log("Failed to delete image: ", e);
    }
  }
}

export async function getProducts(q) {
  const db = firestore;
  const constraints = [collection(db, collectionName)];
  let dataQuery;

  if (q && q.code) {
    constraints.push(where("code", "==", q.code));
  }

  if (q && q.promotion) {
    constraints.push(where("isDiscount", "==", true));
  }

  if (q && q.newArrival) {
    constraints.push(where("newArrival", "==", true));
  }

  if (q && q.popular) {
    constraints.push(where("popular", "==", true));
  }

  if (q && q.category) {
    constraints.push(where("category", "==", q.category));
  }

  if (q && q.author) {
    constraints.push(where("author", "==", q.author));
  }

  if (q && q.status) {
    constraints.push(where("available", "==", q.status === "IN_STOCK"));
  }

  if (q && q.hidden) {
    constraints.push(where("hidden", "==", true));
  }

  constraints.push(orderBy("createdAt", "desc"));

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

  const list = [];

  for (let doc of docs) {
    const data = doc.data();
    //const category = await getDoc(data.category);
    list.push({ ...data, id: doc.id });
  }

  return {
    list: list,
    hasPrev: hasPrev,
    hasNext: hasNext,
  };
}
