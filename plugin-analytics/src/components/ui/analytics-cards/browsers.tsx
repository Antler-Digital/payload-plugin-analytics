import React from "react";
import { SimpleCard } from "../../ui/simple-card";
import { RadialChart } from "../../charts/radial-chart";
import { DashboardData } from "../../../actions/get-dashboard-stats";
import { SeeAllModal } from "../../modals/see-all-modal";

export async function BrowsersCard({
  browsers,
}: {
  browsers: DashboardData["browsers"];
}) {
  try {
    return (
      <SimpleCard
        className="tw-w-full"
        title="Browsers"
        headerClasses="!tw-flex-row !tw-items-center"
        content={
          <div className="tw-flex tw-items-center tw-justify-center tw-h-[200px] tw-w-[200px] tw-mx-auto">
            <RadialChart
              data={browsers}
              className="tw-h-full tw-w-full"
              labelKey="browser"
            />
          </div>
        }
        contentClasses="!tw-p-0"
        action={<SeeAllModal table="browsers" />}
      />
    );
  } catch (error) {
    return null;
  }
}
