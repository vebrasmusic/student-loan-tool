'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Updater, useImmer } from "use-immer";
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Loan, LoanGroup, LoanData } from "@/lib/types";
import { useImmerAtom } from 'jotai-immer'
import { loansAtom } from "@/atoms/loans";
import { useRouter } from "next/navigation";
import { H1 } from "@/components/typography/h1";

export default function Loans() {

  const router = useRouter();
  const { toast } = useToast();
  const [parent] = useAutoAnimate();

  const [loans, setLoans] = useImmerAtom(loansAtom);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [stagingLoan, setStagingLoan] = useImmer<Loan | null>(null);

  function handleEditExistingLoan() {
    setLoans((draft) => {
      if (!editingId || !stagingLoan) return draft;
      if (stagingLoan.id !== editingId) {
        delete draft[editingId];
      }
      draft[stagingLoan.id] = {
        id: stagingLoan.id,
        principal: stagingLoan.principal,
        balance: Number((stagingLoan.balance > 0 ? 
          stagingLoan.balance : 
          stagingLoan.principal + stagingLoan.interest).toFixed(2)),
        interest: stagingLoan.interest,
        interestRate: stagingLoan.interestRate
      };
    });
    setStagingLoan(null);
    setEditingId(null);
  }

  function handleAddNewLoan() {
    if (!stagingLoan) return;
    setLoans((draft) => {
      draft[stagingLoan.id] = {
        id: stagingLoan.id,
        principal: stagingLoan.principal,
        balance: Number((stagingLoan.balance > 0 ? 
          stagingLoan.balance : 
          stagingLoan.principal + stagingLoan.interest).toFixed(2)),
        interest: stagingLoan.interest,
        interestRate: stagingLoan.interestRate
      }
    })
    setStagingLoan(null);
  }

  function handleCreateNewLoan() {
    setStagingLoan({
      id: '',
      principal: 0,
      balance: 0,
      interest: 0,
      interestRate: 0
    })
  }

  function handleCancel() {
    setStagingLoan(null);
    setEditingId(null);
  }

  function handleSaveChanges() {
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <H1>Loans</H1>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 overflow-auto h-[600px]" ref={parent}>
          {Object.entries(loans).map(([loanId, loanData]) => (
            editingId === loanId ? (
              <LoanForm
                key={`editing-${loanId}`}
                stagingLoan={stagingLoan}
                editingId={editingId}
                setEditingId={setEditingId}
                setStagingLoan={setStagingLoan}
                loanId={loanId}
                loanData={loanData}
                setLoans={setLoans}
              />
            ) : (
              <LoanForm
                key={loanId}
                stagingLoan={stagingLoan}
                editingId={editingId}
                setEditingId={setEditingId}
                setStagingLoan={setStagingLoan}
                loanId={loanId}
                loanData={loanData}
                setLoans={setLoans}
              />
            )
          ))}
          {stagingLoan && !editingId &&
            <LoanForm
              stagingLoan={stagingLoan}
              loanId={stagingLoan.id}
              loanData={stagingLoan}
              editingId={editingId}
              setEditingId={setEditingId}
              setStagingLoan={setStagingLoan}
              setLoans={setLoans}
            />
          }
        </div>
        <div className="flex flex-row gap-2 justify-start">
          {editingId ? (
            <Button onClick={handleEditExistingLoan}>
              Save changes
            </Button>
          ) : stagingLoan ? (
            <Button onClick={handleAddNewLoan}>
              Add loan
            </Button>
          ) : (
            <Button
              onClick={handleCreateNewLoan}
              disabled={!!stagingLoan || !!editingId}>
              Create new loan
            </Button>
          )}
          <Button
            onClick={handleCancel}
            disabled={!editingId && !stagingLoan}>
            Cancel
          </Button>
        </div>
        <Button className="w-fit" onClick={handleSaveChanges}>
          Save changes
        </Button>
      </div>
    </div>
  );
}

interface LoanFormProps {
  loanId: string,
  loanData: LoanData,
  setLoans: (f: (draft: LoanGroup) => void | LoanGroup) => void  // Updated type
  editingId: string | null
  setEditingId: (id: string | null) => void
  setStagingLoan: Updater<Loan | null>
  stagingLoan: Loan | null
}
function LoanForm({ loanId, loanData, editingId, setEditingId, setStagingLoan, stagingLoan, setLoans }: LoanFormProps) {

  function handleInputChange<K extends keyof Loan>(newValue: Loan[K], type: K) {
    setStagingLoan((draft) => {
      if (!draft) return;
      draft[type] = newValue;
    })
  }

  const inputs: LoanInputProps[] = [
    {
      label: "ID",
      type: "text",
      defaultValue: loanId,
      placeholder: "Enter loan ID",
      onChange: (e) => handleInputChange(e.target.value, "id")
    },
    {
      label: "Principal",
      type: "number",
      defaultValue: loanData.principal,
      placeholder: "Enter principal amount",
      onChange: (e) => handleInputChange(Number(e.target.value), "principal")
    },
    {
      label: "Interest",
      type: "number",
      defaultValue: loanData.interest,
      placeholder: "Enter interest amount",
      onChange: (e) => handleInputChange(Number(e.target.value), "interest")
    },
    {
      label: "Interest Rate",
      type: "number",
      defaultValue: loanData.interestRate,
      placeholder: "Enter interest rate",
      onChange: (e) => handleInputChange(Number(e.target.value), "interestRate")
    },
    {
      label: "Balance",
      type: "number",
      defaultValue: loanData.balance,
      placeholder: "Enter balance amount",
      onChange: (e) => handleInputChange(Number(e.target.value), "balance")
    },
  ]

  const isEditable = (loanId === stagingLoan?.id) || (loanId === editingId);

  return (
    <div className="flex flex-row gap-4 items-end">
      {inputs.map((input) => (
        <LoanInput
          disabled={!isEditable}
          key={input.label}
          label={input.label}
          type={input.type}
          defaultValue={input.defaultValue}
          placeholder={input.placeholder}
          onChange={input.onChange}
        />
      ))}
      <Button
        size="icon"
        disabled={!!editingId || !!stagingLoan}
        onClick={() => {
          setEditingId(loanId);
          setStagingLoan({
            id: loanId,
            principal: loanData.principal,
            balance: loanData.balance,
            interest: loanData.interest,
            interestRate: loanData.interestRate
          });
        }}>
        <Pencil />
      </Button>
      <Button
        size="icon"
        disabled={!!editingId || !!stagingLoan}
        onClick={() => {
          setLoans((draft) => {
            delete draft[loanId];
          });
        }}>
        <Trash />
      </Button>
    </div>
  )
}

interface LoanInputProps {
  label: string
  defaultValue?: string | number
  type?: "number" | "text"
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}
function LoanInput({ label, type = "text", defaultValue, onChange, placeholder, disabled = false }: LoanInputProps) {

  return (
    <div className="flex flex-col gap-0">
      <Label className="text-sm font-thin text-muted-foreground">{label}</Label>
      <Input disabled={disabled} defaultValue={defaultValue} onChange={onChange} type={type} placeholder={placeholder} />
    </div>
  )
}