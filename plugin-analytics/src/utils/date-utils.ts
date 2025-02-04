import { AdminViewProps } from "payload";

export function makeDaysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/**
 * The date_change is the date from which the data is being compared to.
 * eg if the date_range is last_7_days, the date_change is 7-14 days ago.
 */
export function getDateFrom(searchParams: AdminViewProps["searchParams"]) {
  switch (searchParams?.date_range) {
    case "last_1_day":
      return { date_from: makeDaysAgo(1), date_change: makeDaysAgo(2) };
    case "last_3_days":
      return { date_from: makeDaysAgo(3), date_change: makeDaysAgo(6) };
    case "last_7_days":
      return { date_from: makeDaysAgo(7), date_change: makeDaysAgo(14) };
    case "last_30_days":
      return { date_from: makeDaysAgo(30), date_change: makeDaysAgo(60) };
    case "last_60_days":
      return { date_from: makeDaysAgo(60), date_change: makeDaysAgo(120) };
    case "all_time":
      return undefined;
    default:
      return { date_from: makeDaysAgo(7), date_change: makeDaysAgo(14) };
  }
}
