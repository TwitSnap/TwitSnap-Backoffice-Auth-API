import {Column, Entity, PrimaryColumn, Unique} from "typeorm";

@Entity("User")
@Unique(["email"])
export class User {
    @PrimaryColumn("uuid", { default: () => "uuid_generate_v4()" })
    private id: string;                  // ? Se mantiene publico para que typeorm pueda acceder a el.

    @Column({ type: "varchar", nullable: false })
    private readonly email: string;

    @Column({ type: "varchar", nullable: false })
    private readonly password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    public getId = (): string => this.id;

    public getPassword = (): string => this.password;
}