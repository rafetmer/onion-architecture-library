import { Book } from '../../domain/entities/book.js';
import { IBookRepository } from '../../domain/repositories/i-book.repository.js';
import { PrismaGenericRepository } from './prisma-generic.repository.js';
import { Prisma } from '@prisma/client';

export class PrismaBookRepository extends PrismaGenericRepository<Book> implements IBookRepository {
    
    constructor() {
        // Üst sınıfın constructor'ına hangi Prisma modeliyle çalışacağını söylüyoruz: 'book'
        super('book');
    }

    // --- Sadece IBookRepository'ye özel metotların implementasyonu ---
    // findById, findAll, delete metotları PrismaGenericRepository'den miras alındığı için
    // burada tekrar yazılmasına GEREK YOKTUR.

    async findAvailableBooks(): Promise<Book[]> {
        return this.prisma.book.findMany({
            where: { status: 'available' }
        });
    }

    async findBooksByAuthor(author: string): Promise<Book[]> {
        // 'insensitive' modu büyük/küçük harf duyarsız arama sağlar.
        return this.prisma.book.findMany({
            where: { 
                author: { 
                    contains: author, 
                    mode: 'insensitive' // Büyük/küçük harf duyarsız arama
                } 
            }
        });
    }


    async create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
        const bookCreateInput: Prisma.BookCreateInput = {
            title: data.title,
            author: data.author,
            published: data.published,
            status: 'available' // Yeni kitaplar varsayılan olarak 'available' olur
        };
        return this.prisma.book.create({
            data: bookCreateInput
        });
    }

    async update(id: number, data: Partial<Omit<Book, 'id'>>): Promise<Book> {

        const bookUpdateInput: Prisma.BookUpdateInput = {};

        if (data.title !== undefined) bookUpdateInput.title = data.title;
        if (data.author !== undefined) bookUpdateInput.author = data.author;
        if (data.published !== undefined) bookUpdateInput.published = data.published;
        if (data.status !== undefined) bookUpdateInput.status = data.status;

        return this.prisma.book.update({where: { id }, data: bookUpdateInput});
    }
}