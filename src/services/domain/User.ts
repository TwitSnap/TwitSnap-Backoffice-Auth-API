import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity("User")
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    private readonly id: string;

    @Column({ type: "varchar", nullable: false })
    private readonly email: string;

    @Column({ type: "varchar", nullable: false })
    private readonly password: string;

    @Column({ type: "boolean", nullable: false })
    private isEmailVerified: boolean;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    public getId = (): string => this.id;

    public getPassword = (): string => this.password;
}