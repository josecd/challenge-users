import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';

/**
 * Generates a secure password using bcrypt.
 * @returns A promise that resolves to the generated secure password.
 */
export async function generateSecurePassword(): Promise<string> {
    const password = generateRandomPassword();
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}

/**
 * Generates a random password of the specified length.
 * @param length The length of the password to generate. Default is 16.
 * @returns A randomly generated password.
 */
export function generateRandomPassword(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    return Array.from(randomBytes(length))
                .map(byte => chars[byte % chars.length])
                .join('');
}

/**
 * Compares a plain text password with a hashed password.
 * @param password - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A Promise that resolves to a boolean indicating whether the passwords match.
 */
export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}
