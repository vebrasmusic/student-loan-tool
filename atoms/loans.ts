import { LoanGroup } from '@/lib/types';
import { atomWithStorage } from 'jotai/utils'

export const loansAtom = atomWithStorage<LoanGroup>('loans', {});