import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ParsedFinancial, StockInformation } from "../../utils/types";
import { AddFinance } from "../addFields";

async function returnFinancial(
  financial: ParsedFinancial,
  index: number,
  setFinance: any
) {
  const response = await fetch(`/api/financial/${financial.symbol}`, {
    next: { revalidate: 3600 },
  });

  const financeInformation: StockInformation = await response.json();

  return (
    <li key={index}>
      <div
        onClick={() =>
          setFinance({
            financial: financial,
            info: financeInformation,
          } as AddFinance)
        }
        className="cursor-pointer dark:hover:bg-gray-900 hover:bg-gray-200 transition-colors duration-300 ease-in-out rounded p-2 flex flex-row"
      >
        <div className="basis-1/2">
          <h4 className="text-xs sm:text-sm font-medium leading-none">
            {financial.shortname}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {financial.symbol}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {financial.exchDisp}
          </p>
        </div>
        <div className="basis-1/4 p-2">
          <h4 className="text-xs sm:text-sm font-medium leading-none">
            {financial.typeDisp}
          </h4>
        </div>
        <div className="basis-1/4">
          <h3 className="text-xs sm:text-sm font-medium">Latest value:</h3>
          <h3 className="text-xs sm:text-sm font-medium">
            {`${financeInformation.regularMarketPrice} ${financeInformation.currency}`}
          </h3>
        </div>
      </div>

      <Separator className="my-1 h-0.5" />
    </li>
  );
}

async function searchFinancial(searchQuery: string, setFinance: any) {
  if (searchQuery.length <= 0)
    return <p className="text-md">Type something to search</p>;

  const response = await fetch(`/api/search/${searchQuery}`, {
    next: { revalidate: 3600 },
  });

  const financial = response.status === 200 ? await response.json() : [];

  if (financial.length <= 0)
    return <p className="text-md">Could not find any results</p>;

  return (
    <>
      <ul className="mt-4">
        {financial.map(
          async (financial: ParsedFinancial, index: number) =>
            await returnFinancial(financial, index, setFinance)
        )}
      </ul>
    </>
  );
}

interface SearchProps {
  setFinance: any;
}

export function Search({ setFinance }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null as any);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    setSearching(true);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearching(false);
  };

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSearchResult(undefined);
      setSearching(false);
      return;
    }
    // Perform the search after 3000ms debounce
    const delayDebounceFn = setTimeout(() => {
      setSearchResult(searchFinancial(searchQuery, setFinance));
      setSearching(false);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, setFinance]);

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          setFinance({} as AddFinance);
        }}
        className="mb-2"
      >
        Add manually
      </Button>

      <div className="flex items-center">
        <Input
          type="text"
          id="search"
          placeholder="Search"
          value={searchQuery}
          onChange={handleChange}
          className="mr-2"
        />
        <Button variant="outline" size="icon" onClick={handleClear}>
          <Cross1Icon className="h-4 w-4" />
        </Button>
      </div>
      {searching ? (
        <p className="text-s sm:text-md">Searching...</p>
      ) : (
        <Suspense fallback={<p className="text-s sm:text-md">Searching...</p>}>
          {searchResult}
        </Suspense>
      )}
    </>
  );
}
