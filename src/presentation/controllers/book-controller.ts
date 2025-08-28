import { Request, Response } from 'express';
import { BookService, CreateBookDto, UpdateBookDto } from '../../application/services/book-service.js';
import { BaseController } from './base-controller.js';
import { Book } from '../../domain/entities/book.js';

export class BookController extends BaseController<Book, CreateBookDto, UpdateBookDto> {
    protected readonly service: BookService;

    constructor(bookService: BookService) {
        super();
        this.service = bookService;
    }

    async findBooksByAuthor(req: Request, res: Response): Promise<void> {
        try {
            const author = String(req.params.author);
            if (!author) {
            res.status(400).json({ message: 'Geçersiz yazar ID formatı' });
                return;
            }   

            const books = await this.service.findBooksByAuthor(author);
            if (!books || books.length === 0) {
                res.status(404).json({ message: ` Yazarı ${author} olan kitap bulunamadı` });
                return;
            }

            res.status(200).json(books);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
            res.status(500).json({ error: message });
        }
    }

    // findAvailableBooks

    
}