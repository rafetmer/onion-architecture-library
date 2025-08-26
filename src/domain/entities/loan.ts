export class Loan {
    id:number;
    userId:number;
    bookId:number;
    loanedAt:Date;
    returnedAt:Date | null;
    updatedAt:Date | null;

    constructor(
        id:number,
        userId:number,
        bookId:number,
        loanedAt:Date,
        returnedAt: Date | null,
        updatedAt:Date | null,
    ){
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.loanedAt = loanedAt;
        this.returnedAt = returnedAt;
        this.updatedAt = updatedAt;
        
    }
}