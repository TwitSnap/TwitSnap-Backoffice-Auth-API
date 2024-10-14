export interface Encrypter{
    /**
    * Encrypts a string
    * @param string string to encrypt
    * @returns encrypted string
    */
    encryptString(string: string): string;

    /**
     * Compares an encrypted string with a non encrypted string.
     * @returns true if the non encrypted string is the same as the encrypted string
     * @param encrypted
     * @param nonEncrypted
     */
    compareEncryptedString(encrypted: string, nonEncrypted: string): boolean;
}