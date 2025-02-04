import React from "react";
import { DashboardData } from "../../../actions/get-dashboard-stats";
import { AreaChartGraph } from "../../charts/area-chart";
import { SimpleCard } from "../../ui/simple-card";
import { DateRange } from "../../../types";

export async function ViewsAndVisitorsCard({
  data,
  xAxis,
  dateRange,
}: {
  data?: DashboardData["views_and_visitors"];
  xAxis: string;
  dateRange?: DateRange;
}) {
  if (!data) return null;

  let dateRangeLabel = "Last 7 days";

  if (dateRange === "last_1_day") {
    dateRangeLabel = "Last 24 hours";
  } else if (dateRange === "last_3_days") {
    dateRangeLabel = "Last 3 days";
  } else if (dateRange === "last_7_days") {
    dateRangeLabel = "Last 7 days";
  } else if (dateRange === "last_30_days") {
    dateRangeLabel = "Last 30 days";
  } else if (dateRange === "last_60_days") {
    dateRangeLabel = "Last 60 days";
  } else if (dateRange === "all_time") {
    dateRangeLabel = "All time";
  }

  try {
    return (
      <SimpleCard
        className="tw-w-full"
        title={`Page Views and Visitors ${dateRangeLabel}`}
        content={<AreaChartGraph data={data} xAxis={xAxis} />}
        action={
          <div className="tw-flex tw-flex-row tw-items-start sm:tw-items-center tw-gap-x-2">
            {/* page views key */}
            <div className="tw-flex tw-flex-row tw-items-center tw-gap-x-2">
              <div className="tw-w-4 tw-h-4 tw-bg-[#2357C1]" />
              <div>Page Views</div>
            </div>
            {/* visitors key */}
            <div className="tw-flex tw-flex-row tw-items-center tw-gap-x-2">
              <div className="tw-w-4 tw-h-4 tw-bg-[#D1366F]" />
              <div>Unique Visitors</div>
            </div>
          </div>
        }
      />
    );
  } catch (error) {
    return null;
  }
}
