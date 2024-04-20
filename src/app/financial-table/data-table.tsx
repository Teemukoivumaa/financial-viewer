"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { getData, getTableColumn, setTableColumn } from "../utils/getData";
import { AddFinancial } from "../addFinancial/addDialog";
import {
  calculateAllInitialInvestment,
  calculateAllValueNow,
} from "../utils/getTotalValue";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(getTableColumn());
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [refresh, setRefresh] = React.useState(false);
  const [tableData, setTableData] = React.useState(data as TData[]);

  React.useEffect(() => {
    if (refresh) {
      setTableData(getData());
    }
  }, [refresh, setTableData]);

  const handleRefresh = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      columnFilters,
    },
  });

  let columnsHidden = 0;

  for (const key in columnVisibility) {
    if (
      columnVisibility.hasOwnProperty(key) &&
      columnVisibility[key] === false
    ) {
      columnsHidden++;
    }
  }

  let initialVisible = true;
  let nowVisible = true;

  for (const key in columnVisibility) {
    if (
      key === "amount now" &&
      columnVisibility.hasOwnProperty(key) &&
      columnVisibility[key] === false
    ) {
      nowVisible = false;
    } else if (key === "amount now") {
      nowVisible = true;
    }

    if (
      key === "amount" &&
      columnVisibility.hasOwnProperty(key) &&
      columnVisibility[key] === false
    ) {
      initialVisible = false;
    } else if (key === "amount") {
      initialVisible = true;
    }
  }

  const types = React.useMemo(() => {
    let values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue("type")) as string[];
    values.unshift("All");
    return Array.from(new Set(values));
  }, [table, refresh]);

  const filterValue = columnFilters?.[0]?.value as string;

  const { loading: loadingInitial, value: valueAllInitial } =
    calculateAllInitialInvestment(table, filterValue, refresh);

  const { loading: loadingNow, value: valueAllNow } = calculateAllValueNow(
    table,
    filterValue,
    refresh
  );

  return (
    <>
      <div className="flex flex-row justify-between py-4">
        <div className="flex flex-wrap">
          <AddFinancial />

          {/* Reload */}
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="mb-2 mr-4"
          >
            <ReloadIcon className="mr-2 h-4 w-4" /> Refresh
          </Button>

          {/* Type */}
          <DropdownMenu>
            <DropdownMenuTrigger className="mr-4" asChild>
              <Button variant="outline">Type</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              {types.map((type) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={type}
                    className="capitalize"
                    checked={
                      filterValue ? filterValue === type : "All" === type
                    }
                    onCheckedChange={() => {
                      type === "All"
                        ? table.resetColumnFilters()
                        : table.getColumn("type")?.setFilterValue(type);
                    }}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Columns */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="md:ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  if (column.id !== "actions") {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => {
                          column.toggleVisibility(!!value);
                          setTableColumn(column.id, !!value);
                        }}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  }
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell className="font-medium text-left">Total</TableCell>
              {initialVisible && (
                <TableCell
                  className="font-medium text-right"
                  colSpan={
                    nowVisible
                      ? columns.length - columnsHidden - 4
                      : columns.length - columnsHidden - 3
                  }
                >
                  {loadingInitial ? "Loading..." : `${valueAllInitial}`}
                </TableCell>
              )}

              {nowVisible && (
                <TableCell
                  className="font-medium text-right"
                  colSpan={
                    initialVisible ? 2 : columns.length - columnsHidden - 2
                  }
                >
                  {loadingNow ? "Loading..." : `${valueAllNow}`}
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
