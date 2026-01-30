const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('Service account file not found:', serviceAccountPath);
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://aghaniya-default-rtdb.firebaseio.com'
});

const db = admin.database();

async function listRoot() {
    console.log('Fetching root keys from OLD DB...');
    const snapshot = await db.ref('/').once('value');
    const data = snapshot.val();

    if (!data) {
        console.log('Database is empty.');
    } else {
        console.log('Root keys in OLD DB:', Object.keys(data));
        if (data.branches) {
            console.log('Branches in OLD DB:');
            Object.entries(data.branches).forEach(([id, b]) => {
                console.log(`- ID: ${id}, Name: ${b.name}, Status: ${b.status}`);
            });
        }
        if (data.companyStats) {
            console.log('CompanyStats found in OLD DB.');
        }
    }
    process.exit(0);
}

listRoot().catch(err => {
    console.error(err);
    process.exit(1);
});
