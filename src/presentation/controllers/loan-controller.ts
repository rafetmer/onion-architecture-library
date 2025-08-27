import { Request, Response } from "express";
import { LoanService, CreateLoanDto, UpdateLoanDto } from "../../application/services/loan-service.js";
import { Loan } from "../../domain/entities/loan.js";
import { BaseController } from "./base-controller.js";

export class LoanController extends BaseController<Loan, CreateLoanDto, UpdateLoanDto> {
    protected readonly service: LoanService;

    constructor(loanService: LoanService) {
        super();
        this.service = loanService;
    }

async create(req: Request, res: Response): Promise<void> {
        try {

            const { bookId } = req.body as { bookId: number };
            const userId = (req as any).user?.userId;
            if (!userId || !bookId) {
                res.status(400).json({ message: 'userId ve bookId gereklidir.' });
                return;
            }
            const createLoanDto: CreateLoanDto = { userId, bookId };
            const newLoan = await this.service.create(createLoanDto);
            
            res.status(201).json(newLoan);

        } catch (error) {
            const message = error instanceof Error ? error.message : "Ödünç alma işlemi başarısız";
            res.status(400).json({ error: message });
        }
    }

    async returnBook(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id)    ;
            if (isNaN(id)) {
                res.status(400).json({ message: 'Geçersiz kitap ID formatı' });
                return;
            }

            const result = await this.service.returnBook(id);
            if (!result) {
                res.status(404).json({ message: `ID ${id} olan kitap bulunamadı` });
                return;
            }

            res.status(200).json({ message: 'Kitap başarıyla iade edildi' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
            res.status(500).json({ error: message });
        }
    }

};  