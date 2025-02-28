"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LoanData } from "@/lib/types";
import { useMemo, useState } from "react";
import { getProjectedLoan } from "@/lib/services";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";

interface AreaChartProps {
  loanData: LoanData;
}
export default function AAreaChart({ loanData }: AreaChartProps) {
  const [numYears, setNumYears] = useState(10);
  const payment = 200;
  let chartColor = "--chart-3";

  const chartConfig = {
    loan: {
      label: `Loan ${loanData.label}`,
      color: `(var(${chartColor}))`,
    },
  } satisfies ChartConfig;

  const data = useMemo(() => {
    if (!loanData) return;
    return getProjectedLoan(loanData, numYears, payment);
  }, [loanData, numYears, payment]);

  return (
    <Card className="w-3/4 h-fit">
      <CardHeader>
        <CardTitle>Loan Summary: {loanData.label}</CardTitle>
        <CardDescription>
          Showing loan balance over <strong>{numYears}</strong> years with a $
          {payment} payment
          <Slider
            value={[numYears]}
            onValueChange={(value) => setNumYears(value[0])}
            max={40}
            min={1}
            step={2}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillLoan" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(${chartColor})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(${chartColor})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="balance"
              type="natural"
              fill="white"
              fillOpacity={0.2}
              stroke={`var(${chartColor})`}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            January - June 2024
                        </div>
                    </div>
                </div>
            </CardFooter> */}
    </Card>
  );
}
