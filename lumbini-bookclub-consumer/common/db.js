import Dexie from "dexie";

export const db = new Dexie("lumbiniLocalStorageDb");
db.version(1).stores({
  cartItems: "++id", // Primary key and indexed props
});
