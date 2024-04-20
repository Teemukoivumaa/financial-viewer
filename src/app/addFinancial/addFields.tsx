"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddFinancialFields() {
  const [type, setType] = useState("");

  return (
    <div className="grid w-full items-center gap-4">
      <Label htmlFor="type">Type</Label>
      <Select onValueChange={(value) => setType(value)} defaultValue={type}>
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

      {type === "stock" ? (
        <>
          <Label htmlFor="name">Stock name</Label>
          <Input type="string" id="name" placeholder="Name" />

          <Label htmlFor="amount">Number of shares</Label>
          <Input type="number" id="amount" placeholder="1" step="1" />

          <Label htmlFor="price">Purchase price per share</Label>
          <Input type="number" id="price" placeholder="100" step="1" />

          <Label htmlFor="currentPrice">Current market price</Label>
          <Input type="number" id="currentPrice" placeholder="100" step="1" />
        </>
      ) : (
        ""
      )}
      {type === "fund" || type === "etf" ? (
        <>
          <Label htmlFor="name">Fund / ETF name</Label>
          <Input type="string" id="name" placeholder="Name" />

          <Label htmlFor="amount">Number of units / shares</Label>
          <Input type="number" id="amount" placeholder="1" step="0.1" />

          <Label htmlFor="price">Purchase price per unit / share</Label>
          <Input type="number" id="price" placeholder="100" step="1" />

          <Label htmlFor="currentPrice">Current market price</Label>
          <Input type="number" id="currentPrice" placeholder="100" step="1" />

          <Label htmlFor="expenseRatio">Expense ratio (%)</Label>
          <Input
            type="number"
            id="expenseRatio"
            placeholder="0.01%"
            step="0.01"
          />
        </>
      ) : (
        ""
      )}

      {type === "account" ? (
        <>
          <Label htmlFor="name">Account name</Label>
          <Input type="string" id="name" placeholder="Name" />

          <Label htmlFor="interest">Interest rate (%)</Label>
          <Input type="number" id="amount" placeholder="0.1" step="0.1" />

          <Label htmlFor="balance">Account balance</Label>
          <Input type="number" id="balance" placeholder="100" step="1" />

          <Label htmlFor="expenseRatio">Expense ratio (%)</Label>
          <Input
            type="number"
            id="expenseRatio"
            placeholder="0.01%"
            step="0.01"
          />

          <Label htmlFor="openDate">Date of account opening</Label>
          <Input type="date" id="openDate" placeholder="01.01.2024" />
        </>
      ) : (
        ""
      )}

      {type === "cryptocurrency" ? (
        <>
          <Label htmlFor="name">Cryptocurrency name</Label>
          <Input type="string" id="name" placeholder="Name" />

          <Label htmlFor="amount">Amount held</Label>
          <Input type="number" id="amount" placeholder="1" step="0.1" />

          <Label htmlFor="price">Purchase price per unit</Label>
          <Input type="number" id="price" placeholder="100" step="1" />

          <Label htmlFor="currentPrice">Current market price</Label>
          <Input type="number" id="currentPrice" placeholder="100" step="1" />
        </>
      ) : (
        ""
      )}
    </div>
  );
}
