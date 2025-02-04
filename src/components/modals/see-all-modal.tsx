"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ColumnDef } from "@tanstack/react-table";
import PaginatedTable from "../ui/analytics-cards/modal-table";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface SeeAllModalProps {
  buttonText?: string;
  title?: string;
  description?: string;
  table: string;
}

interface DataItem {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

const tables: Record<
  string,
  { title: string; description: string; columns: ColumnDef<DataItem>[] }
> = {
  "top-pages": {
    title: "Top Pages",
    description: "View detailed analytics for all your pages",
    columns: [
      {
        accessorKey: "path",
        header: "Path",
      },
      {
        accessorKey: "value",
        header: "Value",
        size: 50,
      },
    ],
  },
  "top-referrers": {
    title: "Top Referrers",
    description: "View detailed analytics for all your referrers",
    columns: [
      {
        accessorKey: "referrer_url",
        header: "Referrers",
      },
      {
        accessorKey: "value",
        header: "Value",
        size: 50,
      },
    ],
  },
  "utm-tracking": {
    title: "UTM Tracking",
    description: "View detailed analytics for all your UTM tracking",
    columns: [
      {
        accessorKey: "campaign",
        header: "Campaign",
      },
      {
        accessorKey: "source",
        header: "Source",
      },
      {
        accessorKey: "medium",
        header: "Medium",
      },
      {
        accessorKey: "visitors",
        header: "Visitors",
      },
    ],
  },
  "operating-systems": {
    title: "Operating Systems",
    description: "View detailed analytics for all your operating systems",
    columns: [
      {
        accessorKey: "os",
        header: "Operating System",
      },
      {
        accessorKey: "value",
        header: "Visitors",
      },
    ],
  },
  devices: {
    title: "Devices",
    description: "View detailed analytics for all your devices",
    columns: [
      {
        accessorKey: "device_type",
        header: "Device",
      },
      {
        accessorKey: "value",
        header: "Visitors",
      },
    ],
  },
  browsers: {
    title: "Browsers",
    description: "View detailed analytics for all your browsers",
    columns: [
      {
        accessorKey: "browser",
        header: "Browser",
      },
      {
        accessorKey: "value",
        header: "Visitors",
      },
    ],
  },
};

export function SeeAllModal({
  table,
  buttonText = "See all",
}: SeeAllModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tableData = tables[table];

  if (!tableData) {
    return null;
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        // remove page and limit from url when modal is closed
        if (!open) {
          const params = new URLSearchParams(searchParams);
          params.delete("page");
          params.delete("limit");
          router.push(pathname + "?" + params.toString(), { scroll: false });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          {buttonText} <ArrowRight className="tw-ml-1 tw-w-4 tw-h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="tw-h-full sm:tw-h-auto sm:tw-min-h-[540px]">
        <DialogHeader className="DialogHeader">
          <DialogTitle className="tw-text-3xl">{tableData.title}</DialogTitle>
          <DialogDescription>{tableData.description}</DialogDescription>
        </DialogHeader>
        <PaginatedTable<DataItem> name={table} columns={tableData.columns} />
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
