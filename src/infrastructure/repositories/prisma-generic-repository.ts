import { PrismaClient } from '@prisma/client';
import { IGenericRepository } from '../../domain/repositories/i-generic-repository.js';

export abstract class PrismaGenericRepository<T> implements IGenericRepository<T> {
    
    protected readonly prisma: PrismaClient;
    private readonly model: any;

    constructor(modelName: keyof PrismaClient) {
        this.prisma = new PrismaClient();
        this.model = this.prisma[modelName]; 
        //Parametre olarak gelen modelName string'ini ('book' gibi) kullanarak,
        //prisma nesnesi üzerinden ilgili modele (prisma.book gibi) erişir ve bunu model değişkenine atar
    }

    async findById(id: number): Promise<T | null> {
        return this.model.findUnique({ where: { id } });
    }

    async findAll(): Promise<T[]> {
        return this.model.findMany();
    }

    async delete(id: number): Promise<void> {
        await this.model.delete({ where: { id } });
    }

}