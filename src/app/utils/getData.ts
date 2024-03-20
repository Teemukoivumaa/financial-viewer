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
