import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Student Loan Tool</h1>
      <p className="text-lg">This is a tool to help you calculate your student loan repayments.</p>
      <div>
        <Input/>
      </div>
    </div>
  );
}
