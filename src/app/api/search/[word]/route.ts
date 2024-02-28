import { NextResponse } from "next/server";

interface ParsedStock {
  symbol: string;
  shortname: string;
}

function parseStocks(response: any[]): ParsedStock[] {
  return response
    .filter((stock) => stock.quoteType === "EQUITY") // Filter out objects where quoteType is not EQUITY
    .map((stock) => ({
      symbol: stock.symbol,
      shortname: stock.shortname,
    }));
}

export async function generateStaticParams() {
  return [{ word: "apple" }];
}

export async function GET(
  request: Request,
  { params }: { params: { word: string } }
) {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v1/finance/search?q=${params.word}`,
    {
      method: "GET",
    }
  );
  const data = await response.json();

  return NextResponse.json(parseStocks(data?.quotes));
}
