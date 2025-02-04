import React from "react";
import { DashboardData } from "../../../actions/get-dashboard-stats";
import { SeeAllModal } from "../../modals/see-all-modal";
import { SimpleCard } from "../../ui/simple-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

export async function TopPagesLast7DaysCard({
  pages,
}: {
  pages: DashboardData["top_pages"];
}) {
  try {
    const columns = ["Page", "Views"];

    let tableBody: React.ReactNode;

    if (!pages?.length) {
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
          {pages.map((page, index) => (
            <TableRow key={index}>
              <TableCell>{page.path}</TableCell>
              <TableCell className="tw-text-right">{page.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    return (
      <SimpleCard
        className="tw-w-full sm:tw-w-1/2 lg:tw-w-1/3"
        headerClasses="!tw-flex-row !tw-items-center"
        title="Top Pages Last 7 Days"
        content={
          <Table>
            <TableHeader className="tw-border-b tw-border-b-zinc-600">
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead className="tw-text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            {tableBody}
          </Table>
        }
        action={<SeeAllModal table="top-pages" />}
      />
    );
  } catch (error) {
    return null;
  }
}
