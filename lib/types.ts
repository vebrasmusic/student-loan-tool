export type LoanGroup = {
    [id: string]: LoanData
}

export type LoanData = {
    id: string,
    label: string,
    principal: number,
    balance: number,
    interest: number,
    interestRate: number
}

export type Loan = {
    id: string,
    label: string,
    principal: number,
    balance: number,
    interest: number,
    interestRate: number
}

