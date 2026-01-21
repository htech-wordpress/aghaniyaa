const admin = require('../aghaniya-user/node_modules/firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function listCollections() {
    try {
        const collections = await db.listCollections();
        console.log('Firestore Collections found:');
        if (collections.length === 0) {
            console.log('No collections found.');
        }
        for (const collection of collections) {
            console.log(`- ${collection.id}`);
            // Preview count
            const snapshot = await collection.limit(1).get();
            console.log(`  (Contains documents: ${!snapshot.empty})`);
        }
    } catch (error) {
        console.error('Error listing collections:', error);
    } finally {
        process.exit(0);
    }
}

listCollections();
