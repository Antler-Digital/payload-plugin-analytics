import React from "react";
import StatCard from "../../ui/stat-card";

export async function StatCardBase({
  label,
  value,
  change,
}: {
  label: string;
  value?: number;
  change?: number;
}) {
  try {
    return (
      <StatCard label={label} value={value} change={change} changeSuffix="%" />
    );
  } catch (error) {
    return null;
  }
}
