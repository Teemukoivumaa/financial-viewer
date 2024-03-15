import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { toast } from "sonner";

interface Stock {
  symbol: string;
  shortname: string;
}

interface StockInformation {
  regularMarketPrice: string;
  currency: string;
}

function addFinancial(
  stock: Stock,
  stockInformation: StockInformation,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (typeof window === "undefined" || stock === undefined) return;

  const financialObject = JSON.parse(
    localStorage.getItem("financials") || "[]"
  );

  financialObject?.push({
    title: `${stock.shortname}`,
    ticker: `${stock.symbol}`,
    date: new Date().toLocaleDateString(),
    type: "Stock",
    amount: 0,
    owned: 0,
    course: stockInformation.regularMarketPrice,
    currency: stockInformation.currency,
  });

  localStorage.setItem("financials", JSON.stringify(financialObject));

  toast("New financial has been added!");

  setTimeout(() => {
    setOpen(false);
  }, 500);
}

async function returnStock(
  stock: Stock,
  index: number,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const backend = process.env.BACKEND ?? "https://financial-viewer.vercel.app";

  const response = await fetch(`${backend}/api/stock/${stock.symbol}`);

  const stockInformation: StockInformation = await response.json();

  return (
    <li key={index}>
      <div
        onClick={() => addFinancial(stock, stockInformation, setOpen)}
        className="cursor-pointer dark:hover:bg-gray-900 hover:bg-gray-200 transition-colors duration-300 ease-in-out rounded p-2 flex justify-between items-center"
      >
        <div>
          <h4 className="text-sm font-medium leading-none">
            {stock.shortname}
          </h4>
          <p className="text-sm text-muted-foreground">{stock.symbol}</p>
        </div>
        <div className="flex flex-col items-end">
          <h3 className="text-sm font-medium">Latest value:</h3>
          <h3 className="text-sm font-medium">
            {`${stockInformation.regularMarketPrice} ${stockInformation.currency}`}
          </h3>
        </div>
      </div>

      <Separator className="my-2 h-0.5" />
    </li>
  );
}

async function searchFinancial(
  searchQuery: string,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (searchQuery.length <= 0)
    return <p className="text-md">Type something to search</p>;

  const backend = process.env.BACKEND ?? "https://financial-viewer.vercel.app";

  const response = await fetch(`${backend}/api/search/${searchQuery}`);

  const stocks = await response.json();

  if (stocks.length <= 0)
    return <p className="text-md">Could not find any results</p>;

  return (
    <>
      <ul className="mt-4">
        {stocks.map(
          async (stock: Stock, index: number) =>
            await returnStock(stock, index, setOpen)
        )}
      </ul>
    </>
  );
}

interface SearchProps {
  label?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Search({ label, setOpen }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      {label ?? <Label htmlFor="search">Search</Label>}

      <Input
        type="text"
        id="search"
        placeholder="Search"
        value={searchQuery}
        onChange={handleChange}
      />

      <Suspense fallback={<p className="text-md">Searching...</p>}>
        {searchFinancial(searchQuery, setOpen)}
      </Suspense>
    </>
  );
}
