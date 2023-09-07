import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore/lite";
import { firestore } from "../common/firebase.config";
import { getAuthors } from "./AuthorRepo";
import { getCategories } from "./CategoryRepo";

export async function getHomeData() {
  const db = firestore;

  const bannerSnapshot = await getDoc(doc(db, "banners", "homeBanner"));
  const promotionSnapshot = await getDocs(
    query(
      collection(db, "books"),
      where("isDiscount", "==", true),
      where("hidden", "==", false),
      limit(8),
      orderBy("updatedAt", "desc")
    )
  );

  const popularSnapshot = await getDocs(
    query(
      collection(db, "books"),
      where("popular", "==", true),
      where("hidden", "==", false),
      limit(8),
      orderBy("updatedAt", "desc")
    )
  );

  const newArrivalSnapshot = await getDocs(
    query(
      collection(db, "books"),
      where("newArrival", "==", true),
      where("hidden", "==", false),
      limit(8),
      orderBy("updatedAt", "desc")
    )
  );

  //console.log("get home data");

  const authors = await getAuthors();

  const promotions = [];
  const populars = [];
  const newArrivals = [];

  for (const docData of promotionSnapshot.docs) {
    const data = docData.data();

    const author = authors.find((a) => a.id === data.author);

    promotions.push({
      ...data,
      id: docData.id,
      author: { ...author },
    });
  }

  for (const docData of popularSnapshot.docs) {
    const data = docData.data();

    const author = authors.find((a) => a.id === data.author);

    populars.push({
      ...data,
      id: docData.id,
      author: { ...author },
    });
  }

  for (const docData of newArrivalSnapshot.docs) {
    const data = docData.data();

    const author = authors.find((a) => a.id === data.author);

    newArrivals.push({
      ...data,
      id: docData.id,
      author: { ...author },
    });
  }

  return {
    banners: bannerSnapshot.data().images ?? [],
    categories: [],
    authors: authors,
    // promotions: [],
    // populars: [],
    // newArrivals: [],
    promotions: promotions,
    populars: populars,
    newArrivals: newArrivals,
  };
}

export async function getHomeCategorizedData() {
  const db = firestore;
  const categories = await getCategories();

  const constraints = [collection(db, "books"), where("hidden", "==", false)];

  const trail = [limit(4), orderBy("createdAt", "desc")];
  const list = [];

  for (const c of categories) {
    const q = query(...constraints, where("category", "==", c.id), ...trail);

    const snapShot = await getDocs(q);

    const dataList = [];

    for (const d of snapShot.docs) {
      const data = d.data();
      const author = await getDoc(doc(db, "authors", data.author));

      dataList.push({
        ...data,
        id: d.id,
        author: { id: author.id, name: author.data().name },
      });
    }

    list.push({
      category: c,
      list: dataList,
    });
  }

  return list;
}
