import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const onUserCreate = functions.auth.user().onCreate((user) => {
    const email = user.email;
    const displayName = user.displayName;
    const uid = user.uid;

    console.log(`Nuevo usuario creado: ${displayName} (${email}), UID: ${uid}`);
  
});