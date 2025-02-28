export type LoanGroup = {
  [id: string]: LoanData;
};

export type LoanPaymentGroup = {
  [loanId: string]: LoanPayment;
};

export type LoanData = {
  id: string;
  label: string;
  principal: number;
  balance: number;
  interest: number;
  interestRate: number;
};

export type Loan = {
  id: string;
  label: string;
  principal: number;
  balance: number;
  interest: number;
  interestRate: number;
};

export type LoanPayment = {
  loanId: string;
  minimum: number;
  overpayment?: number;
};
