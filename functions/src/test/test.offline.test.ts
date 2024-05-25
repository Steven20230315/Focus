// import {assert} from "chai";
// import sinon, {stub} from "sinon";
// import test from "firebase-functions-test";
// import {describe, it, before, after} from "mocha";
// import admin from "firebase-admin";
// import {HttpsFunction, Runnable} from "firebase-functions";
// import {UserRecord} from "firebase-functions/v1/auth";
// import {createUserDocument} from "..";
// import {App} from "firebase-admin/app";

// const offLineTest = test();

// describe("Cloud Functions", () => {
//   let myFunctions: {
//     makeUppercase: HttpsFunction & Runnable<unknown>;
//     addMessage: (arg0: { query: { text: string; }; }, arg1: { redirect: (code: any, url: any) => void; }) => void;
//     createUserDocument:(user: UserRecord) => Promise<void>;
//   };


//   let adminInitStub: sinon.SinonStub<[options?: admin.AppOptions | undefined, name?: string | undefined], admin.app.App>;
//   let docStub: sinon.SinonStub<any[], any>;
//   let setStub;
//   let firestoreStub: sinon.SinonStub<[app?: App | undefined], admin.firestore.Firestore>;
//   const userRefStub = {
//     set: stub().returns(Promise.resolve()),
//   };
//   before(() => {
//     // [START stubAdminInit]
//     // If index.js calls admin.initializeApp at the top of the file,
//     // we need to stub it out before requiring index.js. This is because the
//     // functions will be executed as a part of the require process.
//     // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
//     adminInitStub = stub(admin, "initializeApp");
//     docStub = stub();
//     setStub = stub();
//     firestoreStub = stub(admin, "firestore").get(() => () => ({
//       collection: () => ({
//         doc: docStub,
//       }),
//     })); docStub.returns({set: setStub});
//     setStub.resolves(); // Assume the set operation is successful.

//     // Now we can require index.js and save the exports inside a namespace called myFunctions.
//     myFunctions = require("../index");
//     // [END stubAdminInit]
//   });

//   after(() => {
//     // Restore admin.initializeApp() to its original method.
//     adminInitStub.restore();
//     // Do other cleanup tasks.
//     firestoreStub.restore();
//     offLineTest.cleanup();
//   });

//   describe("createUserDocument", () => {
//     it("should create a user document", async () => {
//       const wrapped = offLineTest.wrap(createUserDocument);
//       const mockUser = {
//         toJSON: () => ({}), // return an empty object
//         uid: "testUid123",
//         email: "test@example.com",
//         displayName: undefined,
//         emailVerified: false,
//         disabled: false,
//         metadata: {
//           creationTime: "creationTime",
//           lastSignInTime: "lastSignInTime",
//           toJSON: () => ({}),
//         },
//         providerData: [],
//       } as UserRecord;
//       await wrapped(mockUser);
//       userRefStub.set({
//         uid: "uid",
//         email: "email",
//         displayName: "displayName",
//         photoURL: "photoURL",
//         phoneNumber: "phoneNumber",
//         emailVerified: true,
//       });
//       assert.isTrue(userRefStub.set.calledOnce);
//       assert.deepEqual(userRefStub.set.firstCall.args[0], {
//         email: "test@example.com",
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         uid: "testUid123",
//       });
//     });
//   });

//   describe("makeUpperCase", () => {
//     // Test Case: setting messages/{pushId}/original to 'input' should cause 'INPUT' to be written to
//     // messages/{pushId}/uppercase
//     it("should upper case input and write it to /uppercase", () => {
//       // [START assertOffline]
//       const childParam = "uppercase";
//       const setParam = "INPUT";
//       // Stubs are objects that fake and/or record function calls.
//       // These are excellent for verifying that functions have been called and to validate the
//       // parameters passed to those functions.
//       const childStub = stub();
//       const setStub = stub();
//       // [START fakeSnap]
//       // The following lines creates a fake snapshot, 'snap', which returns 'input' when snap.val() is called,
//       // and returns true when snap.ref.parent.child('uppercase').set('INPUT') is called.
//       const snap = {
//         val: () => "input",
//         ref: {
//           parent: {
//             child: childStub,
//           },
//         },
//       };
//       childStub.withArgs(childParam).returns({set: setStub});
//       setStub.withArgs(setParam).returns(true);
//       // [END fakeSnap]
//       // Wrap the makeUppercase function.
//       const wrapped = offLineTest.wrap(myFunctions.makeUppercase);
//       // Since we've stubbed snap.ref.parent.child(childParam).set(setParam) to return true if it was
//       // called with the parameters we expect, we assert that it indeed returned true.
//       return assert.equal(wrapped(snap), true);
//       // [END assertOffline]
//     });
//   });

//   describe("addMessage", () => {
//     let oldDatabase: typeof admin.database;
//     before(() => {
//       // Save the old database method so it can be restored after the test.
//       oldDatabase = admin.database;
//     });

//     after(() => {
//       // Restoring admin.database() to the original method.
//       admin.database = oldDatabase;
//     });

//     it("should return a 303 redirect", (done) => {
//       const refParam = "/messages";
//       const pushParam = {original: "input"};
//       const databaseStub = stub();
//       const refStub = stub();
//       const pushStub = stub();

//       // The following lines override the behavior of admin.database().ref('/messages')
//       // .push({ original: 'input' }) to return a promise that resolves with { ref: 'new_ref' }.
//       // This mimics the behavior of a push to the database, which returns an object containing a
//       // ref property representing the URL of the newly pushed item.

//       Object.defineProperty(admin, "database", {get: () => databaseStub});
//       databaseStub.returns({ref: refStub});
//       refStub.withArgs(refParam).returns({push: pushStub});
//       pushStub.withArgs(pushParam).returns(Promise.resolve({ref: "new_ref"}));

//       // [START assertHTTP]
//       // A fake request object, with req.query.text set to 'input'
//       const req = {query: {text: "input"}};
//       // A fake response object, with a stubbed redirect function which asserts that it is called
//       // with parameters 303, 'new_ref'.
//       const res = {
//         redirect: (code: any, url: any) => {
//           assert.equal(code, 303);
//           assert.equal(url, "new_ref");
//           done();
//         },
//       };

//       // Invoke addMessage with our fake request and response objects. This will cause the
//       // assertions in the response object to be evaluated.
//       myFunctions.addMessage(req, res);
//       // [END assertHTTP]
//     });
//   });
// });
