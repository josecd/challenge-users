import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { generateSecurePassword } from '../../application/utils/user.utils';
import { FirebaseConfigService } from '../config/firebase.config';
import * as admin from 'firebase-admin';

@Injectable()
/**
 * Service for interacting with Firestore.
 */
export class FirebaseService {
    private isFirstSnapshot = true;

    constructor(private readonly firebaseConfigService: FirebaseConfigService) {
    }
    
    onModuleInit() {
        this.detectNewUser();
    }

    /**
     * Creates a new user in Firebase Authentication.
     * @param email - The email of the user.
     * @param password - The password of the user.
     * @param displayName - The display name of the user.
     * @returns A promise that resolves to the created user record.
     * @throws If there is an error creating the user.
     */
    async authCreateUser(user: User): Promise<admin.auth.UserRecord> {
        try {
            const userRecord = await this.firebaseConfigService.getDataAuth().createUser(user);
            return userRecord;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    
    /**
     * Updates a user in the Firebase authentication system.
     * @param user - The user object containing the updated user information.
     * @returns A Promise that resolves to the updated user record.
     * @throws If there is an error updating the user.
     */
    async authUpdateUser(user: User): Promise<admin.auth.UserRecord> {
        try {
            const userRecord = await this.firebaseConfigService.getDataAuth().updateUser(user.id ,user);
            return userRecord;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    /**
     * Deletes a user from Firebase Authentication.
     * 
     * @param uid - The unique identifier of the user to delete.
     * @throws If there is an error deleting the user.
     */
    async authDeleteUser(uid: string) {
        try {
            await this.firebaseConfigService.getDataAuth().deleteUser(uid);
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    
    /**
     * Adds a new document to a Firestore collection.
     * @param collection - The name of the collection.
     * @param data - The data to be added to the document.
     * @returns A promise that resolves to the added document.
     */
    public addDocument(collection: string, data: any): Promise<any> {
        return this.firebaseConfigService.getFirestore().collection(collection).add(data);
    }

    /**
     * Adds a new document to a Firestore collection with a specific ID.
     * @param collection - The name of the collection.
     * @param data - The data to be added to the document.
     * @returns A promise that resolves to the added document.
     */
    public addDocumentWithID(collection: string, data: any): Promise<any> {
        return this.firebaseConfigService.getFirestore().collection(collection).doc(data.id).set(data);
    }

    /**
     * Updates an existing document in a Firestore collection.
     * @param collection - The name of the collection.
     * @param data - The data to be updated in the document.
     * @returns A promise that resolves to the updated document.
     */
    public updateDocument(collection: string, data: any): Promise<any> {
        return this.firebaseConfigService.getFirestore().collection(collection).doc(data.id).update(data);
    }

    /**
     * Deletes a document from a Firestore collection.
     * @param collection - The name of the collection.
     * @param id - The ID of the document to be deleted.
     * @returns A promise that resolves when the document is deleted.
     */
    public deleteDocument(collection: string, id: string): Promise<any> {
        return this.firebaseConfigService.getFirestore().collection(collection).doc(id).delete();
    }

    /**
     * Retrieves a document from a Firestore collection.
     * @param collection - The name of the collection.
     * @param id - The ID of the document to be retrieved.
     * @returns A promise that resolves to the retrieved document.
     * @throws If the document does not exist.
     */
    public async getDocument(collection: string, id: string): Promise<any> {
        let doc = await this.firebaseConfigService.getFirestore().collection(collection).doc(id).get();
        if (!doc.exists) {
            throw new Error('No se encontró elemento');
        }
        return {
            ...doc.data(),
            id: doc.id,
        };
    }


    /**
     * Detect new users in the 'users' collection and update with a strong password.
     */
    private async detectNewUser() {
        const firestore = this.firebaseConfigService.getFirestore();
        firestore.collection('users').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (this.isFirstSnapshot) {
                    return;
                }
                if (change.type === 'added') {
                    console.log('Nuevo usuario detectado:', change.doc.data());
                    const user:any = change.doc.data();
                    if (!user.password) {
                        console.log("Sin password");
                        user.password = await generateSecurePassword();
                        await this.authUpdateUser(user);
                        await this.updateDocument('users', user);
                    }
                }
            });
            this.isFirstSnapshot = false;
        });
    }
}
