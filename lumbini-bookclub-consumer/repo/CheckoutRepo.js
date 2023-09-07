import {
  collection,
  getDocs,
  getDoc,
  limit,
  orderBy,
  query,
  where,
  doc,
  Timestamp,
  addDoc,
} from "firebase/firestore/lite";
import { KEY_CONTACT_INFO } from "../common/app.config";
import { db } from "../common/db";
import { firestore } from "../common/firebase.config";

export async function countCartItem() {
  return await db.cartItems.count();
}

export async function updateItemQuantity(id, addBy) {
  try {
    if (!id || !addBy) {
      return;
    }

    const data = await db.cartItems.get(id);
    const product = data.product;
    let price = product.price;

    const count = data.quantity + addBy;

    let discount = 0;

    if (product.isDiscount) {
      discount = calculateDiscount(product.price, product.discount);
    }

    const item = {
      id: id,
      product: product,
      quantity: count,
      price: count * (price - discount),
      discount: count * discount,
    };

    await db.cartItems.put(item);
  } catch (e) {
    console.log(e);
  }
}

export async function addToCard(product = {}, count = 6) {
  try {
    const data = { ...product };
    delete data.createdAt;
    delete data.createdBy;
    delete data.updatedAt;
    delete data.updatedBy;

    // const rawItems = localStorage.getItem(KEY_CART_ITEMS);
    // const items = rawItems !== null ? JSON.parse(rawItems) : [];
    const items = await db.cartItems.toArray();

    const index = items.findIndex((e) => e.product.id === data.id);

    if (index >= 0) {
      return false;
    }

    let price = data.price;
    let discount = 0;

    if (data.isDiscount) {
      discount = calculateDiscount(data.price, data.discount);
    }

    const item = {
      product: data,
      quantity: count,
      price: count * (price - discount),
      discount: count * discount,
    };

    //items.push(item);
    //localStorage.setItem(KEY_CART_ITEMS, JSON.stringify(items));

    await db.cartItems.add(item);

    return true;
  } catch (e) {
    console.log(e);
    throw Error("Failed to add product.");
  }
}

export async function removeFromCart(id) {
  try {
    if (!id) {
      return false;
    }

    await db.cartItems.delete(id);

    return true;
  } catch (e) {
    console.log(e);
    throw Error("Failed to remove from cart.");
  }
}

export async function emptyCart() {
  try {
    await db.cartItems.clear();
  } catch (e) {
    console.log(e);
    //throw Error("Failed to remove all from cart.");
  }
}

export async function getConfimCartData(deliveryFee) {
  try {
    const items = await db.cartItems.toArray();

    let discount = 0;
    let totalPrice = 0;
    for (let item of items) {
      discount = discount + item.discount;
      totalPrice = totalPrice + item.price;
    }

    return {
      items: items,
      discount: discount,
      deliveryFee: 0,
      totalPrice: totalPrice,
    };
  } catch (e) {
    console.log(e);
    throw Error("Failed to retrive shopping cart items.");
  }
}

export async function getCartData() {
  try {
    return await db.cartItems.toArray();
  } catch (e) {
    console.log(e);
    throw Error("Failed to retrive shopping cart items.");
  }
}

export function getContactInfo() {
  const contact = {
    name: "",
    phone: "",
    address: "",
    note: "",
    deliveryFee: {
      township: "",
      fee: 0,
    },
  };

  try {
    const rawInfo = sessionStorage.getItem(KEY_CONTACT_INFO);

    return rawInfo !== null
      ? JSON.parse(Buffer.from(rawInfo, "base64").toString("utf-8"))
      : null;
  } catch (e) {
    //console.error("Failed to retrive contact: ", e);
  }

  return null;
}

export function saveContactInfo(data) {
  try {
    const info = { ...data };
    sessionStorage.setItem(
      KEY_CONTACT_INFO,
      Buffer.from(JSON.stringify(info)).toString("base64")
    );
  } catch (e) {
    //console.error("Failed to save contact: ", e);
  }
}

export function removeContactInfo() {
  try {
    sessionStorage.removeItem(KEY_CONTACT_INFO);
  } catch (e) {
    //console.error("Failed to remove contact: ", e);
  }
}

export async function submitOrder({ data, contactInfo }) {
  const db = firestore;

  const items = data.items;

  for (let item of items) {
    const snapShot = await getDoc(doc(db, "books", item.product.id));
    const data = snapShot.data();
    if (!data || data.hidden || !data.available) {
      throw Error(`${item.product.name} is not available.`);
    }
  }

  try {
    const status = "PENDING";
    const totalProduct = items.reduce((p, c) => p + c.quantity, 0);
    const subtotal = items.reduce(
      (p, c) => p + c.product.price * c.quantity,
      0
    );
    const products = items.map((p) => {
      return {
        productId: p.product.id,
        product: p.product,
        quantity: p.quantity,
        unitPrice: p.product.price,
        price: p.price,
        discount: p.discount,
      };
    });

    const orderNumber = await generateOrderNumber(8);

    const order = {
      orderNumber: orderNumber,
      customer: contactInfo.name,
      phoneNumber: contactInfo.phone,
      address: contactInfo.address,
      note: contactInfo.note,
      totalProduct: totalProduct,
      subtotal: subtotal,
      totalPrice: data.totalPrice,
      discount: data.discount,
      deliveryFee: 0,
      status: status,
      items: products,
      createdAt: Timestamp.now().toMillis(),
    };

    const result = await addDoc(collection(db, "orders"), order);

    await emptyCart();
    removeContactInfo();

    //console.log(order);
    return orderNumber;
  } catch (e) {
    console.log(e);
    throw Error("Order submit failed! Please try again.");
  }
}

function calculateDiscount(price = 0, discount = { value: 0, type: "fixed" }) {
  if (discount.type === "fixed") {
    return price - parseInt(discount.value, 10);
  }

  const percent = discount.value;
  const discountPrice = (percent * price) / 100;
  return discountPrice;
}

async function generateOrderNumber(length) {
  const db = firestore;
  const randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charLength = randomChars.length;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * charLength));
  }

  const q = query(
    collection(db, "orders"),
    where("orderNumber", "==", result),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const snapShot = await getDocs(q);

  return snapShot.empty ? result : generateOrderNumber(length);
}
