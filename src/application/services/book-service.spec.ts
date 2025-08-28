/* 
  Test stack note:
  - This test suite is written for the existing test framework discovered in the repository (Jest or Vitest).
  - It only uses common APIs (describe, it/test, expect, beforeEach, afterEach) and a fallback for mock functions
    so it works with Jest (jest.fn) or Vitest (vi.fn).
*/

import { Book } from '../../domain/entities/book.js';
import { IBookRepository } from '../../domain/repositories/i-book-repository.js';
import { BookService, CreateBookDto, UpdateBookDto } from './book-service.js';

// Small compatibility layer for jest/vi
const mockFn = (globalThis as any).vi?.fn ?? (globalThis as any).jest?.fn;
if (!mockFn) {
  throw new Error("No test mock function found. Expected Jest (jest.fn) or Vitest (vi.fn).");
}
const resetAllMocks = () => {
  if ((globalThis as any).vi?.restoreAllMocks) (globalThis as any).vi.restoreAllMocks();
  if ((globalThis as any).jest?.restoreAllMocks) (globalThis as any).jest.restoreAllMocks();
};

describe('BookService', () => {
  let repo: jest.Mocked<IBookRepository> | any;
  let service: BookService;

  const now = new Date();

  const factoryBook = (overrides: Partial<Book> = {}): Book => ({
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    publishedYear: 2008 as any, // adapt to entity fields
    status: 'AVAILABLE' as any,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });

  beforeEach(() => {
    // Build a typed mock for repository
    repo = {
      create: mockFn(),
      update: mockFn(),
      findById: mockFn(),
      findBooksByAuthor: mockFn(),
      findAvailableBooks: mockFn(),
      getAll: mockFn?.(),   // BaseService might rely on repository's methods; safe no-op mocks
      deleteById: mockFn?.(),
    } as Partial<IBookRepository> as any;

    service = new BookService(repo);
    // Silence and spy on console logs to avoid noisy test output
    mockFn === (globalThis as any).vi?.fn
      ? (globalThis as any).vi.spyOn(console, 'log').mockImplementation(() => {})
      : (globalThis as any).jest?.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    resetAllMocks();
  });

  describe('create', () => {
    it('creates a new book when no duplicate title exists for the same author (happy path)', async () => {
      const dto: CreateBookDto = {
        title: 'Domain-Driven Design',
        author: 'Eric Evans',
        publishedYear: 2003 as any,
      } as any;

      // No existing books for that author
      repo.findBooksByAuthor.mockResolvedValueOnce([]);
      const created = factoryBook({ id: 42, title: dto.title, author: dto.author });
      repo.create.mockResolvedValueOnce(created);

      const result = await service.create(dto);

      expect(repo.findBooksByAuthor).toHaveBeenCalledTimes(1);
      expect(repo.findBooksByAuthor).toHaveBeenCalledWith(dto.author);
      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });

    it('throws if a book with the same title (case-insensitive) already exists for the author', async () => {
      const dto: CreateBookDto = {
        title: 'Refactoring',
        author: 'Martin Fowler',
        publishedYear: 1999 as any,
      } as any;

      // Existing book with same title varying case
      repo.findBooksByAuthor.mockResolvedValueOnce([
        factoryBook({ title: 'REFACTORING', author: 'Martin Fowler' }),
      ]);

      await expect(service.create(dto)).rejects.toThrow(`'${dto.title}' by ${dto.author} already exists.`);

      expect(repo.findBooksByAuthor).toHaveBeenCalledWith(dto.author);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('does not consider books of other authors as duplicates', async () => {
      const dto: CreateBookDto = {
        title: 'Patterns of Enterprise Application Architecture',
        author: 'Martin Fowler',
        publishedYear: 2002 as any,
      } as any;

      // Same title but different author should be allowed
      repo.findBooksByAuthor.mockResolvedValueOnce([
        factoryBook({ title: dto.title, author: 'Another Author' }),
      ]);
      const created = factoryBook({ id: 7, title: dto.title, author: dto.author });
      repo.create.mockResolvedValueOnce(created);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('throws when the book does not exist', async () => {
      const id = 999;
      const dto: UpdateBookDto = { title: 'New Title' } as any;

      repo.findById.mockResolvedValueOnce(undefined);

      // Note: The service includes a leading single-quote in the message per implementation.
      await expect(service.update(id, dto))
        .rejects
        .toThrow(`'Book with ID:${id} doesn't exists. Update failed.`);

      expect(repo.findById).toHaveBeenCalledWith(id);
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('updates and returns the book when it exists (happy path)', async () => {
      const id = 1;
      const dto: UpdateBookDto = { title: 'Clean Code (2nd Edition)' } as any;
      const existing = factoryBook({ id, title: 'Clean Code' });

      repo.findById.mockResolvedValueOnce(existing);
      const updated = { ...existing, title: dto.title, updatedAt: new Date(now.getTime() + 1000) };
      repo.update.mockResolvedValueOnce(updated);

      const result = await service.update(id, dto);

      expect(repo.findById).toHaveBeenCalledWith(id);
      expect(repo.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('findBooksByAuthor', () => {
    it('returns books from repository', async () => {
      const author = 'Kent Beck';
      const books = [
        factoryBook({ id: 10, author, title: 'Test-Driven Development' }),
        factoryBook({ id: 11, author, title: 'Implementation Patterns' }),
      ];

      repo.findBooksByAuthor.mockResolvedValueOnce(books);

      const result = await service.findBooksByAuthor(author);

      expect(repo.findBooksByAuthor).toHaveBeenCalledWith(author);
      expect(result).toEqual(books);
    });

    it('returns empty array when repository returns none', async () => {
      const author = 'Unknown Author';
      repo.findBooksByAuthor.mockResolvedValueOnce([]);

      const result = await service.findBooksByAuthor(author);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('findAvailableBooks', () => {
    it('returns only available books as per repository', async () => {
      const available = [
        factoryBook({ id: 2, status: 'AVAILABLE' as any }),
        factoryBook({ id: 3, status: 'AVAILABLE' as any }),
      ];

      repo.findAvailableBooks.mockResolvedValueOnce(available);

      const result = await service.findAvailableBooks();

      expect(repo.findAvailableBooks).toHaveBeenCalledTimes(1);
      expect(result).toEqual(available);
    });
  });
});