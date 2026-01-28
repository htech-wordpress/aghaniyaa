const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// --- Configuration ---
const SOURCE_KEY_PATH = path.resolve(__dirname, '../serviceAccountKey.json');
const SOURCE_DB_URL = 'https://aghaniya-default-rtdb.firebaseio.com/';

const DEST_KEY_PATH = path.resolve(__dirname, '../aghaniya-enterprises-llp-firebase-adminsdk-fbsvc-7da55bfd2b.json');
const DEST_DB_URL = 'https://aghaniya-enterprises-llp-default-rtdb.firebaseio.com/';

// --- Validation ---
if (!fs.existsSync(SOURCE_KEY_PATH)) {
    console.error(`❌ Source service account not found at: ${SOURCE_KEY_PATH}`);
    process.exit(1);
}
if (!fs.existsSync(DEST_KEY_PATH)) {
    console.error(`❌ Destination service account not found at: ${DEST_KEY_PATH}`);
    process.exit(1);
}

// --- Initialization ---
console.log('Initializing Firebase Apps...');

const sourceApp = admin.initializeApp({
    credential: admin.credential.cert(require(SOURCE_KEY_PATH)),
    databaseURL: SOURCE_DB_URL
}, 'sourceApp');

const destApp = admin.initializeApp({
    credential: admin.credential.cert(require(DEST_KEY_PATH)),
    databaseURL: DEST_DB_URL
}, 'destApp');

const sourceDb = sourceApp.database();
const destDb = destApp.database();

// --- Migration ---
async function migrate() {
    try {
        console.log('⏳ Fetching data from SOURCE database...');
        const snapshot = await sourceDb.ref('/').once('value');
        const data = snapshot.val();

        if (!data) {
            console.warn('⚠️ Source database is empty or returned null. Nothing to migrate.');
            process.exit(0);
        }

        console.log(`✅ Data fetched. Payload size: ${JSON.stringify(data).length} bytes.`);
        console.log('⏳ Writing data to DESTINATION database...');

        await destDb.ref('/').set(data);

        console.log('✅ Migration completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
