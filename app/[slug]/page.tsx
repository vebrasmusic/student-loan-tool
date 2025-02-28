"use client";
import { loansAtom } from "@/atoms/loans";
import { useAtomValue } from "jotai/react";
import { use, useMemo } from "react";
import AAreaChart from "@/components/charts/AreaChart";

export default function LoanSummaryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const loans = useAtomValue(loansAtom);

  const thisLoan = useMemo(() => {
    if (!loans) return;
    return loans[slug];
  }, [loans, slug]);

  return (
    <div className="flex flex-col gap-4 items-center">
      Current Balance: $
      {thisLoan?.balance.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      {thisLoan && <AAreaChart loanData={thisLoan} />}
    </div>
  );
}
