import { Book } from '../entities/book.js'
import { IGenericRepository } from './i-generic-repository.js';

export interface IBookRepository  extends IGenericRepository<Book>{

    findBooksByAuthor(author: string): Promise<Book[]>; 
    
    findAvailableBooks(): Promise<Book[]>;

    create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Book>;
    
    update(id: number, data:Partial<Omit<Book, 'id'>>): Promise<Book>;
};
