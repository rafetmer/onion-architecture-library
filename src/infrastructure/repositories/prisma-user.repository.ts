import { User } from '../../domain/entities/user.js';
import { IUserRepository } from '../../domain/repositories/i-user.repository.js';
import { PrismaGenericRepository } from './prisma-generic.repository.js';
import { Prisma } from '@prisma/client';

export class PrismaUserRepository extends PrismaGenericRepository<User> implements IUserRepository {
    
    constructor() {
        super('user');
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email }
        });
    }


    async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        // DTO'dan Prisma input tipine dönüşüm
        const userCreateInput: Prisma.UserCreateInput = {
            email: data.email,
            password: data.password,
            name: data.name
        };
        
        return this.prisma.user.create({
            data: userCreateInput
        });
    }

    async update(id: number, data: Partial<Omit<User, 'id'>>): Promise<User> {
        // Güncelleme verilerini Prisma input tipine dönüştürme
        const userUpdateInput: Prisma.UserUpdateInput = {};
        
        if (data.email !== undefined) userUpdateInput.email = data.email;
        if (data.password !== undefined) userUpdateInput.password = data.password;
        if (data.name !== undefined) userUpdateInput.name = data.name;
        
        return this.prisma.user.update({
            where: { id },
            data: userUpdateInput
        });
    }
}