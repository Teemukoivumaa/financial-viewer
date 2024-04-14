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

export async function fetchHistory(firstHistory: string, days: Number) {
  const financials: [Financial] = getData();

  let inputDate = null;
  let formattedInput = null;
  if (firstHistory) {
    const [day, month, year] = firstHistory.split(".").map(Number);
    // Create a new date object from the parsed input date
    inputDate = new Date(year, month - 1, day);
    formattedInput = `${inputDate.getFullYear()}-${(inputDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${inputDate.getDate().toString().padStart(2, "0")}`;
  } else {
    inputDate = new Date();
  }

  const inputDaysAgo: Date = new Date(inputDate);
  inputDaysAgo.setDate(inputDaysAgo.getDate() - Number(days));

  const formattedDate = `${inputDaysAgo.getFullYear()}-${(
    inputDaysAgo.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${inputDaysAgo.getDate().toString().padStart(2, "0")}`;

  let newHistory: { value: number; date: any }[] = [];

  for (const financial of financials) {
    const ticker = financial.ticker;
    const response = await fetch(
      formattedInput
        ? `/api/history/${ticker}/${formattedDate}/${formattedInput}`
        : `/api/history/${ticker}/${formattedDate}`,
      {
        next: { revalidate: 3600 },
      }
    );
    const financialHistories = await response.json();

    financialHistories.map((financialHistory: { close: any; date: any }) => {
      const closeAmount = financialHistory.close;
      const date = financialHistory.date;

      const price = (closeAmount * financial.owned).toFixed(3);

      newHistory.push({ value: Number(price), date: date });
    });
  }

  return newHistory;
}
