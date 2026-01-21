#!/usr/bin/env node
/*
Script to seed a superuser email into Firestore under adminConfig/superusers.
Usage:
  FIREBASE_ADMIN_SA_JSON='{"type":"..."}' node scripts/seed-super-admin.cjs asaurabh@htechdigital.com
or
  FIREBASE_ADMIN_SA_PATH=./serviceAccountKey.json node scripts/seed-super-admin.cjs asaurabh@htechdigital.com

Note: This requires admin credentials (service account JSON). Keep them secure.
*/

const fs = require('fs');
const path = require('path');

const admin = require('firebase-admin');

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || 'asaurabh@htechdigital.com';

  const saJsonEnv = process.env.FIREBASE_ADMIN_SA_JSON;
  const saPath = process.env.FIREBASE_ADMIN_SA_PATH;

  let serviceAccount;
  if (saJsonEnv) {
    try {
      serviceAccount = JSON.parse(saJsonEnv);
    } catch (e) {
      console.error('Invalid FIREBASE_ADMIN_SA_JSON:', e.message);
      process.exit(1);
    }
  } else if (saPath) {
    const full = path.resolve(saPath);
    if (!fs.existsSync(full)) {
      console.error('Service account file not found at', full);
      process.exit(1);
    }
    serviceAccount = require(full);
  } else {
    console.error('Provide service account via FIREBASE_ADMIN_SA_JSON or FIREBASE_ADMIN_SA_PATH env var.');
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://aghaniya-default-rtdb.firebaseio.com" // Explicitly set DB URL
  });
  const db = admin.database(); // Use Realtime DB

  const ref = db.ref('adminConfig/superusers');

  const snapshot = await ref.once('value');
  let emails = [];
  if (snapshot.exists()) {
    const data = snapshot.val();
    emails = data.emails || [];
  }

  if (!emails.includes(email)) {
    emails.push(email);
    await ref.set({ emails });
    console.log(`Added ${email} to superusers in Realtime DB`);
  } else {
    console.log(`${email} is already a superuser in Realtime DB`);
  }

  console.log('Done');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
