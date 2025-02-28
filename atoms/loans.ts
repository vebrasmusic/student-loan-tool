import { LoanGroup, LoanPaymentGroup } from "@/lib/types";
import { atomWithStorage } from "jotai/utils";

export const loansAtom = atomWithStorage<LoanGroup>("loans", {});
export const paymentsAtom = atomWithStorage<LoanPaymentGroup>("payments", {});
