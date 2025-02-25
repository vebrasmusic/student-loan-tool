import { LoanData } from "./types";
import { format } from "date-fns";

export function getProjectedLoan(loan: LoanData, numYears: number, payment = 0) {
    const monthlyInterestRate = loan.interestRate / 100 / 12;
    let thisMonth = format(new Date(), 'MMM');
    let numMonths = numYears * 12;
    let projected: {
        date: string,
        principal: number,
        interest: number,
        balance: number
    }[] = [];
    let principal = loan.principal;
    let interest = loan.interest;
    for (let i = 0; i <= numMonths; i++) {
        interest = interest + principal * monthlyInterestRate;
        if (payment >= interest){
            let diff = payment - interest;
            interest = 0;
            principal = principal - diff;
        } else {
            interest = interest - payment;
        }
        projected.push({
            date: format(new Date(new Date().setMonth(new Date().getMonth() + i)), 'MMM yy'),
            principal,
            interest,
            balance: principal + interest
        })
    }
    return projected;
}