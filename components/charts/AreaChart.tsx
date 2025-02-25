"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { LoanData } from "@/lib/types"
import { useMemo } from "react"
import { getProjectedLoan } from "@/lib/services"


interface AreaChartProps {
    loanData: LoanData
}
export default function AAreaChart({ loanData }: AreaChartProps) {

    let numYears = 10;

    const chartConfig = {
        loan: {
            label: `Loan ${loanData.label}`,
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const data = useMemo(() => {
        if (!loanData) return;
        return getProjectedLoan(loanData, numYears, 200)
    }, [loanData])

    return (
        <Card className="w-3/4 h-fit">
            <CardHeader>
                <CardTitle>Loan Summary: {loanData.label}</CardTitle>
                <CardDescription>
                    Showing loan balance over {numYears} years
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
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="balance"
                            type="natural"
                            fill="url(#fillLoan)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
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
    )
}
