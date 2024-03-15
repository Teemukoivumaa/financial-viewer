export const dynamic = "force-dynamic"; // static by default, unless reading the request
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

interface ParsedStock {
  symbol: string;
  shortname: string;
}

export async function generateStaticParams() {
  return [{ ticker: "APPL" }];
}

export async function GET(
  request: Request,
  { params }: { params: { ticker: string } }
) {
  console.log(
    `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${params.ticker}?` +
      new URLSearchParams({
        modules: "financialData",
      })
  );

  const quote = await yahooFinance.quote(params.ticker);
  const { regularMarketPrice, currency } = quote;

  return NextResponse.json({ regularMarketPrice, currency });
}
