/* 
  Testing library/framework: 
  - This test file uses the standard Jest-style API (describe/it/expect and jest.fn()).
  - If your project uses Vitest, this file remains compatible by aliasing:
      import { describe, it, expect, vi as jest } from 'vitest';
    and replacing jest.fn with vi.fn if needed.
*/

import { BaseService } from './base-service.js';

// Define the minimal shape for IGenericRepository to mock against.
// If the real path/types are available, prefer importing them:
// import { IGenericRepository } from '../../domain/repositories/i-generic-repository.js';
type IGenericRepository<T> = {
  findById: (id: number) => Promise<T | null>;
  findAll: () => Promise<T[]>;
  delete: (id: number) => Promise<void>;
};

// A simple entity type for tests
type Entity = { id: number; name: string };

// Concrete subclass to instantiate BaseService for testing non-abstract methods.
class TestService extends BaseService<Entity, Partial<Entity>, Partial<Entity>> {
  constructor(repo: IGenericRepository<Entity>) {
    super(repo);
  }
  // Dummy implementations – not the focus of these tests.
  async create(dto: Partial<Entity>): Promise<Entity> {
    return { id: 1, name: dto.name ?? 'created' };
  }
  async update(id: number, dto: Partial<Entity>): Promise<Entity> {
    return { id, name: dto.name ?? 'updated' };
  }
}

// If using Vitest, uncomment the following lines:
// import { describe, it, expect, vi as jest, beforeEach } from 'vitest';
// Otherwise, with Jest, keep as-is:
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('BaseService', () => {
  let repo: jest.Mocked<IGenericRepository<Entity>>;
  let service: TestService;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    service = new TestService(repo);
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('returns the entity when repository resolves', async () => {
      const entity = { id: 42, name: 'Douglas' };
      repo.findById.mockResolvedValueOnce(entity);

      const result = await service.findById(42);

      expect(repo.findById).toHaveBeenCalledTimes(1);
      expect(repo.findById).toHaveBeenCalledWith(42);
      expect(result).toEqual(entity);
    });

    it('returns null when repository resolves to null', async () => {
      repo.findById.mockResolvedValueOnce(null);

      const result = await service.findById(999);

      expect(repo.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });

    it('forwards unusual id values to repository (e.g., 0, negative)', async () => {
      repo.findById.mockResolvedValueOnce(null);
      await service.findById(0);
      expect(repo.findById).toHaveBeenCalledWith(0);

      repo.findById.mockResolvedValueOnce(null);
      await service.findById(-1);
      expect(repo.findById).toHaveBeenCalledWith(-1);
    });

    it('propagates errors thrown by the repository', async () => {
      const err = new Error('db down');
      repo.findById.mockRejectedValueOnce(err);

      await expect(service.findById(1)).rejects.toThrow('db down');
      expect(repo.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('returns an empty array when repository returns none', async () => {
      repo.findAll.mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('returns a list of entities when repository resolves', async () => {
      const items = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ];
      repo.findAll.mockResolvedValueOnce(items);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(items);
    });

    it('propagates errors from repository', async () => {
      repo.findAll.mockRejectedValueOnce(new Error('timeout'));

      await expect(service.findAll()).rejects.toThrow('timeout');
      expect(repo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('calls repository.delete with the provided id', async () => {
      repo.delete.mockResolvedValueOnce();

      await service.delete(7);

      expect(repo.delete).toHaveBeenCalledTimes(1);
      expect(repo.delete).toHaveBeenCalledWith(7);
    });

    it('allows deleting id 0 (forwarded as-is)', async () => {
      repo.delete.mockResolvedValueOnce();

      await service.delete(0);

      expect(repo.delete).toHaveBeenCalledWith(0);
    });

    it('propagates errors thrown by repository.delete', async () => {
      const err = new Error('permission denied');
      repo.delete.mockRejectedValueOnce(err);

      await expect(service.delete(5)).rejects.toThrow('permission denied');
      expect(repo.delete).toHaveBeenCalledWith(5);
    });
  });
});