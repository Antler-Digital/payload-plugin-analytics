import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import axios from "axios";
import { AdminViewProps } from "payload";
import { redirect } from "next/navigation";

import { DashboardStats } from "../../actions/get-dashboard-stats";
import { getDateFrom } from "../../utils/date-utils";
import { BrowsersCard } from "../ui/analytics-cards/browsers";
import { DevicesCard } from "../ui/analytics-cards/devices";
import { OperatingSystemsCard } from "../ui/analytics-cards/os";
import { StatCardBase } from "../ui/analytics-cards/stats";
import { TopPagesLast7DaysCard } from "../ui/analytics-cards/top-pages-last-7-days";
import { TopReferrersCard } from "../ui/analytics-cards/top-referrers";
import { UTMTrackingCard } from "../ui/analytics-cards/utm-tracking";
import { ViewsAndVisitorsCard } from "../ui/analytics-cards/views-and-visitors";
import { VisitorGeographyCard } from "../ui/analytics-cards/visitor-geography";
import { SelectDateRange } from "../ui/select-date-range";

import "./output.css";
import { cn } from "../../utils/class-utils";
import { DateRange } from "../../types";

const FlexRow = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "tw-flex tw-flex-col sm:tw-flex-row tw-w-full tw-justify-between tw-gap-y-4 tw-gap-x-4",
      className,
    )}
  >
    {children}
  </div>
);

let baseUrl = "http://localhost:3000";

if (process.env.NODE_ENV === "production") {
  baseUrl = `https://payload-plugins-dev-9ro9.vercel.app`;
}

const pathname = `${baseUrl}/api/analytics-events`;

export async function AnalyticsDashboard({
  initPageResult,
  params,
  searchParams,
}: AdminViewProps) {
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

  const { data } = await axios.post<{ data: DashboardStats }>(
    `${pathname}/dashboard`,
    {
      date_change: getDateFrom(searchParams)?.date_change,
      date_from: getDateFrom(searchParams)?.date_from,
      date_range: searchParams?.date_range,
      // date_to: new Date(),
    },
  );

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
        <div className="tw-container tw-flex tw-flex-col tw-w-full tw-space-y-4 tw-pb-20">
          <FlexRow>
            <h1 className="tw-text-2xl tw-font-bold">Analytics Dashboard</h1>
            <SelectDateRange />
          </FlexRow>
          <div
            className={`tw-grid tw-grid-cols-2 sm:tw-grid-cols-4 tw-w-full tw-gap-x-4`}
          >
            <StatCardBase
              label="Webpage Views"
              value={data?.data?.webpage_views?.value}
              change={data?.data?.webpage_views?.change}
            />
            <StatCardBase
              label="Unique Visitors"
              value={data?.data?.unique_visitors?.value}
              change={data?.data?.unique_visitors?.change}
            />
            <StatCardBase
              label="Bounce Rate"
              value={data?.data?.bounce_rate?.value}
              change={data?.data?.bounce_rate?.change}
            />
            <StatCardBase
              label="Live Visitors"
              value={data?.data?.live_visitors?.value}
            />
          </div>
          <FlexRow>
            <ViewsAndVisitorsCard
              data={data?.data?.views_and_visitors}
              xAxis="day"
              dateRange={searchParams?.date_range as DateRange}
            />
          </FlexRow>
          <FlexRow>
            <VisitorGeographyCard data={data?.data?.visitor_geography} />
            <TopPagesLast7DaysCard pages={data?.data?.top_pages} />
          </FlexRow>
          <FlexRow>
            <TopReferrersCard referrers={data?.data?.top_referrers} />
            <UTMTrackingCard utm_tracking={data?.data?.utm_tracking} />
          </FlexRow>
          <div
            className={cn(
              "tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4",
            )}
          >
            <BrowsersCard browsers={data?.data?.browsers} />
            <DevicesCard
              devices={data?.data?.devices}
              totalVisitors={data?.data?.webpage_views?.value}
            />
            <OperatingSystemsCard
              operatingSystems={data?.data?.operating_systems}
            />
          </div>
        </div>
      </Gutter>
    </DefaultTemplate>
  );
}
