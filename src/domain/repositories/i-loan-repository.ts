import { Loan } from '../entities/loan.js';
import { IGenericRepository } from './i-generic.repository.js';

export interface ILoanRepository extends IGenericRepository<Loan>{

    create(data: Pick<Loan, 'userId' | 'bookId'>): Promise<Loan>;
    
    update(id: number, data: Partial<Omit<Loan, 'id'>>): Promise<Loan>;

    findActiveLoansByUserId(userId: number): Promise<Loan[]>;
}