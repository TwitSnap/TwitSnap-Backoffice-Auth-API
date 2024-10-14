import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {InvalidCredentialsFormat} from "../application/errors/InvalidCredentialsFormat";

@Entity("User")
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    private readonly id: string;

    @Column({ type: "varchar", nullable: false })
    private readonly email: string;

    @Column({ type: "varchar", nullable: false })
    private readonly password: string;

    constructor(email: string, password: string) {
        this.validateEmail(email);
        this.email = email;
        this.password = password;
    }

    public getId = (): string => this.id;

    public getPassword = (): string => this.password;

    /**
     * Validates the email format.
     * @param email The email to validate.
     * @throws InvalidCredentialsFormat if the email is invalid.
     */
    private validateEmail = (email: string): void => {
        if (!this.isValidEmail(email)) throw new InvalidCredentialsFormat("Invalid email.");
    }

    /**
     * Checks if the given string is a valid email.
     * @param email The string to check.
     * @returns True if the string is a valid email, false otherwise.
     */
    private isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}