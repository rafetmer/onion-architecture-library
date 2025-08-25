import { Loan } from "../../domain/entities/loan.js";
import { ILoanRepository } from "../../domain/repositories/i-loan-repository.js";
import { IBookRepository } from "../../domain/repositories/i-book-repository.js";
import { IUserRepository } from "../../domain/repositories/i-user-repository.js";
import { BaseService } from "./base-service.js";

export type CreateLoanDto = Pick<Loan, 'userId' | 'bookId'>
export type UpdateLoanDto = Partial<CreateLoanDto>;

export class LoanService extends BaseService<Loan, CreateLoanDto, UpdateLoanDto>{

    constructor(private readonly loanRepository: ILoanRepository, 
                private readonly bookRepository: IBookRepository,
                private readonly userRepository: IUserRepository
            ){
        super(loanRepository);
    }


    async create(dto: CreateLoanDto): Promise<Loan>{
        const book = await this.bookRepository.findById(dto.bookId);
        const user = await this.userRepository.findById(dto.userId);
        
        if(!user) throw new Error(`User with ID ${dto.userId} not found. Cannot create loan `);
        if(!book) throw new Error(`Book with ID ${dto.bookId} not found. Cannot create loan `);
        
        if(book.status !== 'available') throw new Error(`Book '${book.title}' is not available for loan. Its status is '${book.status}'.`)

        await this.bookRepository.update(dto.bookId, { status: 'loaned'});
        const newLoan = await this.loanRepository.create({
            userId: dto.userId,
            bookId: dto.bookId,
        });

        return newLoan;
    
    }

    async update(id: number,dto: UpdateLoanDto): Promise<Loan>{
        const loan = await this.loanRepository.findById(id);
        if(!loan) throw new Error(`Loan with ID ${id} not found. Cannot update.`);
        if(loan.returnedAt) throw new Error(`This loan (ID: ${id} has already been closed and cannot be modified.`);

        // Not: Bu basit güncelleme, bir ödünç kaydındaki userId veya bookId'yi
        // değiştirmek gibi veri düzeltme senaryoları için kullanılabilir.
        // Ancak bu, ilgili kitapların 'status' alanını otomatik olarak DEĞİŞTİRMEZ.
        // Bu tür karmaşık bir işlem, genellikle mevcut ödünç işlemini iptal edip
        // yenisini oluşturarak yapılır.

        console.log(`Updating loan ${id}.`);
        return this.loanRepository.update(id, dto);

    }

    async delete(id: number): Promise<void> {
        const loan = await this.loanRepository.findById(id);
        if(!loan) throw new Error(`Loan with ID ${id} not found. Nothing to delete.`);

        if(!loan.returnedAt) await this.bookRepository.update(loan.bookId, {status: 'available'});
        await this.loanRepository.delete(id);
        console.log(`Loan with ID ${id} and its associations have been successfully deleted.`);
    }

    async returnBook(loanId: number): Promise<Loan> {
        const loan = await this.loanRepository.findById(loanId);
        if(!loan) throw new Error(`Loan with ID ${loanId} not found.`);
        if(loan.returnedAt) throw new Error(`Book for this loan (ID: ${loanId}) has already been returned.`);

        await this.bookRepository.update(loan.bookId, {status: 'available'});
        return this.loanRepository.markAsReturned(loanId);

    }

}   
