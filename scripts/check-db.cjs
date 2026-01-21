const admin = require('./aghaniya-user/node_modules/firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin with the service account
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://aghaniya-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function checkDB() {
    try {
        const ref = db.ref('/');
        const snapshot = await ref.once('value');
        if (snapshot.exists()) {
            console.log('Root keys in Realtime Database:', Object.keys(snapshot.val()));
            if (snapshot.val().adminUsers) {
                console.log('adminUsers content:', snapshot.val().adminUsers);
            } else {
                console.log('adminUsers path is EMPTY/MISSING in Realtime Database.');
            }
        } else {
            console.log('Database is completely empty.');
        }
    } catch (error) {
        console.error('Error reading DB:', error);
    } finally {
        process.exit(0);
    }
}

checkDB();
