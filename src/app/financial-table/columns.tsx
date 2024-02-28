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
import { deleteFinancial, saveFinancial } from "../utils/saveFinancial";

export type Transaction = {
  title: string;
  ticker: string;
  type: string;
  date: string;
  amount: number;
  owned: number;
  course: string;
  currency: string;
};

export const columns: ColumnDef<Transaction>[] = [
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
    header: "Owned",
  },
  {
    accessorKey: "course",
    header: "Median course",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const owned = Number(row.getValue("owned"));
      const course = Number(row.getValue("course"));

      const amount = owned * course;
      const currency = row.getValue("currency") ?? "EUR";
      const formatted = new Intl.NumberFormat("fi-FI", {
        style: "currency",
        currency: `${currency}`,
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
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
            <DialogContent className="max-w-screen-sm">
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
                        } as Transaction,
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
