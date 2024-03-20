export const dynamic = "force-dynamic"; // static by default, unless reading the request
import { Financial } from "@/app/utils/types";
import { NextResponse } from "next/server";

export const revalidate = 3600;

let financials: Financial[] = [];

export async function GET() {
  console.debug("financials", financials);
  return NextResponse.json(financials);
}

export async function POST(request: Request) {
  const data = await request.json();
  console.log(data);
  financials = data;

  return NextResponse.json("OK");
}
