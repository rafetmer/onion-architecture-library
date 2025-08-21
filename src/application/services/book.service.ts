import { Book } from '../../domain/entities/book.js';
import { IBookRepository } from '../../domain/repositories/i-book-repository.js';

export type CreateBookDto = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookDto = Partial<CreateBookDto>;


export class BookService {
    constructor(private bookRepository: IBookRepository) {}

    async createBook(bookData: { title: string; author: string, published: Date }): Promise<Book> {
        return this.bookRepository.create(bookData);
    }

    async getBookById(id: number): Promise<Book | null> {
        return this.bookRepository.findById(id);
    }

    async getAllBooks(): Promise<Book[]> {
        return this.bookRepository.findAll();
    }

    async updateBook(id: number, bookData: Partial<Book>): Promise<Book | null> {
        return this.bookRepository.update(id, bookData);
    }

    async deleteBook(id: number): Promise<void> {
        return this.bookRepository.delete(id);
    }
}
