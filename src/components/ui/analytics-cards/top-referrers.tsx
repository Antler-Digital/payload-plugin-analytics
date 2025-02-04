import React from "react";
import { SimpleCard } from "../../ui/simple-card";
import ReferrersChart from "../../charts/horizontal-bar-chart";
import { DashboardData } from "../../../actions/get-dashboard-stats";
import { SeeAllModal } from "../../modals/see-all-modal";

export async function TopReferrersCard({
  referrers,
}: {
  referrers: DashboardData["top_referrers"];
}) {
  try {
    return (
      <SimpleCard
        className="tw-w-full sm:tw-w-1/2"
        title="Top Referrers"
        content={<ReferrersChart data={referrers} />}
        action={<SeeAllModal table="top-referrers" />}
        headerClasses="!tw-flex-row !tw-items-center"
      />
    );
  } catch (error) {
    return null;
  }
}
