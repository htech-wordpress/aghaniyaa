const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.resolve(__dirname, '../aghaniya-enterprises-llp-firebase-adminsdk-fbsvc-7da55bfd2b.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('Service account file not found:', serviceAccountPath);
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://aghaniya-enterprises-llp-default-rtdb.firebaseio.com'
});

const db = admin.database();

async function listSettings() {
    console.log('Fetching "settings" from production DB...');
    const snapshot = await db.ref('settings').once('value');
    const data = snapshot.val();

    if (!data) {
        console.log('"settings" node is empty.');
    } else {
        console.log('Keys in "settings":', Object.keys(data));
        if (data.companyStats) {
            console.log('companyStats found in "settings".');
        }
    }
}

async function listRoot() {
    console.log('Fetching root keys from production DB...');
    const snapshot = await db.ref('/').once('value');
    const data = snapshot.val();

    if (!data) {
        console.log('Database is empty.');
    } else {
        console.log('Root keys in DB:', Object.keys(data));
        if (data.branches) {
            console.log('Branches in DB:');
            Object.entries(data.branches).forEach(([id, b]) => {
                console.log(`- ID: ${id}, Name: ${b.name}, Status: ${b.status}`);
            });
        } else {
            console.log('No "branches" key found at root.');
        }
    }
    await listSettings();
    process.exit(0);
}

listRoot().catch(err => {
    console.error(err);
    process.exit(1);
});
