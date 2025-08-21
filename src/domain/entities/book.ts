export class Book {
    id: number;
    title: string;
    author: string;
    published: Date;
    createdAt: Date;
    updatedAt: Date;

    // Not: `loans` alanı genellikle entity'de doğrudan tutulmaz.
    // Bu ilişki, servisler veya repository'ler aracılığıyla yönetilir.
    // Ancak başlangıç için eklenebilir.
    // loans?: Loan[]; 

    constructor(
        id: number,
        title: string,
        author: string,
        published: Date,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.published = published;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}