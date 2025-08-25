export class User {
    id: number;
    email: string;
    password: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date | null;

    constructor(
        id:number,
        email:string,
        password:string,
        name:string | null,
        createdAt:Date,
        updatedAt:Date | null
    ){
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}