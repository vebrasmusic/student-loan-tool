'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Updater, useImmer } from "use-immer";
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Loan {
  id: string,
  principal: number,
  balance: number,
  interest: number,
  interestRate: number
}

export default function Home() {

  const [loans, setLoans] = useImmer<Loan[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stagingLoan, setStagingLoan] = useImmer<Loan | null>(null);

  function handleEditExistingLoan(){
    setLoans((draft) => {
      const index = draft.findIndex((loan) => loan.id === editingId);
      if (index !== -1 && stagingLoan) {
        draft[index] = stagingLoan;
      }
    })
    setStagingLoan(null);
    setEditingId(null);
  }

  function handleAddNewLoan(){
    if (!stagingLoan) return;
    setLoans((draft) => {
      draft.push(stagingLoan);
    })
    setStagingLoan(null);
  }

  function handleCreateNewLoan(){
    setStagingLoan({
      id: '',
      principal: 0,
      balance: 0,
      interest: 0,
      interestRate: 0
    })
  }

  function handleCancel(){
    setStagingLoan(null);
    setEditingId(null);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Student Loan Tool</h1>
      <p className="text-lg">This is a tool to help you calculate your student loan repayments.</p>
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {loans.map((loan) => (
            editingId === loan.id ? (
              <LoanForm
                key={`editing-${loan.id}`}
                stagingLoan={stagingLoan}
                editingId={editingId}
                setEditingId={setEditingId}
              setStagingLoan={setStagingLoan}
              loan={loan}
              setLoans={setLoans}
            />
          ) : (
            <LoanForm
              key={loan.id}
              stagingLoan={stagingLoan}
              editingId={editingId}
              setEditingId={setEditingId}
              setStagingLoan={setStagingLoan}
              loan={loan}
              setLoans={setLoans}
            />
            )
          ))}
        </AnimatePresence>
          {stagingLoan && !editingId && 
            <LoanForm 
            stagingLoan={stagingLoan}
            loan={stagingLoan} 
            editingId={editingId} 
            setEditingId={setEditingId} 
            setStagingLoan={setStagingLoan}
            setLoans={setLoans}
            />
          }
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
      </div>
    </div>
  );
}

interface LoanFormProps {
  loan: Loan,
  setLoans: Updater<Loan[]>
  editingId: string | null
  setEditingId: (id: string | null) => void
  setStagingLoan: Updater<Loan | null>
  stagingLoan: Loan | null
}
function LoanForm({loan, editingId, setEditingId, setStagingLoan, stagingLoan, setLoans}: LoanFormProps){

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
      defaultValue: loan.id,
      placeholder: "Enter loan ID",
      onChange: (e) => handleInputChange(e.target.value, "id")
    },
    {
      label: "Principal",
      type: "number",
      defaultValue: loan.principal,
      placeholder: "Enter principal amount",
      onChange: (e) => handleInputChange(Number(e.target.value), "principal")
    },
    {
      label: "Balance",
      type: "number",
      defaultValue: loan.balance,
      placeholder: "Enter balance amount",
      onChange: (e) => handleInputChange(Number(e.target.value), "balance")
    },
    {
      label: "Interest",
      type: "number",
      defaultValue: loan.interest,
      placeholder: "Enter interest amount",
      onChange: (e) => handleInputChange(Number(e.target.value), "interest")
    },
    {
      label: "Interest Rate",
      type: "number",
      defaultValue: loan.interestRate,
      placeholder: "Enter interest rate",
      onChange: (e) => handleInputChange(Number(e.target.value), "interestRate")
    }
  ]

  const isEditable = (loan === stagingLoan) || (loan.id === editingId);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="flex flex-row gap-4 items-end">
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
          setEditingId(loan.id);
          setStagingLoan(loan);
        }}>
        <Pencil/>
      </Button>
      <Button 
        size="icon"
        disabled={!!editingId || !!stagingLoan} 
        onClick={() => {
          setLoans((draft) => {
            const index = draft.findIndex((otherLoan) => otherLoan.id === loan.id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          });
        }}>
        <Trash/>
      </Button>
    </motion.div>
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
function LoanInput({label, type = "text", defaultValue, onChange, placeholder, disabled = false}: LoanInputProps){

  return (
    <div className="flex flex-col gap-0">
      <Label className="text-sm font-thin text-muted-foreground">{label}</Label>
      <Input disabled={disabled} defaultValue={defaultValue} onChange={onChange} type={type} placeholder={placeholder}/>
    </div>
  )
}