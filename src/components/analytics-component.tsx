import "../styles/input.css";

import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import axios from "axios";
import { redirect } from "next/navigation";

import {
  DashboardStats,
  getDashboardData,
} from "../actions/get-dashboard-stats";
import { AnalyticsPluginOptions, DateRange } from "../types";
import { cn } from "../utils/class-utils";
import { getDateFrom } from "../utils/date-utils";
import { BrowsersCard } from "./ui/analytics-cards/browsers";
import { DevicesCard } from "./ui/analytics-cards/devices";
import { OperatingSystemsCard } from "./ui/analytics-cards/os";
import { StatCardBase } from "./ui/analytics-cards/stats";
import { TopPagesLast7DaysCard } from "./ui/analytics-cards/top-pages-last-7-days";
import { TopReferrersCard } from "./ui/analytics-cards/top-referrers";
import { UTMTrackingCard } from "./ui/analytics-cards/utm-tracking";
import { ViewsAndVisitorsCard } from "./ui/analytics-cards/views-and-visitors";
import { VisitorGeographyCard } from "./ui/analytics-cards/visitor-geography";
import { SelectDateRange } from "./ui/select-date-range";

// import { redirect } from 'next/navigation';
import type { AdminViewProps, BasePayload } from "payload";

const FlexRow = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "tw-flex tw-flex-col sm:tw-flex-row tw-w-full tw-justify-between tw-gap-4",
      className
    )}
  >
    {children}
  </div>
);

export async function AnalyticsComponent({
  payload,
  initPageResult,
  params,
  searchParams,
  pluginOptions,
}: {
  payload: BasePayload;
  pluginOptions: AnalyticsPluginOptions;
} & AdminViewProps) {
  /**
   * https://payloadcms.com/docs/admin/views#collection-views
   *
   * Custom views are public
   *
   * Custom views are public by default.
   * If your view requires a user to be logged in or to have certain access rights,
   * you should handle that within your view component yourself.
   */
  const user = initPageResult?.req?.user;

  if (!user) {
    redirect("/admin");
  }

  const { data } = await getDashboardData(payload, pluginOptions, {
    date_change: getDateFrom(searchParams)?.date_change,
    date_from: getDateFrom(searchParams)?.date_from,
    date_range: searchParams?.date_range as DateRange,
  });

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <div className="tw-flex tw-flex-col tw-gap-4 tw-pb-10">
          <div className="tw-flex tw-flex-col tw-w-full tw-space-y-4">
            <FlexRow>
              <h1 className="tw-text-2xl tw-font-bold">Analytics Dashboard</h1>
              <SelectDateRange maxAgeInDays={pluginOptions.maxAgeInDays} />
            </FlexRow>
          </div>
          <div
            className={`tw-grid tw-grid-cols-2 sm:tw-grid-cols-4 tw-w-full tw-gap-4`}
          >
            <StatCardBase
              label="Webpage Views"
              value={data?.webpage_views?.value}
              change={data?.webpage_views?.change}
            />
            <StatCardBase
              label="Unique Visitors"
              value={data?.unique_visitors?.value}
              change={data?.unique_visitors?.change}
            />
            <StatCardBase
              label="Bounce Rate"
              value={data?.bounce_rate?.value}
              change={data?.bounce_rate?.change}
            />
            <StatCardBase
              label="Live Visitors"
              value={data?.live_visitors?.value}
            />
          </div>
          <FlexRow>
            <ViewsAndVisitorsCard
              data={data?.views_and_visitors}
              xAxis="day"
              dateRange={searchParams?.date_range as DateRange}
            />
          </FlexRow>
          <FlexRow>
            <VisitorGeographyCard data={data?.visitor_geography} />
            <TopPagesLast7DaysCard pages={data?.top_pages} />
          </FlexRow>
          <FlexRow>
            <TopReferrersCard referrers={data?.top_referrers} />
            <UTMTrackingCard utm_tracking={data?.utm_tracking} />
          </FlexRow>
          <div
            className={cn(
              "tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4"
            )}
          >
            <BrowsersCard browsers={data?.browsers} />
            <DevicesCard
              devices={data?.devices}
              totalVisitors={data?.webpage_views?.value}
            />
            <OperatingSystemsCard operatingSystems={data?.operating_systems} />
          </div>
        </div>
      </Gutter>
    </DefaultTemplate>
  );
}
