import { Book } from '../entities/book.js'
import { IGenericRepository } from './i-generic.repository.js';

export interface IBookRepository  extends IGenericRepository<Book>{

    findBooksByAuthorName(author: string): Promise<String[]>; 

    create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book>;
    
    update(id: number, data:Omit<Book, 'id'>): Promise<Book>;
};
