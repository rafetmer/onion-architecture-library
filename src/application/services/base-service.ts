import { IGenericRepository } from '../../domain/repositories/i-generic-repository.js';

export abstract class BaseService<T, CreateDto, UpdateDto> {
    
    constructor(private readonly genericRepository: IGenericRepository<T>) {}

    async findById(id: number): Promise<T | null> {
        return await this.genericRepository.findById(id);
    }

    async findAll(): Promise<T[]> {
        const items = await this.genericRepository.findAll();
        return items || [];
    }

    async delete(id: number): Promise<void> {
        return await this.genericRepository.delete(id);
    }

    abstract create(dto: CreateDto): Promise<T>;
    abstract update(id: number, dto: UpdateDto): Promise<T>;
}