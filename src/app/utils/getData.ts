import { Financial } from "./types";

export function getData() {
  if (typeof window === "undefined") return [];

  return JSON.parse(localStorage.getItem("financials") || "[]");
}

export function getTableColumn() {
  if (typeof window === "undefined") return [];

  return JSON.parse(localStorage.getItem("table-settings") || "[]");
}

export function setTableColumn(column: string, state: boolean) {
  if (typeof window === "undefined") return;

  const existingTableSettings = JSON.parse(
    localStorage.getItem("table-settings") || "{}"
  );
  const newTableSettings = { ...existingTableSettings, [column]: state };
  localStorage.setItem("table-settings", JSON.stringify(newTableSettings));
}

export async function fetchHistory() {
  const financials: [Financial] = getData();

  const today = new Date();
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const formattedDate = `${fiveDaysAgo.getFullYear()}-${(
    fiveDaysAgo.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${fiveDaysAgo.getDate().toString().padStart(2, "0")}`;

  let newHistory: { value: number; date: any }[] = [];

  for (const financial of financials) {
    const ticker = financial.ticker;
    const response = await fetch(`/api/history/${ticker}/${formattedDate}`, {
      next: { revalidate: 3600 },
    });
    const financialHistories = await response.json();

    financialHistories.map((financialHistory: { close: any; date: any }) => {
      const closeAmount = financialHistory.close;
      const date = financialHistory.date;
      const price = closeAmount * financial.owned;

      newHistory.push({ value: price, date: date });
    });
  }

  return newHistory;
}
