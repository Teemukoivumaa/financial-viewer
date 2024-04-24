import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddFinance } from "../utils/types";

interface AddProps {
  financeDetails: AddFinance;
  states: any;
}

export function AddFinancialFields({ financeDetails, states }: AddProps) {
  const { info: financialInfo } = financeDetails;

  useEffect(() => {
    if (states.type !== "account") {
      const calculatedValue = (
        Number(states.owned) * Number(states.course)
      ).toFixed(3);
      if (calculatedValue !== states.value) {
        states.setValue(calculatedValue);
      }
    }
  }, [states.owned, states.course, states.setValue, states.value, states.type]);

  return (
    <div className="grid w-full items-center gap-4">
      <Label htmlFor="type">Type</Label>
      <Select
        onValueChange={(value) => states.setType(value)}
        defaultValue={String(states.type)}
      >
        <SelectTrigger id="type" aria-label="Select type">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stock">Stock</SelectItem>
          <SelectItem value="fund">Fund</SelectItem>
          <SelectItem value="etf">Exchange-Traded Fund (ETF)</SelectItem>
          <SelectItem value="account">Savings account</SelectItem>
          <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
        </SelectContent>
      </Select>
      {!financialInfo?.currency && (
        <>
          <Label htmlFor="currency">Currency</Label>
          <Input
            type="string"
            id="currency"
            placeholder="Currency"
            value={states.currency}
            onChange={(e) => {
              states.setCurrency(e.target.value);
            }}
          />
        </>
      )}

      {states.type === "stock" ? (
        <>
          <Label htmlFor="name">Stock name</Label>
          <Input
            type="string"
            id="name"
            placeholder="Name"
            value={states.name}
            onChange={(e) => {
              states.setName(e.target.value);
            }}
          />

          <Label htmlFor="amount">Number of shares</Label>
          <Input
            type="number"
            id="amount"
            placeholder="1"
            step="1"
            value={states.owned}
            onChange={(e) => {
              states.setOwned(e.target.value);
            }}
          />

          <Label htmlFor="currentPrice">
            Current market price ({states.currency})
          </Label>
          <Input
            type="number"
            id="currentPrice"
            placeholder="100"
            step="1"
            value={states.course}
            onChange={(e) => {
              states.setCourse(e.target.value);
            }}
          />

          <Label htmlFor="price">
            Purchase price per share currency ({states.currency})
          </Label>
          <Input
            type="number"
            id="price"
            placeholder="100"
            step="1"
            value={states.value}
            onChange={(e) => {
              states.setValue(e.target.value);
            }}
          />
        </>
      ) : (
        ""
      )}
      {states.type === "fund" || states.type === "etf" ? (
        <>
          <Label htmlFor="name">Fund / ETF name</Label>
          <Input
            type="string"
            id="name"
            placeholder="Name"
            value={states.name}
            onChange={(e) => {
              states.setName(e.target.value);
            }}
          />

          <Label htmlFor="amount">Number of units / shares</Label>
          <Input
            type="number"
            id="amount"
            placeholder="1"
            step="1"
            value={states.owned}
            onChange={(e) => {
              states.setOwned(e.target.value);
            }}
          />

          <Label htmlFor="currentPrice">
            Current market price ({states.currency})
          </Label>
          <Input
            type="number"
            id="currentPrice"
            placeholder="100"
            step="1"
            value={states.course}
            onChange={(e) => {
              states.setCourse(e.target.value);
            }}
          />

          <Label htmlFor="price">
            Purchase price per unit / share ({states.currency})
          </Label>
          <Input
            type="number"
            id="price"
            placeholder="100"
            step="1"
            value={states.value}
            onChange={(e) => {
              states.setValue(e.target.value);
            }}
          />

          <Label htmlFor="expenseRatio">Expense ratio (%)</Label>
          <Input
            type="number"
            id="expenseRatio"
            placeholder="0.01%"
            step="0.01"
            value={states.expenseRatio}
            onChange={(e) => {
              states.setExpenseRatio(e.target.value);
            }}
          />
        </>
      ) : (
        ""
      )}

      {states.type === "account" ? (
        <>
          <Label htmlFor="name">Account name</Label>
          <Input
            type="string"
            id="name"
            placeholder="Name"
            value={states.name}
            onChange={(e) => {
              states.setName(e.target.value);
            }}
          />

          <Label htmlFor="interest">Interest rate (%)</Label>
          <Input
            type="number"
            id="amount"
            placeholder="1"
            step="1"
            value={states.interestRate}
            onChange={(e) => {
              states.setInterestRate(e.target.value);
            }}
          />

          <Label htmlFor="balance">Account balance</Label>
          <Input
            type="number"
            id="balance"
            placeholder="100"
            step="1"
            value={states.value}
            onChange={(e) => {
              states.setValue(e.target.value);
            }}
          />

          <Label htmlFor="expenseRatio">Expense ratio (%)</Label>
          <Input
            type="number"
            id="expenseRatio"
            placeholder="0.01%"
            step="0.01"
            value={states.expenseRatio}
            onChange={(e) => {
              states.setExpenseRatio(e.target.value);
            }}
          />

          <Label htmlFor="openDate">Date of account opening</Label>
          <Input
            type="date"
            id="openDate"
            placeholder="01.01.2024"
            value={states.openDate}
            onChange={(e) => {
              states.setOpenDate(e.target.value);
            }}
          />
        </>
      ) : (
        ""
      )}

      {states.type === "cryptocurrency" ? (
        <>
          <Label htmlFor="name">Cryptocurrency name</Label>
          <Input
            type="string"
            id="name"
            placeholder="Name"
            value={states.name}
            onChange={(e) => {
              states.setName(e.target.value);
            }}
          />

          <Label htmlFor="amount">Amount held</Label>
          <Input
            type="number"
            id="amount"
            placeholder="1"
            step="1"
            value={states.owned}
            onChange={(e) => {
              states.setOwned(e.target.value);
            }}
          />

          <Label htmlFor="currentPrice">
            Current market price ({states.currency})
          </Label>
          <Input
            type="number"
            id="currentPrice"
            placeholder="100"
            step="1"
            value={states.course}
            onChange={(e) => {
              states.setCourse(e.target.value);
            }}
          />

          <Label htmlFor="price">
            Purchase price per unit ({states.currency})
          </Label>
          <Input
            type="number"
            id="price"
            placeholder="100"
            step="1"
            value={states.value}
            onChange={(e) => {
              states.setValue(e.target.value);
            }}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
}
