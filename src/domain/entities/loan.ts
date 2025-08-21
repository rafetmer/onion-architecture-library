export class Loan {
    id:number;
    userId:number;
    bookId:number;
    loanedAt:Date;
    updatedAt:Date | null;

    constructor(
        id:number,
        userId:number,
        bookId:number,
        loanedAt:Date,
        updatedAt:Date | null,
    ){
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.loanedAt = loanedAt;
        this.updatedAt = updatedAt;
        
    }
}