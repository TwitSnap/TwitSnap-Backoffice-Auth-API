import { Encrypter } from "./Encrypter";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export class BcryptEncrypter implements Encrypter {
    /**
    * @inheritDoc
    */
    public encryptString = (string: string): string => {
        return bcrypt.hashSync(string, SALT_ROUNDS);
    }

    /**
     * @inheritDoc
     */
    public compareEncryptedString = (encrypted: string, nonEncrypted: string): boolean => {
        return bcrypt.compareSync(nonEncrypted, encrypted);
    }
}
