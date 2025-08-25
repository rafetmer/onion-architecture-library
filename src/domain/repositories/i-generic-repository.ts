export interface IGenericRepository<T> {
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    delete(id: number):Partial<void>;
 
    
    //create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    //update(id: number, data:Omit<T, 'id'>): Promise<T>;
}