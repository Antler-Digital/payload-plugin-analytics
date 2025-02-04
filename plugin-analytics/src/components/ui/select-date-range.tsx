"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export function SelectDateRange() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [dateRange, setDateRange] = useState("last_7_days");

  const dateRanges = [
    { value: "last_1_day", label: "Last 1 day" },
    { value: "last_3_days", label: "Last 3 days" },
    { value: "last_7_days", label: "Last 7 days" },
    { value: "last_30_days", label: "Last 30 days" },
    { value: "last_60_days", label: "Last 60 days" },
    { value: "all_time", label: "All time" },
  ];

  function handleDateRangeChange(value: string) {
    const params = new URLSearchParams(searchParams);
    setDateRange(value);
    params.set("date_range", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const dateRange = searchParams.get("date_range");
    if (dateRange) {
      setDateRange(dateRange);
    } else {
      setDateRange("last_7_days");
    }
  }, []);

  return (
    <div className="!tw-w-[180px]">
      <Select onValueChange={handleDateRangeChange} value={dateRange}>
        <SelectTrigger className="tw-bg-card">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent className="tw-border-zinc-800">
          {dateRanges.map(({ value, label }) => (
            <SelectItem key={value} className="tw-bg-card" value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
