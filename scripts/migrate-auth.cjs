const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// --- Configuration ---
// PATHS
const SOURCE_KEY_PATH = path.resolve(__dirname, '../serviceAccountKey.json');
const DEST_KEY_PATH = path.resolve(__dirname, '../aghaniya-enterprises-llp-firebase-adminsdk-fbsvc-7da55bfd2b.json');

// --- PASSWORD HASH CONFIGURATION (REQUIRED FOR PASSWORD USERS) ---
// TODO: Get these from Firebase Console -> Authentication -> Users -> 3 dots -> Password hash parameters
// NOTE: Values are usually base64 encoded strings in the console.
const HASH_CONFIG = {
    algorithm: 'SCRYPT', // Standard for Firebase
    key: Buffer.from('REPLACE_WITH_KEY_FROM_CONSOLE', 'base64'), // "Signer key"
    saltSeparator: Buffer.from('REPLACE_WITH_SALT_SEPARATOR_FROM_CONSOLE', 'base64'),
    rounds: 8, // Replace with "Rounds"
    memoryCost: 14, // Replace with "Memory cost"
};
// -------------------------------------------------------------

// --- Validation ---
if (!fs.existsSync(SOURCE_KEY_PATH) || !fs.existsSync(DEST_KEY_PATH)) {
    console.error('❌ Service account keys not found.');
    process.exit(1);
}

// --- Initialization ---
const sourceApp = admin.initializeApp({
    credential: admin.credential.cert(require(SOURCE_KEY_PATH))
}, 'sourceAuth');

const destApp = admin.initializeApp({
    credential: admin.credential.cert(require(DEST_KEY_PATH))
}, 'destAuth');

const sourceAuth = sourceApp.auth();
const destAuth = destApp.auth();

async function migrateAuth() {
    try {
        console.log('⏳ Fetching users from SOURCE...');

        let users = [];
        let pageToken = undefined;

        do {
            const result = await sourceAuth.listUsers(1000, pageToken);
            users = users.concat(result.users);
            pageToken = result.pageToken;
        } while (pageToken);

        console.log(`✅ Found ${users.length} users.`);

        if (users.length === 0) {
            console.log('No users to migrate.');
            process.exit(0);
        }

        // Convert keys for import (Base64 buffers needed if passwordHash/salt provided)
        // Note: UserRecord passwordHash/salt are ALREADY base64 strings or buffers? 
        // They come as base64 encoded strings usually in listUsers, but importUsers expects buffers? 
        // Actually Admin SDK listUsers returns base64 strings for hash/salt. 
        // importUsers expects { passwordHash: Buffer, passwordSalt: Buffer }

        const userImportRecords = users.map(user => {
            const record = {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                phoneNumber: user.phoneNumber,
                displayName: user.displayName,
                photoURL: user.photoURL,
                disabled: user.disabled,
                metadata: user.metadata, // creationTime, lastSignInTime
                providerData: user.providerData, // Google, etc. linkings
            };

            if (user.passwordHash) {
                record.passwordHash = Buffer.from(user.passwordHash, 'base64');
            }
            if (user.passwordSalt) {
                record.passwordSalt = Buffer.from(user.passwordSalt, 'base64');
            }

            return record;
        });

        console.log('⏳ Importing users to DESTINATION...');

        // Process in batches of 1000
        const BATCH_SIZE = 1000;
        for (let i = 0; i < userImportRecords.length; i += BATCH_SIZE) {
            const batch = userImportRecords.slice(i, i + BATCH_SIZE);

            const importOptions = {
                hash: HASH_CONFIG
            };

            // Check if we strictly need hash config. If ANY user has password, we do.
            const hasPassword = batch.some(u => u.passwordHash);
            if (hasPassword) {
                if (HASH_CONFIG.key.toString().includes('REPLACE')) {
                    console.error('\n❌ ERROR: Password Hash Configuration missing!');
                    console.error('You have users with passwords, but you have not updated HASH_CONFIG in this script.');
                    console.error('Please open scripts/migrate-auth.cjs and update HASH_CONFIG with values from the Firebase Console.');
                    process.exit(1);
                }
            } else {
                // If no passwords in this batch, we might not need hash config options?
                // Actually safe to pass generic, or undefined if no passwords.
            }

            const result = await destAuth.importUsers(batch, hasPassword ? importOptions : undefined);

            console.log(`   Batch ${i / BATCH_SIZE + 1}: Success ${result.successCount}, Failed ${result.failureCount}`);

            if (result.failureCount > 0) {
                console.error('   Failures:', result.errors);
            }
        }

        console.log('✅ Auth Migration Completed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateAuth();
