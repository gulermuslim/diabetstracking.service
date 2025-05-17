const admin = require('firebase-admin');
const serviceAccount = require('./diabetstracking-56a4aca2b82f');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const dbFireStore = admin.firestore();
dbFireStore.settings({ ignoreUndefinedProperties: true });

exports.getDb = { fireStore: dbFireStore, admin: admin };