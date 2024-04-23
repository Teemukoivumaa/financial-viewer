"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddFinancialFields } from "./addFields";
import { Search } from "./search/search";
import { toast } from "sonner";
import { ParsedFinancial, StockInformation, AddFinance } from "../utils/types";
import useNewFinancialState from "./useNewFinancialState";

function addFinancial(
  financial: ParsedFinancial,
  financialInformation: StockInformation,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (typeof window === "undefined" || financial === undefined) return;

  const financialObject = JSON.parse(
    localStorage.getItem("financials") || "[]"
  );

  const type = financial.typeDisp !== "Equity" ? financial.typeDisp : "Stock";

  financialObject?.push({
    title: financial.shortname,
    ticker: financial.symbol,
    date: new Date().toLocaleDateString(),
    type: type,
    amount: 0,
    owned: 1,
    course: financialInformation.regularMarketPrice,
    currency: financialInformation.currency,
  });

  localStorage.setItem("financials", JSON.stringify(financialObject));

  toast("New financial has been added!");

  setTimeout(() => {
    setOpen(false);
  }, 500);
}

export function AddFinancial() {
  const [open, setOpen] = useState(false);

  const states = useNewFinancialState();

  const [finance, setFinance] = useState(undefined as unknown as AddFinance);

  if (finance) {
    if (!states.type && finance.financial) {
      states.setType(
        finance.financial.typeDisp !== "Equity"
          ? finance.financial.typeDisp.toLocaleLowerCase()
          : "stock"
      );
    }

    if (!states.name && finance.financial) {
      states.setName(finance.financial.shortname);
    }

    if (!states.course && finance.info) {
      states.setCourse(finance.info.regularMarketPrice);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-2 mr-4">
          Add new financial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Add financial</DialogTitle>
          <DialogDescription>
            Search for the financial you would like to add
          </DialogDescription>
        </DialogHeader>

        {!finance ? (
          <Search setFinance={setFinance} />
        ) : (
          <AddFinancialFields financeDetails={finance} states={states} />
        )}

        <DialogFooter className="sm:justify-start">
          <Button
            type="reset"
            variant="destructive"
            disabled={finance ? false : true}
            onClick={() => {
              setFinance(undefined as unknown as AddFinance);
            }}
            className="mt-10 sm:mt-0"
          >
            Clear chosen
          </Button>

          <Button
            type="submit"
            disabled={finance ? false : true}
            onClick={() => {
              setFinance(undefined as unknown as AddFinance);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
