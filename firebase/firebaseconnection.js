const admin = require('firebase-admin');
const serviceAccount = require('./diabetstracking-c5c89-firebase-adminsdk-fbsvc-5dfff3ee90');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const dbFireStore = admin.firestore();
dbFireStore.settings({ ignoreUndefinedProperties: true });

exports.getDb = { fireStore: dbFireStore, admin: admin };