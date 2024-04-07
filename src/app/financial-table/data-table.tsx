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
import { calculateCurrentValue, requestCourse } from "../utils/getTableInfo";
import useAsync from "react-use/lib/useAsync";
import { AddFinancial } from "../addFinancial/addDialog";

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

  const uniqueValues = React.useMemo(() => {
    let values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue("type")) as string[];
    values.unshift("All");
    return Array.from(new Set(values));
  }, [table]);

  const filterValue = columnFilters?.[0]?.value;

  const { loading, value } = useAsync(async () => {
    try {
      const rows = table.getCoreRowModel().flatRows;

      if (rows?.length <= 0) {
        return "";
      }

      const totalValue = await Promise.all(
        rows.map(async (row) => {
          const ticker = row.getValue("ticker") as string;
          const owned = Number(row.getValue("owned"));

          const { regularMarketPrice } = await requestCourse(ticker);

          return calculateCurrentValue(regularMarketPrice, owned);
        })
      );

      // Calculate the sum of all current values
      const sumValue = totalValue.reduce((acc, curr) => acc + curr, 0);

      const formatted = new Intl.NumberFormat("fi-FI", {
        style: "currency",
        currency: `EUR`,
      }).format(sumValue);

      localStorage.setItem("totalValue", formatted);

      return formatted;
    } catch (error) {
      throw new Error("Failed to calculate total value");
    }
  }, [table, refresh]);

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
              {uniqueValues.map((type) => {
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
              <TableCell colSpan={1} className="font-medium text-left">
                Total
              </TableCell>
              <TableCell
                colSpan={columns.length - 2}
                className="font-medium text-right"
              >
                {loading ? "Loading..." : `${value}`}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
