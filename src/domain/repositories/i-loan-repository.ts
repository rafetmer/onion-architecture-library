import { Loan } from '../entities/loan.js';

export interface ILoanRepository {

    findById(id: number): Promise<Loan | null>;

    findAll(): Promise<Loan[]>;

    create(data: Omit<Loan, 'id' | 'loanedAt'>): Promise<Loan>;

    update(id: number, data: Partial<Omit<Loan, 'id'>>): Promise<Loan>;

    delete(id: number): Promise<void>;

    findActiveLoansByUserId(userId: number): Promise<Loan[]>;
}