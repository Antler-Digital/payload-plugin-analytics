import React from "react";

import { RadialChart } from "../../charts/radial-chart";
import { SimpleCard } from "../../ui/simple-card";
import { DashboardData } from "../../../actions/get-dashboard-stats";
import { SeeAllModal } from "../../modals/see-all-modal";

export async function OperatingSystemsCard({
  operatingSystems,
}: {
  operatingSystems: DashboardData["operating_systems"];
}) {
  try {
    return (
      <SimpleCard
        className="tw-w-full"
        title="Operating Systems"
        headerClasses="!tw-flex-row !tw-items-center"
        content={
          <div className="tw-flex tw-items-center tw-justify-start tw-h-[200px] tw-w-[200px] tw-mx-auto">
            <RadialChart
              data={operatingSystems}
              className="tw-h-full tw-w-full"
              labelKey="os"
            />
          </div>
        }
        contentClasses="!tw-p-0"
        action={<SeeAllModal table="operating-systems" />}
      />
    );
  } catch (error) {
    return null;
  }
}
