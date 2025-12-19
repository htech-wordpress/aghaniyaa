
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { createInterface } from 'readline';

// Config will be read from environment variables or pasted by user
// Since we are in a node script, we can't use import.meta.env directly without a bundler
// so we'll ask the user to input the Project ID for simplicity and attempt to use default credentials
// OR we guide them to use the client.

console.log("\n=== Aghaniya Superadmin Seeder ===\n");
console.log("This script helps you set the initial superadmin email.");
console.log("NOTE: This script uses the Firebase Client SDK. You must be authenticated to write to the config.");
console.log("Since 'node' cannot open a browser popup for Google Login easily, please follow these manual steps:\n");

console.log("1. Open your browser and navigate to the application (e.g., http://localhost:5173)");
console.log("2. Open the Developer Tools Console (F12 or Cmd+Option+J)");
console.log("3. Paste and run the following command to add 'your-email@gmail.com' as a superadmin:\n");

console.log(`
import('./src/lib/firebase.ts').then(async (m) => {
  try {
    // You must be logged in first! If not, log in via UI or use sign in.
    // If you are completely locked out, you can temporarily relax firestore.rules to allow write to adminConfig.
    await m.addSuperAdminEmail('TARGET_EMAIL_HERE'); 
    console.log('Success! Added superadmin.');
  } catch (e) {
    console.error('Failed:', e);
  }
});
`);

console.log("\n4. Replace 'TARGET_EMAIL_HERE' with your actual Google email address.\n");
console.log("Alternatively, if you have a service-account.json key, you can run a custom admin script.");
console.log("\nIf you are seeing 'Missing or insufficient permissions', you may need to:");
console.log("  a. Temporarily update firestore.rules to 'allow write: if true;' for match /adminConfig/superusers");
console.log("  b. Run the command in the browser.");
console.log("  c. Revert the rules.");
