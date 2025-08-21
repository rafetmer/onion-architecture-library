import { User } from '../entities/user.js'
import { IGenericRepository } from './i-generic.repository.js';

export interface IUserRepository extends IGenericRepository<User> {

    findBooksByAuthorName(author: string): Promise<String[]>;

    create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;

    update(id: number, data: Partial<Omit<User, 'id'>>): Promise<User>;
}