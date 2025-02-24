import { TypographyProps } from "./types";

export function H3({children}: TypographyProps) {
    return (
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {children}
      </h3>
    )
  }
  