import React from "react";

import { SimpleCard } from "../../ui/simple-card";
import { SemiRadialChart } from "../../charts/semi-radial";
import { DashboardData } from "../../../actions/get-dashboard-stats";
import { SeeAllModal } from "../../modals/see-all-modal";

export async function DevicesCard({
  devices,
  totalVisitors,
}: {
  devices: DashboardData["devices"];
  totalVisitors: DashboardData["webpage_views"]["value"];
}) {
  try {
    return (
      <SimpleCard
        className="tw-w-full"
        title="Devices"
        headerClasses="!tw-flex-row !tw-items-center"
        content={
          <div className="tw-flex tw-items-center tw-justify-center tw-h-[250px] tw-mx-auto">
            <SemiRadialChart
              className="tw-h-full tw-w-full"
              data={devices}
              total={{
                label: "Visitors",
                value: totalVisitors,
              }}
            />
          </div>
        }
        contentClasses="!tw-p-0"
        action={<SeeAllModal table="devices" />}
      />
    );
  } catch (error) {
    return null;
  }
}
