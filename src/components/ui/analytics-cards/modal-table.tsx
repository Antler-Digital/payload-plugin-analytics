"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { LoaderCircle } from "lucide-react";

interface TableParams {
  limit?: string;
  page?: string;
  date_from?: string;
  date_to?: string;
}

export default function PaginatedTable<DataItem>({
  name,
  columns,
}: {
  name: string;
  columns: ColumnDef<DataItem>[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use extracted function to get params
  const { currentPage, currentLimit, dateFrom } = getTableParams(searchParams);

  // Set up pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage - 1,
    pageSize: currentLimit,
  });

  // Construct API URL with parameters
  const getApiUrl = (params: TableParams) => {
    const baseUrl = `/api/analytics-events/stats/${name}`;
    return createUrl(baseUrl, {
      ...params,
      limit: params.limit?.toString(),
      page: params.page?.toString(),
    }).toString();
  };

  // Fetch data using SWR
  const { data, error, isLoading } = useSWR(
    getApiUrl({
      page: (pagination.pageIndex + 1).toString(),
      limit: pagination.pageSize.toString(),
      date_from: dateFrom,
    }),
    fetcher,
  );

  // Update URL when pagination changes
  useEffect(() => {
    const queryString = updateUrlParams(searchParams, pagination, dateFrom);
    router.push("?" + queryString, { scroll: false });
  }, [pagination, dateFrom]);

  // Initialize table
  const table = useReactTable({
    data: data?.docs || [],
    columns: columns,
    pageCount: data?.totalPages || -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (error)
    return (
      <div className="tw-text-center py-10 tw-flex tw-items-center tw-justify-center">
        Failed to load data
      </div>
    );

  if (!isLoading && (!data?.docs || data?.docs.length === 0))
    return (
      <div className="tw-text-center py-10 tw-flex tw-items-center tw-justify-center">
        No data found
      </div>
    );

  return (
    <div className="tw-space-y-4">
      <div className="tw-rounded-md">
        <Table className="tw-table-fixed ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.column.columnDef.size }}
                  >
                    {header.column.columnDef.header?.toString()}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="" style={{ height: "300px" }}>
                <TableCell className="tw-w-full tw-h-full" colSpan={2}>
                  <div className="tw-flex tw-items-center tw-justify-center tw-h-full tw-w-full">
                    <LoaderCircle className="tw-animate-spin tw-h-8 tw-w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, i, arr) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.renderValue() as ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
            {!isLoading &&
              table.getRowModel().rows.length < DEFAULT_PAGE_SIZE &&
              // Fill remaining space with empty rows
              Array.from({
                length: DEFAULT_PAGE_SIZE - table.getRowModel().rows.length,
              }).map((_, index) => (
                <TableRow key={`empty-${index}`}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={`empty-${index}-${cellIndex}`}>
                      &nbsp;
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="tw-flex tw-items-center tw-justify-between tw-space-x-2 tw-py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <div className="text-sm text-gray-600">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {data?.totalPages || 1}
      </div>
    </div>
  );
}

// Helper function to create URL with parameters
function createUrl(baseUrl: string, params: TableParams) {
  const searchParams = new URLSearchParams();

  // Only add parameters that are defined
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

const DEFAULT_PAGE_SIZE = 10;

// Extract URL parameter handling
function getTableParams(searchParams: URLSearchParams) {
  return {
    currentPage: Number(searchParams.get("page")) || 1,
    currentLimit: Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE,
    dateFrom: searchParams.get("date_from") || "",
  };
}

// Extract URL update logic
function updateUrlParams(
  searchParams: URLSearchParams,
  pagination: PaginationState,
  dateFrom: string,
) {
  const newParams = new URLSearchParams(searchParams.toString());
  newParams.set("page", (pagination.pageIndex + 1).toString());
  newParams.set("limit", pagination.pageSize.toString());
  if (dateFrom) newParams.set("date_from", dateFrom);
  return newParams.toString();
}
