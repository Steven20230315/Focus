"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const firebase_functions_test_1 = __importDefault(require("firebase-functions-test"));
const mocha_1 = require("mocha");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const src_1 = require("..");
const offLineTest = (0, firebase_functions_test_1.default)();
(0, mocha_1.describe)("Cloud Functions", () => {
    let myFunctions;
    let adminInitStub;
    let docStub;
    let setStub;
    let firestoreStub;
    const userRefStub = {
        set: (0, sinon_1.stub)().returns(Promise.resolve()),
    };
    (0, mocha_1.before)(() => {
        // [START stubAdminInit]
        // If index.js calls admin.initializeApp at the top of the file,
        // we need to stub it out before requiring index.js. This is because the
        // functions will be executed as a part of the require process.
        // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
        adminInitStub = (0, sinon_1.stub)(firebase_admin_1.default, "initializeApp");
        docStub = (0, sinon_1.stub)();
        setStub = (0, sinon_1.stub)();
        firestoreStub = (0, sinon_1.stub)(firebase_admin_1.default, "firestore").get(() => () => ({
            collection: () => ({
                doc: docStub,
            }),
        }));
        docStub.returns({ set: setStub });
        setStub.resolves(); // Assume the set operation is successful.
        // Now we can require index.js and save the exports inside a namespace called myFunctions.
        myFunctions = require("../index");
        // [END stubAdminInit]
    });
    (0, mocha_1.after)(() => {
        // Restore admin.initializeApp() to its original method.
        adminInitStub.restore();
        // Do other cleanup tasks.
        firestoreStub.restore();
        offLineTest.cleanup();
    });
    (0, mocha_1.describe)("createUserDocument", () => {
        (0, mocha_1.it)("should create a user document", async () => {
            const wrapped = offLineTest.wrap(src_1.createUserDocument);
            const mockUser = {
                toJSON: () => ({}), // return an empty object
                uid: "testUid123",
                email: "test@example.com",
                displayName: undefined,
                emailVerified: false,
                disabled: false,
                metadata: {
                    creationTime: "creationTime",
                    lastSignInTime: "lastSignInTime",
                    toJSON: () => ({}),
                },
                providerData: [],
            };
            await wrapped(mockUser);
            userRefStub.set({
                uid: "uid",
                email: "email",
                displayName: "displayName",
                photoURL: "photoURL",
                phoneNumber: "phoneNumber",
                emailVerified: true,
            });
            chai_1.assert.isTrue(userRefStub.set.calledOnce);
            chai_1.assert.deepEqual(userRefStub.set.firstCall.args[0], {
                email: "test@example.com",
                createdAt: firebase_admin_1.default.firestore.FieldValue.serverTimestamp(),
                uid: "testUid123",
            });
        });
    });
    (0, mocha_1.describe)("makeUpperCase", () => {
        // Test Case: setting messages/{pushId}/original to 'input' should cause 'INPUT' to be written to
        // messages/{pushId}/uppercase
        (0, mocha_1.it)("should upper case input and write it to /uppercase", () => {
            // [START assertOffline]
            const childParam = "uppercase";
            const setParam = "INPUT";
            // Stubs are objects that fake and/or record function calls.
            // These are excellent for verifying that functions have been called and to validate the
            // parameters passed to those functions.
            const childStub = (0, sinon_1.stub)();
            const setStub = (0, sinon_1.stub)();
            // [START fakeSnap]
            // The following lines creates a fake snapshot, 'snap', which returns 'input' when snap.val() is called,
            // and returns true when snap.ref.parent.child('uppercase').set('INPUT') is called.
            const snap = {
                val: () => "input",
                ref: {
                    parent: {
                        child: childStub,
                    },
                },
            };
            childStub.withArgs(childParam).returns({ set: setStub });
            setStub.withArgs(setParam).returns(true);
            // [END fakeSnap]
            // Wrap the makeUppercase function.
            const wrapped = offLineTest.wrap(myFunctions.makeUppercase);
            // Since we've stubbed snap.ref.parent.child(childParam).set(setParam) to return true if it was
            // called with the parameters we expect, we assert that it indeed returned true.
            return chai_1.assert.equal(wrapped(snap), true);
            // [END assertOffline]
        });
    });
    (0, mocha_1.describe)("addMessage", () => {
        let oldDatabase;
        (0, mocha_1.before)(() => {
            // Save the old database method so it can be restored after the test.
            oldDatabase = firebase_admin_1.default.database;
        });
        (0, mocha_1.after)(() => {
            // Restoring admin.database() to the original method.
            firebase_admin_1.default.database = oldDatabase;
        });
        (0, mocha_1.it)("should return a 303 redirect", (done) => {
            const refParam = "/messages";
            const pushParam = { original: "input" };
            const databaseStub = (0, sinon_1.stub)();
            const refStub = (0, sinon_1.stub)();
            const pushStub = (0, sinon_1.stub)();
            // The following lines override the behavior of admin.database().ref('/messages')
            // .push({ original: 'input' }) to return a promise that resolves with { ref: 'new_ref' }.
            // This mimics the behavior of a push to the database, which returns an object containing a
            // ref property representing the URL of the newly pushed item.
            Object.defineProperty(firebase_admin_1.default, "database", { get: () => databaseStub });
            databaseStub.returns({ ref: refStub });
            refStub.withArgs(refParam).returns({ push: pushStub });
            pushStub.withArgs(pushParam).returns(Promise.resolve({ ref: "new_ref" }));
            // [START assertHTTP]
            // A fake request object, with req.query.text set to 'input'
            const req = { query: { text: "input" } };
            // A fake response object, with a stubbed redirect function which asserts that it is called
            // with parameters 303, 'new_ref'.
            const res = {
                redirect: (code, url) => {
                    chai_1.assert.equal(code, 303);
                    chai_1.assert.equal(url, "new_ref");
                    done();
                },
            };
            // Invoke addMessage with our fake request and response objects. This will cause the
            // assertions in the response object to be evaluated.
            myFunctions.addMessage(req, res);
            // [END assertHTTP]
        });
    });
});
//# sourceMappingURL=test.offline.test.js.map