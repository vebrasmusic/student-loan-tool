export type LoanGroup = {
    [id: string]: LoanData
}

export type LoanData = {
    id: string,
    principal: number,
    balance: number,
    interest: number,
    interestRate: number
}

export type Loan = {
    id: string,
    principal: number,
    balance: number,
    interest: number,
    interestRate: number
}

