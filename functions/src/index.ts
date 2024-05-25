/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {onDocumentCreated, onDocumentDeleted} from "firebase-functions/v2/firestore";
// import "firebase-functions/logger/compat";
import * as v1 from "firebase-functions/v1";
import admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions";

admin.initializeApp();

const db = getFirestore();
// import {db } from "../../src/firebase/firebase-config.js";
// import { event } from "firebase-functions/v1/analytics";

type Indexable = { [key: string]: any };

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-debugger
    debugger;
  }
  const name = request.params[0];
  const items: Indexable = {lamp: 1, chair: 2, table: 3};
  const message = items[name];
  console.info("Hello logs!", {structuredData: true});
  response.send(`<h1>${message}</h1>`);
});


export const onTaskCreate = onDocumentCreated("tasks/{taskId}", (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  // Extract the data from the snapshot
  const data = snapshot.data();
  const columnId = data.columnId;
  const taskId = data.taskId;
  // Do I need to use admin.firestore() instead of db?

  const columnRef = db.doc(`columns/${columnId}`);

  // access a particular field as you would any JS property
  const title = data.title;
  console.log(`The title is ${title}`);

  // Add new task id to column taskIds array
  return columnRef.update({
    taskIds: admin.firestore.FieldValue.arrayUnion(taskId),
  });
});

export const createUserDocument = v1.auth.user().onCreate(async (user) => {
  console.log("This is from createUserDocument");
  console.log(`User created: ${user.uid}`);
  console.log( user);
  const uid = user.uid;
  const email = user.email;

  const userRef = admin.firestore().collection("users").doc(uid);

  // In firestore, when I use set,update, or delete on a document reference, it will return a promise
  try {
    await userRef.set({
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Server timestamp for consistency
      uid: uid,
    });
    console.log("Document set successfully");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

export const onDeleteList = onDocumentDeleted("lists/{listId}", (event) => {
  console.log(event);
});

// Rememer to run `npm run build:watch` in the functions folder. Because this is written in TypeScript, the changes you made to the code will not be
// reflected in the build until you run `npm run build:watch` So the changes will not be picked up by the emulator.

export const onCreateColumn = onDocumentCreated("columns/{columnId}", (event) => {
  console.log(event);
  console.log("This is from onCreateColumn");
  console.log(event.data);
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No data associated with the event");
    return;
  }

  const data = snapshot.data();
  const listId = data.listId;
  const columnId = data.columnId;
  const title = data.title;
  const taskIds = data.taskIds;
  console.log(`The title is ${title}`);
  console.log(`The listId is ${listId}`);
  console.log(`The columnId is ${columnId}`);
  console.log(`The taskIds are ${taskIds}`);
});
