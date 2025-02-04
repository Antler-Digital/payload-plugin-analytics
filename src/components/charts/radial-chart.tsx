"use client";

import React from "react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

export function RadialChart({
  data,
  className,
  labelKey = "browser",
}: {
  data: any[];
  className?: string;
  labelKey?: string;
}) {
  // create chart config
  const chartConfig = data.reduce((acc, item, i) => {
    const label = item[labelKey];
    acc[label] = {
      label,
      color: item.fill,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RadialBarChart
        data={data}
        startAngle={-90}
        endAngle={200}
        innerRadius={30}
        outerRadius={100}
      >
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              nameKey={labelKey}
              labelClassName="!tw-uppercase"
            />
          }
        />
        <RadialBar dataKey="visitors">
          <LabelList
            position="insideStart"
            dataKey={labelKey}
            className="tw-fill-white tw-capitalize tw-mix-blend-luminosity"
            fontSize={11}
          />
        </RadialBar>
      </RadialBarChart>
    </ChartContainer>
  );
}
