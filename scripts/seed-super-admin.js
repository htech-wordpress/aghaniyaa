#!/usr/bin/env node
/*
Script to seed a superuser email into Firestore under adminConfig/superusers.
Usage:
  FIREBASE_ADMIN_SA_JSON='{"type":"..."}' node scripts/seed-super-admin.js asaurabh@htechdigital.com
or
  FIREBASE_ADMIN_SA_PATH=./serviceAccountKey.json node scripts/seed-super-admin.js asaurabh@htechdigital.com

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

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const db = admin.firestore();

  const cfgRef = db.collection('adminConfig').doc('superusers');

  // merge email into emails array
  await db.runTransaction(async (tx) => {
    const doc = await tx.get(cfgRef);
    if (!doc.exists) {
      tx.set(cfgRef, { emails: [email] });
      console.log(`Added ${email} as the first superuser`);
      return;
    }
    const data = doc.data() || {};
    const emails = data.emails || [];
    if (!emails.includes(email)) {
      emails.push(email);
      tx.update(cfgRef, { emails });
      console.log(`Appended ${email} to superusers`);
    } else {
      console.log(`${email} is already a superuser`);
    }
  });

  console.log('Done');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
