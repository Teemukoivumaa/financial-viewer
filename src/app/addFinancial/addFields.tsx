"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParsedFinancial, StockInformation } from "../utils/types";

export interface AddFinance {
  financial: ParsedFinancial;
  info: StockInformation;
}

interface AddProps {
  financeDetails: AddFinance;
  states: any;
}

export function AddFinancialFields({ financeDetails, states }: AddProps) {
  const { financial, info: financialInfo } = financeDetails;
  const [currency, setCurrency] = useState(financialInfo?.currency);

  const {
    type,
    setType,
    name,
    setName,
    owned,
    setOwned,
    course,
    setCourse,
    value,
    setValue,
    expenseRatio,
    setExpenseRatio,
    interestRate,
    setInterestRate,
    openDate,
    setOpenDate,
  } = states;

  console.debug(currency);

  useEffect(() => {
    setValue((Number(owned) * Number(course)).toFixed(3));
  }, [owned, course, setValue]);

  return (
    <div className="grid w-full items-center gap-4">
      <Label htmlFor="type">Type</Label>
      <Select
        onValueChange={(value) => setType(value)}
        defaultValue={String(type)}
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
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
            }}
          />
        </>
      )}

      {type === "stock" ? (
        <>
          <Label htmlFor="name">Stock name</Label>
          <Input
            type="string"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <Label htmlFor="amount">Number of shares</Label>
          <Input
            type="number"
            id="amount"
            placeholder="1"
            step="1"
            value={owned}
            onChange={(e) => {
              setOwned(e.target.value);
            }}
          />

          <Label htmlFor="currentPrice">
            Current market price ({currency})
          </Label>
          <Input
            type="number"
            id="currentPrice"
            placeholder="100"
            step="1"
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
            }}
          />

          <Label htmlFor="price">
            Purchase price per share currency ({currency})
          </Label>
          <Input
            type="number"
            id="price"
            placeholder="100"
            step="1"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </>
      ) : (
        ""
      )}
      {type === "fund" || type === "etf" ? (
        <>
          <Label htmlFor="name">Fund / ETF name</Label>
          <Input
            type="string"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <Label htmlFor="amount">Number of units / shares</Label>
          <Input
            type="number"
            id="amount"
            placeholder="1"
            step="1"
            value={owned}
            onChange={(e) => {
              setOwned(e.target.value);
            }}
          />

          <Label htmlFor="currentPrice">
            Current market price ({currency})
          </Label>
          <Input
            type="number"
            id="currentPrice"
            placeholder="100"
            step="1"
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
            }}
          />

          <Label htmlFor="price">
            Purchase price per unit / share ({currency})
          </Label>
          <Input
            type="number"
            id="price"
            placeholder="100"
            step="1"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />

          <Label htmlFor="expenseRatio">Expense ratio (%)</Label>
          <Input
            type="number"
            id="expenseRatio"
            placeholder="0.01%"
            step="0.01"
            value={expenseRatio}
            onChange={(e) => {
              setExpenseRatio(e.target.value);
            }}
          />
        </>
      ) : (
        ""
      )}

      {type === "account" ? (
        <>
          <Label htmlFor="name">Account name</Label>
          <Input
            type="string"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <Label htmlFor="interest">Interest rate (%)</Label>
          <Input
            type="number"
            id="amount"
            placeholder="1"
            step="1"
            value={interestRate}
            onChange={(e) => {
              setInterestRate(e.target.value);
            }}
          />

          <Label htmlFor="balance">Account balance</Label>
          <Input
            type="number"
            id="balance"
            placeholder="100"
            step="1"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />

          <Label htmlFor="expenseRatio">Expense ratio (%)</Label>
          <Input
            type="number"
            id="expenseRatio"
            placeholder="0.01%"
            step="0.01"
            value={expenseRatio}
            onChange={(e) => {
              setExpenseRatio(e.target.value);
            }}
          />

          <Label htmlFor="openDate">Date of account opening</Label>
          <Input
            type="date"
            id="openDate"
            placeholder="01.01.2024"
            value={openDate}
            onChange={(e) => {
              setOpenDate(e.target.value);
            }}
          />
        </>
      ) : (
        ""
      )}

      {type === "cryptocurrency" ? (
        <>
          <Label htmlFor="name">Cryptocurrency name</Label>
          <Input
            type="string"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <Label htmlFor="amount">Amount held</Label>
          <Input
            type="number"
            id="amount"
            placeholder="1"
            step="1"
            value={owned}
            onChange={(e) => {
              setOwned(e.target.value);
            }}
          />

          <Label htmlFor="currentPrice">
            Current market price ({currency})
          </Label>
          <Input
            type="number"
            id="currentPrice"
            placeholder="100"
            step="1"
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
            }}
          />

          <Label htmlFor="price">Purchase price per unit ({currency})</Label>
          <Input
            type="number"
            id="price"
            placeholder="100"
            step="1"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
}
