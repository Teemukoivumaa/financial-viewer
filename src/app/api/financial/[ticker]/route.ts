export const dynamic = "force-dynamic"; // static by default, unless reading the request
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: { ticker: string } }
) {
  const quote = await yahooFinance.quote(params.ticker);
  const { regularMarketPrice, currency } = quote;

  return NextResponse.json({ regularMarketPrice, currency });
}
