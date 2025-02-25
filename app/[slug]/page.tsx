'use client'
import { loansAtom } from "@/atoms/loans";
import { useAtomValue } from "jotai/react";
import { use, useEffect, useMemo } from "react";
import { focusAtom } from "jotai-optics";
import { getProjectedLoan } from "@/lib/services";
import AAreaChart from "@/components/charts/AreaChart";

export default function LoanSummaryPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = use(params);
    const loans = useAtomValue(loansAtom);

    const thisLoan = useMemo(() => {
        if (!loans) return;
        return loans[slug];
    }, [loans, slug])

    const projections = useMemo(() => {
        if (!thisLoan) return;
        return getProjectedLoan(thisLoan, 10, 200)
    }, [thisLoan])

    return (
        <div className="flex flex-col gap-4 items-center">
            Current: {thisLoan?.balance} {thisLoan?.interest}
            {thisLoan && (
                <AAreaChart loanData={thisLoan} />
            )}
        </div>
    )
}