import { StockInformation } from "./types";

export function getData() {
  if (typeof window === "undefined") return [];

  return JSON.parse(localStorage.getItem("financials") || "[]");
}
