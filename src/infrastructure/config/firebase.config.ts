import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
@Injectable()
export class FirebaseConfigService implements OnModuleInit {
    private firestore: admin.firestore.Firestore;
    private auth: admin.auth.Auth;

    /**
     * Initializes the Firebase service.
     * If the Firebase app is not already initialized, it initializes it using the provided credentials.
     */
    onModuleInit() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    privateKey: process.env.private_key.replace(/\\n/g, '\n'),
                    projectId: process.env.project_id,
                    clientEmail: process.env.client_email,
                }),
            });
            
            this.firestore = admin.firestore();
            this.auth = admin.auth();
            
            if (process.env.FUNCTIONS_EMULATOR == "true") {
                console.log("Using Firestore emulator");
                this.firestore.settings({
                    host: '127.0.0.1:30024',
                    ssl: false,
                });
                process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:30014';
            }
        }
    }

    /**
     * Returns the Firestore instance.
     * @returns The Firestore instance.
     */
    getFirestore() {
        return this.firestore;
    }

    /**
     * Returns the Auth instance.
     * @returns The Auth instance.
     * @throws If the Firebase app is not initialized.
     * @throws If the Auth instance is not initialized.
        */
    getDataAuth(): admin.auth.Auth {
        return this.auth;
    }

}