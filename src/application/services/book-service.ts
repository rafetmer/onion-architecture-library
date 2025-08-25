import { Book } from '../../domain/entities/book.js';
import { IBookRepository } from '../../domain/repositories/i-book-repository.js';
import { BaseService } from './base-service.js';

export type CreateBookDto = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookDto = Partial<CreateBookDto>;

export class BookService extends BaseService<Book, CreateBookDto, UpdateBookDto> {
    
    constructor(private readonly bookRepository: IBookRepository) {
        super(bookRepository); // 'super' ile üst sınıfın constructor'ını çağırırız.
    }

    // getById, getAll, deleteById metotları base serviceden alınıyor

    async create(dto: CreateBookDto): Promise<Book> {   // aynı author aynı isme sahip 2 kitaba sahip olamaz
        const existingBooksByAuthor = await this.bookRepository.findBooksByAuthor(dto.author);
        const bookAlreadyExists = existingBooksByAuthor.some(
            book => book.title.toLowerCase() === dto.title.toLowerCase()
        );
        if(bookAlreadyExists){
            throw new Error(`'${dto.title}' by ${dto.author} already exists.`);
        }
        console.log('Creating a new book with specific logic...');
        return this.bookRepository.create(dto);
    }

    async update(id: number, dto: UpdateBookDto): Promise<Book> {
        const book = await this.bookRepository.findById(id);
        if(!book){
           throw new Error(`'Book with ID:${id} doesn't exists. Update failed.`);
        }
        else{
            console.log(`Updating book ${id} with specific logic.`);
            return this.bookRepository.update(id, dto);
        }
    }

    async findBooksByAuthor(author: string): Promise<Book[]> {
        const books = await this.bookRepository.findBooksByAuthor(author);
        return books;
    }

    async findAvailableBooks(): Promise<Book[]> {
        const availableBooks = await this.bookRepository.findAvailableBooks();
        return availableBooks;
    }
}