"use client";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import React, { JSX } from "react";

export function SemiRadialChart({
  data = [{ desktop: 0, mobile: 0 }],
  total,
  className,
}: {
  data: any[];
  total: {
    label: string;
    value: number;
  };
  className?: string;
}) {
  // dynamically generate the chart config and bars
  const chart = data.reduce(
    (acc, item) => {
      const key = Object.keys(item)[0];
      if (!key) return acc;

      // config
      acc.config[key] = {
        label: key,
        fill: item.fill,
      };

      // data
      acc.data[key] = item[key];

      // bars
      acc.bars.push(
        <RadialBar key={key} dataKey={key} fill={item.fill} stackId="a" />,
      );
      return acc;
    },
    {
      config: {},
      data: {},
      bars: [],
    } as {
      config: Record<string, any>;
      data: Record<string, any>;
      bars: JSX.Element[];
    },
  );

  return (
    <ChartContainer config={chart.config} className={`${className} `}>
      <RadialBarChart
        data={[chart.data]}
        endAngle={180}
        innerRadius={80}
        outerRadius={130}
        cy={150}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="tw-fill-foreground tw-text-2xl tw-font-bold"
                    >
                      {total.value.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="tw-fill-muted-foreground"
                    >
                      {total.label}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        {chart.bars}
      </RadialBarChart>
    </ChartContainer>
  );
}
