import React from "react";
import { SimpleCard } from "../../ui/simple-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { DashboardData } from "../../../actions/get-dashboard-stats";
import { SeeAllModal } from "../../modals/see-all-modal";

export async function UTMTrackingCard({
  utm_tracking,
}: {
  utm_tracking: DashboardData["utm_tracking"];
}) {
  const columns = ["Campaign", "Source", "Medium", "Visitors"];
  let tableBody: React.ReactNode;
  if (!utm_tracking?.length) {
    tableBody = (
      <TableBody className="tw-pointer-events-none">
        <TableRow className="tw-hover:bg-transparent tw-dark:hover:bg-transparent">
          <TableCell
            colSpan={columns.length}
            className="tw-text-center tw-h-[489px] tw-text-xl"
          >
            No results
          </TableCell>
        </TableRow>
      </TableBody>
    );
  } else {
    tableBody = (
      <TableBody>
        {utm_tracking.map(({ campaign, medium, source, visitors }, index) => (
          <TableRow key={index}>
            <TableCell>{campaign}</TableCell>
            <TableCell>{source}</TableCell>
            <TableCell>{medium}</TableCell>
            <TableCell>{visitors}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <SimpleCard
      className="tw-w-full sm:tw-w-1/2"
      title="UTM Tracking"
      headerClasses="!tw-flex-row !tw-items-center"
      content={
        <Table>
          <TableHeader className="tw-border-b tw-border-b-zinc-600">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {tableBody}
        </Table>
      }
      action={<SeeAllModal table="utm-tracking" />}
    />
  );
}
