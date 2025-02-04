"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { JSX } from "react";

export function AreaChartGraph({
  data,
  xAxis,
}: {
  data: any[];
  xAxis: string;
}) {
  const areas: JSX.Element[] = [];
  const linearGradients: JSX.Element[] = [];

  const keys = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      keys.add(key);
    });
  });
  keys.delete(xAxis);

  const configKeys = Array.from(keys).reduce((acc, key, i) => {
    const stopColour = `var(--chart-${key})`;
    const color = `hsl(${stopColour})`;

    acc[key] = {
      label: key,
      color,
    };

    const linearId = `linear-gradient-${key}`;
    const fill = `url(#${linearId})`;

    areas.push(
      <Area
        key={`area-key-${key}`}
        fill={fill}
        dataKey={key}
        type="natural"
        stroke={color}
        fillOpacity={0.4}
        stackId={key}
      />,
    );

    linearGradients.push(
      <linearGradient id={linearId} key={linearId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={color} stopOpacity={0.8} />
        <stop offset="95%" stopColor={color} stopOpacity={0.1} />
      </linearGradient>,
    );

    return acc;
  }, {} as ChartConfig);

  const CustomTooltip = ({ active, payload, label, ...rest }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="!tw-text-xl tw-flex tw-flex-col tw-gap-y-2 tw-items-start tw-bg-black tw-p-4">
          {payload.map((item: any) => (
            <div
              className="tw-flex tw-items-center tw-gap-x-2"
              key={item.name}
              style={{
                color: item.color,
              }}
            >
              <div
                className="tw-w-2 tw-h-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="tw-capitalize">
                {item.name} : {item.value}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <ChartContainer config={configKeys} className="tw-h-[400px] tw-w-full">
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
          dataKey={xAxis}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
        />
        {/* <ChartTooltip
          cursor={false}
          wrapperClassName="!tw-text-xl"
          content={
            <ChartTooltipContent labelClassName="!tw-text-2xl" itemProp="" />
          }
        /> */}
        <Tooltip content={<CustomTooltip />} />
        <defs>{linearGradients}</defs>
        {areas}
      </AreaChart>
    </ChartContainer>
  );
}
