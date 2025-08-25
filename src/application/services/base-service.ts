import { IGenericRepository } from '../../domain/repositories/i-generic-repository.js';

export abstract class BaseService<T, CreateDto, UpdateDto> {
    
    constructor(private readonly genericRepository: IGenericRepository<T>) {}

    // --- GERÇEKTEN GENEL OLAN METOTLAR ---
    // Bu metotlar burada bir kez yazılır ve tüm alt sınıflar tarafından kullanılır.
    async getById(id: number): Promise<T | null> {
        return await this.genericRepository.findById(id);
    }

    async getAll(): Promise<T[]> {
        return await this.genericRepository.findAll();
    }

    async delete(id: number): Promise<void> {
        return await this.genericRepository.delete(id);
    }

    // --- ÖZEL OLMASI GEREKEN METOTLAR ---
    // Bu metotlar 'abstract' olarak tanımlanır. 
    // Yani, bu sınıfı miras alan her sınıf, bu metotları KENDİSİ YAZMAK ZORUNDADIR.
    abstract create(dto: CreateDto): Promise<T>;
    abstract update(id: number, dto: UpdateDto): Promise<T>;
}