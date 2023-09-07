import {
  collection,
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
import { pageSizeLimit } from "../common/app.config";
import { firebaseAuth, firestore } from "../firebase.config";

const collectionName = "orders";

export async function updateOrderStatus({ id, status }) {
  const db = firestore;
  const auth = firebaseAuth;
  const now = Timestamp.now();

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  await updateDoc(doc(db, collectionName, id), {
    status: status,
    updatedAt: now.toMillis(),
    updatedBy: auth.currentUser.email,
  });
  return { status };
}

export async function getOrder(id) {
  const db = firestore;

  let snapShot = await getDoc(doc(db, collectionName, id));

  if (!snapShot.exists()) {
    throw Error("Order not found.");
  }

  return { ...snapShot.data(), id: snapShot.id };
}

export async function updateOrderAddress(order, address) {
  const db = firestore;
  const auth = firebaseAuth;

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  let orderRef = doc(db, collectionName, order.id);

  await updateDoc(orderRef, {
    address: address,
    updatedAt: Timestamp.now().toMillis(),
    updatedBy: auth.currentUser.email,
  });

  return { ...order, address: address };
}

export async function updateOrderDeliveryFee(order, fee) {
  const db = firestore;
  const auth = firebaseAuth;

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  let orderRef = doc(db, collectionName, order.id);

  const totalPrice = order.subtotal + fee - order.discount;

  await updateDoc(orderRef, {
    deliveryFee: fee,
    totalPrice: totalPrice,
    updatedAt: Timestamp.now().toMillis(),
    updatedBy: auth.currentUser.email,
  });

  return { ...order, deliveryFee: fee, totalPrice: totalPrice };
}

export async function removeOrderItem(order, item) {
  const db = firestore;
  const auth = firebaseAuth;

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  const orderRef = doc(db, collectionName, order.id);

  const items = order.items.filter((i) => i.productId !== item.productId);
  const removedItem = {
    ...item,
    removed: true,
  };

  let discount = 0;
  let subtotal = 0;
  let totalProduct = 0;

  for (const i of items) {
    discount += i.discount;
    subtotal += i.quantity * i.unitPrice;
    totalProduct += i.quantity;
  }

  const updatedFields = {
    items: [...items, removedItem],
    discount: discount,
    subtotal: subtotal,
    totalProduct: totalProduct,
    totalPrice: subtotal + order.deliveryFee - discount,
  };

  await updateDoc(orderRef, {
    ...updatedFields,
    updatedAt: Timestamp.now().toMillis(),
    updatedBy: auth.currentUser.email,
  });

  return { ...order, ...updatedFields };
}

export async function restoreOrderItem(order, item) {
  const db = firestore;
  const auth = firebaseAuth;

  if (!auth.currentUser) {
    throw Error("unauthorized");
  }

  const orderRef = doc(db, collectionName, order.id);

  const items = [...order.items];

  let discount = 0;
  let subtotal = 0;
  let totalProduct = 0;

  for (const i of items) {
    discount += i.discount;
    subtotal += i.quantity * i.unitPrice;
    totalProduct += i.quantity;

    if (i.productId === item.productId) {
      delete i.removed;
    }
  }

  const updatedFields = {
    items: items,
    discount: discount,
    subtotal: subtotal,
    totalProduct: totalProduct,
    totalPrice: subtotal + order.deliveryFee - discount,
  };

  await updateDoc(orderRef, {
    ...updatedFields,
    updatedAt: Timestamp.now().toMillis(),
    updatedBy: auth.currentUser.email,
  });

  return { ...order, ...updatedFields };
}

export async function getOrders(q) {
  const db = firestore;
  const constraints = [collection(db, collectionName)];
  let dataQuery;

  if (q && q.orderNumber) {
    constraints.push(where("orderNumber", "==", q.orderNumber));
  }

  if (q && q.phoneNumber) {
    constraints.push(where("phoneNumber", "==", q.phoneNumber));
  }

  if (q && q.status) {
    constraints.push(where("status", "==", q.status));
  }

  if (q && q.orderDate) {
    const d = q.orderDate;
    const start = new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
    );
    const end = new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
    );
    constraints.push(
      where("createdAt", ">=", start.getTime()),
      where("createdAt", "<=", end.getTime())
    );
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

  const list = docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return {
    list: list,
    hasPrev: hasPrev,
    hasNext: hasNext,
  };
}
