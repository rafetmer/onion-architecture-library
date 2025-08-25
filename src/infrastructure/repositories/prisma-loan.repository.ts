import { Loan } from '../../domain/entities/loan.js';
import { ILoanRepository } from '../../domain/repositories/i-loan.repository.js';
import { PrismaGenericRepository } from './prisma-generic.repository.js';
import { Prisma } from '@prisma/client';

export class PrismaLoanRepository extends PrismaGenericRepository<Loan> implements ILoanRepository {
    constructor() {
        super('loan'); // 'loan' modeli ile çalışacağını belirtiyoruz
    }

async create(data: Pick<Loan, 'userId' | 'bookId'>): Promise<Loan> {

    const loanCreateInput: Prisma.LoanCreateInput = {
        user: {
            connect: { id: data.userId } // foreign keyi loana bağlıyoruz
        },
        book: {
            connect: { id: data.bookId }
        },
        returnedAt: null,
    };

    return this.prisma.loan.create({
        data: loanCreateInput
    });
};
    async update(id: number, data: Partial<Omit<Loan, 'id'>>): Promise<Loan>{

        const loanUpdateInput: Prisma.LoanUpdateInput = {
            user: {
                connect: { id: data.userId }
            },
            book: {
                connect: { id: data.bookId }
            },
            returnedAt: null,
        };

        return this.prisma.loan.update({where:{id}, data});
    }

    async findActiveLoansByUserId(userId: number): Promise<Loan[]> {
        return this.prisma.loan.findMany({
            where: {userId, returnedAt: null},
            include: {book: true} 
            // ilgili kitabın bilgilerini loanın 
            // icinde bulunan bookId sayesinde getiriyoruz
        });
    }

    async markAsReturned(loanId: number): Promise<Loan> {
        const loan = await this.findById(loanId);
        if (!loan) throw new Error(`Loan not found.`);
        if (loan.returnedAt) throw new Error(`Already returned.`);
        
        return this.prisma.loan.update({
            where: { id: loanId },
            data: { returnedAt: new Date() }
        });
    }
};