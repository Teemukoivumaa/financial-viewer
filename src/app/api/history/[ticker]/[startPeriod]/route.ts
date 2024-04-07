export const dynamic = "force-dynamic"; // static by default, unless reading the request
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: { ticker: string; startPeriod: string } }
) {
  const history = await yahooFinance.historical(params.ticker, {
    period1: params.startPeriod,
  });

  return NextResponse.json(history);
}
