import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore/lite";
import { pageSizeLimit } from "../common/app.config";
import { firestore } from "../common/firebase.config";

const collectionName = "books";

export async function getProduct(id) {
  if (!id) {
    throw Error("Book not found.");
  }
  const db = firestore;
  const snapShot = await getDoc(doc(db, collectionName, id));

  if (!snapShot.exists()) {
    throw Error("Book not found.");
  }

  const data = snapShot.data();

  const categoryRef = doc(db, "categories", data.category);
  const categorySnapshot = await getDoc(categoryRef);

  const authorRef = doc(db, "authors", data.author);
  const authorSnapshot = await getDoc(authorRef);

  const relatedQuery = query(
    collection(db, collectionName),
    where("category", "==", data.category),
    orderBy("createdAt", "desc"),
    limit(6)
  );

  const relatedSnapshot = await getDocs(relatedQuery);
  const relatedProducts = relatedSnapshot.docs.filter((doc) => doc.id !== id);

  if (relatedProducts.length > 5) {
    relatedProducts.pop();
  }

  //console.log("get product");

  const relatedList = [];

  for (const rp of relatedProducts) {
    const related = rp.data();

    const author = await getDoc(doc(db, "authors", related.author));

    relatedList.push({
      ...related,
      id: rp.id,
      author: { id: author.id, name: author.data().name },
    });
  }

  return {
    product: {
      ...data,
      id: snapShot.id,
      category: { id: categorySnapshot.id, name: categorySnapshot.data().name },
      author: { id: authorSnapshot.id, name: authorSnapshot.data().name },
    },
    relatedProducts: relatedList,
  };
}

export async function getProducts(q) {
  if (!q) {
    return [];
  }

  const db = firestore;
  const constraints = [collection(db, collectionName)];
  let dataQuery;

  if (q && q.promotion) {
    constraints.push(where("isDiscount", "==", true));
  }

  if (q && q.newArrival) {
    constraints.push(where("newArrival", "==", true));
  }

  if (q && q.popular) {
    constraints.push(where("popular", "==", true));
  }

  if (q && q.name && q.name.length > 0) {
    constraints.push(where("nameLowercase", ">=", q.name.toLowerCase()));
  }

  if (q && q.category) {
    constraints.push(where("category", "==", q.category));
  }

  if (q && q.author) {
    constraints.push(where("author", "==", q.author));
  }

  constraints.push(where("hidden", "==", false));

  if (q && q.name && q.name.length > 0) {
    constraints.push(orderBy("nameLowercase", "asc"));
  }
  constraints.push(orderBy("createdAt", "desc"));

  if (q && q.last) {
    let snapShot = await getDoc(doc(db, collectionName, q.last));

    dataQuery = query(
      ...constraints,
      startAfter(snapShot),
      limit(pageSizeLimit)
    );
  } else {
    dataQuery = query(...constraints, limit(pageSizeLimit));
  }

  const snapShot = await getDocs(dataQuery);

  //console.log("get products");

  const list = [];

  for (const qd of snapShot.docs) {
    const data = qd.data();
    const author = await getDoc(doc(db, "authors", data.author));
    list.push({
      ...data,
      id: qd.id,
      author: {
        id: data.author,
        name: author.data().name,
      },
    });
  }

  return list;
}
