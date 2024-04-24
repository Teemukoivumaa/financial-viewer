import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { AddFinance, FinancialProductType } from "../utils/types";
import useNewFinancialState from "./useNewFinancialState";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is zero-based
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const typing = ["ETF", "Fund"];

function addFinancial(
  states: any,
  financial: AddFinance,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (typeof window === "undefined") return;

  const financialObject = JSON.parse(
    localStorage.getItem("financials") || "[]"
  );

  const type = capitalizeFirstLetter(states.type);

  if (type !== "Account") {
    financialObject?.push({
      title: states.name,
      ticker: financial.financial.symbol,
      date: new Date().toLocaleDateString(),
      type: type,
      amount: states.value,
      owned: states.owned,
      course: states.course,
      currency: states.currency,
    });
  } else if (type === typing[0] || type === typing[1]) {
    financialObject?.push({
      title: states.name,
      ticker: financial.financial.symbol,
      date: new Date().toLocaleDateString(),
      type: type,
      amount: states.value,
      owned: states.owned,
      course: states.course,
      currency: states.currency,
      expenseRatio: states.expenseRatio,
    });
  } else {
    financialObject?.push({
      title: states.name,
      ticker: "",
      date: formatDate(states.openDate),
      type: type,
      amount: states.value,
      owned: "1",
      course: "0",
      currency: states.currency,
      interest: states.interestRate,
      expenseRatio: states.expenseRatio,
    });
  }

  localStorage.setItem("financials", JSON.stringify(financialObject));

  toast("New financial has been added!");

  setTimeout(() => {
    setOpen(false);
  }, 500);

  return true;
}

export function AddFinancial() {
  const [open, setOpen] = useState(false);
  const [finance, setFinance] = useState<AddFinance | undefined>(undefined);
  const states = useNewFinancialState(finance);

  // useEffect(() => {
  //   if (finance && finance.financial && finance.info) {
  //     const { typeDisp, shortname } = finance.financial;
  //     const { regularMarketPrice, currency } = finance.info;

  //     states.setType(typeDisp !== "Equity" ? typeDisp.toLowerCase() : "stock");
  //     states.setName(shortname);
  //     states.setCourse(regularMarketPrice);
  //     states.setCurrency(currency);
  //   }
  // }, [finance, states]);

  const clearChosen = () => {
    setFinance(undefined);
    states.dispatch({
      type: "SET_FINANCE_DETAILS",
      payload: {
        type: "stock",
        name: null,
        owned: null,
        course: null,
        value: null,
        expenseRatio: null,
        interestRate: null,
        openDate: null,
        currency: null,
      },
    });
  };

  const handleSubmit = () => {
    if (finance) {
      const result = addFinancial(states, finance, setOpen);
      if (result) {
        setTimeout(() => {
          setFinance(undefined);
          states.dispatch({
            type: "SET_FINANCE_DETAILS",
            payload: {
              type: "stock",
              name: null,
              owned: null,
              course: null,
              value: null,
              expenseRatio: null,
              interestRate: null,
              openDate: null,
              currency: null,
            },
          });
        }, 500);
      }
    }
  };

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
            disabled={!finance}
            onClick={clearChosen}
            className="mt-10 sm:mt-0"
          >
            Clear chosen
          </Button>

          <Button type="submit" disabled={!finance} onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
