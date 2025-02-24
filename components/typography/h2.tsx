import { TypographyProps } from "./types";

export function H2({children}: TypographyProps) {
    return (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    )
  }
  