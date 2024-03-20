export const dynamic = "force-dynamic"; // static by default, unless reading the request
import { NextResponse } from "next/server";
import { ParsedFinancial } from "../../../utils/types";

function parseResponse(response: any[]): ParsedFinancial[] {
  return response
    .filter(
      (finance) =>
        finance.quoteType === "EQUITY" || finance.quoteType === "MUTUALFUND"
    ) // Filter out objects where quoteType is not EQUITY
    .map((finance) => ({
      symbol: finance.symbol,
      shortname: finance.shortname,
      exchDisp: finance.exchDisp,
      typeDisp: finance.typeDisp,
    }));
}

export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: { word: string } }
) {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v1/finance/search?q=${params.word}`,
    {
      method: "GET",
      next: { revalidate: 3600 },
    }
  );
  const data = await response?.json();

  return NextResponse.json(parseResponse(data?.quotes));
}
