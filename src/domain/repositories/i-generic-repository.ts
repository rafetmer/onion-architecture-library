export interface IGenericRepository<T> {
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[] | null>;
    delete(id: number):Promise<void>;
 
    
    //create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    //update(id: number, data:Omit<T, 'id'>): Promise<T>;
}