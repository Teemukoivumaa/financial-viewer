"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModifyFinancial } from "../modifyFinancial/modifyFields";
import useFinancialState from "../modifyFinancial/useFinancialState";
import { deleteFinancial, saveFinancial } from "../utils/financialFunctions";
import { Financial } from "../utils/types";
import { Suspense } from "react";
import { getTickerData, getCourseNow } from "../utils/getTableInfo";

export const columns: ColumnDef<Financial>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "ticker",
    header: "Ticker",
  },
  {
    accessorKey: "owned",
    header: "Amount Owned",
  },
  {
    accessorKey: "course",
    header: "Median buy course",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Initial investment</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));

      const currency = row.getValue("currency") ?? "EUR";
      const formatted = new Intl.NumberFormat("fi-FI", {
        style: "currency",
        currency: `${currency}`,
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "course now",
    header: () => <div className="text-right">Course now</div>,
    cell: ({ row }) => {
      const ticker = row.getValue("ticker") as string;
      const currency = (row.getValue("currency") as string) ?? "EUR";

      return (
        <Suspense
          fallback={<p className="text-right font-medium">Fetching...</p>}
        >
          {getCourseNow(ticker, currency)}
        </Suspense>
      );
    },
  },
  {
    accessorKey: "amount now",
    header: () => <div className="text-right">Price now</div>,
    cell: ({ row }) => {
      const ticker = row.getValue("ticker") as string;
      const owned = Number(row.getValue("owned"));
      const amount = Number(row.getValue("amount"));
      const currency = (row.getValue("currency") as string) ?? "EUR";

      return (
        <Suspense
          fallback={<p className="text-right font-medium">Fetching...</p>}
        >
          {getTickerData(ticker, amount, owned, currency)}
        </Suspense>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const financial = row.original;
      const [open, setOpen] = useState(false);
      const { owned, setOwned, course, setCourse, value, setValue } =
        useFinancialState(financial);
      const financialState = {
        owned,
        setOwned,
        course,
        setCourse,
        value,
        setValue,
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem className="grid content-center">
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="grid content-center">
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteFinancial(financial);
                    setTimeout(() => {
                      setOpen(false);
                    }, 500);
                  }}
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-sm sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Modify {financial.title}</DialogTitle>
                <DialogDescription>
                  Edit the fields and then save your changes
                </DialogDescription>
              </DialogHeader>

              <ModifyFinancial financial={financial} states={financialState} />

              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    type="button"
                    onClick={() => {
                      saveFinancial(
                        {
                          title: `${financial.title}`,
                          ticker: `${financial.ticker}`,
                          date: `${financial.date}`,
                          type: `${financial.type}`,
                          amount: value,
                          owned: owned,
                          course: `${course}`,
                          currency: `${financial.currency}`,
                        } as Financial,
                        financial
                      );
                      setTimeout(() => {
                        setOpen(false);
                      }, 500);
                    }}
                  >
                    Save
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
