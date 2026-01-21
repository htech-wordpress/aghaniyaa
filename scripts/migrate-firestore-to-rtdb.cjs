const admin = require('../aghaniya-user/node_modules/firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://aghaniya-default-rtdb.firebaseio.com"
    });
}

const firestore = admin.firestore();
const rtdb = admin.database();

async function migrateCollection(collectionName) {
    console.log(`Migrating collection: ${collectionName}...`);
    const snapshot = await firestore.collection(collectionName).get();

    if (snapshot.empty) {
        console.log(`  No documents in ${collectionName}.`);
        return;
    }

    let count = 0;
    for (const doc of snapshot.docs) {
        const data = doc.data();
        // Use the same ID from Firestore
        const ref = rtdb.ref(`${collectionName}/${doc.id}`);

        // For adminUsers, ensure we format dates properly if needed, but raw copy is usually fine.
        // If there are timestamps (Firestore objects), they might serialize weirdly.
        // Let's rely on JSON serialization of the data object.
        const cleanData = JSON.parse(JSON.stringify(data));

        await ref.set(cleanData);
        count++;
    }
    console.log(`  Moved ${count} documents from ${collectionName} to RTDB.`);
}

async function runMigration() {
    try {
        const collections = ['adminConfig', 'adminUsers', 'agents', 'leads', 'settings'];

        for (const col of collections) {
            await migrateCollection(col);
        }

        console.log('Migration COMPLETED Successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit(0);
    }
}

runMigration();
