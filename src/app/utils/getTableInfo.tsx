import { StockInformation } from "./types";
import React, { useState, useEffect } from "react";

export async function requestCourse(ticker: string) {
  const response = await fetch(`/api/financial/${ticker}`, {
    next: { revalidate: 3600 },
  });
  return await response.json();
}

export function calculateCurrentValue(marketPrice: string, owned: Number) {
  return Number(marketPrice) * Number(owned);
}

export async function getTickerData(
  ticker: string,
  initialInvestment: Number,
  owned: Number,
  currency: string
) {
  const [financeInformation, setFinanceInformation] =
    useState<StockInformation | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await requestCourse(ticker);
      setFinanceInformation(data);
    };

    fetchData();
  }, [ticker]);

  if (!financeInformation) {
    return <p className="text-right font-medium">Fetching...</p>; // or any other loading indicator
  }

  const currentValue = calculateCurrentValue(financeInformation.regularMarketPrice, owned)
  const gainOrLoss = currentValue - Number(initialInvestment);

  const formatted = new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: `${currency}`,
  }).format(currentValue);

  const formattedGain = new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: `${currency}`,
  }).format(gainOrLoss);

  return (
    <>
      <div className="text-right font-medium">
        {formatted}
        <p className={gainOrLoss >= 0 ? "text-green-500" : "text-red-500"}>
          ({formattedGain})
        </p>
      </div>
    </>
  );
}

export async function getCourseNow(ticker: string, currency: string) {
  const [financeInformation, setFinanceInformation] =
    useState<StockInformation | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await requestCourse(ticker);
      setFinanceInformation(data);
    };

    fetchData();
  }, [ticker]);

  if (!financeInformation) {
    return <p className="text-right font-medium">Fetching...</p>; // or any other loading indicator
  }

  const currentPrice = Number(financeInformation.regularMarketPrice);

  const formatted = new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: `${currency}`,
  }).format(currentPrice);

  return (
    <>
      <div className="text-right font-medium">{formatted}</div>
    </>
  );
}
