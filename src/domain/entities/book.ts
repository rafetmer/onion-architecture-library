export class Book {
    id: number;
    title: string;
    author: string;
    published: Date;
    status: 'available' | 'loaned';
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        title: string,
        author: string,
        published: Date,
        status: 'available'| 'loaned',
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.published = published;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}