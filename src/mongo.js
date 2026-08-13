import * as Realm from "realm-web";

// Use Vite env variables (prefix VITE_)
const REALM_APP_ID = import.meta.env.VITE_REALM_APP_ID || "YOUR_REALM_APP_ID";
const DB_NAME = import.meta.env.VITE_MONGO_DB_NAME || "YOUR_DB";

export const app = new Realm.App({ id: REALM_APP_ID });

export async function loginAnon() {
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  }
  return app.currentUser;
}

export function getCollection() {
  if (!app.currentUser) throw new Error('Not logged in');
  return app.currentUser.mongoClient('mongodb-atlas').db(DB_NAME).collection('secrets');
}

export const BSON = Realm.BSON;
