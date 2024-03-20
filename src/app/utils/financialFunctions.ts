import { Financial } from "./types";
import { toast } from "sonner";

export function saveFinancial(
  newFinancial: Financial,
  oldFinancial: Financial
) {
  if (typeof window === "undefined" || newFinancial === undefined) return;

  const financialObject = JSON.parse(
    localStorage.getItem("financials") || "[]"
  );

  let newFinancialObject = financialObject.filter((financial: Financial) => {
    return JSON.stringify(financial) !== JSON.stringify(oldFinancial);
  });
  newFinancialObject?.push(newFinancial);

  localStorage.setItem("financials", JSON.stringify(newFinancialObject));

  toast("Saved modifications!");
}

export function deleteFinancial(oldFinancial: Financial) {
  if (typeof window === "undefined" || oldFinancial === undefined) return;

  const financialObject = JSON.parse(
    localStorage.getItem("financials") || "[]"
  );

  let newFinancialObject = financialObject.filter((financial: Financial) => {
    return JSON.stringify(financial) !== JSON.stringify(oldFinancial);
  });

  localStorage.setItem("financials", JSON.stringify(newFinancialObject));

  toast("Financial deleted successfully!");
}

export function importFinancials(newFinancials: Financial[]) {
  if (typeof window === "undefined" || newFinancials === undefined) return;

  const financialObject = JSON.parse(
    localStorage.getItem("financials") || "[]"
  );

  // Combine newFinancials array with existing financialObject
  const newFinancialObject = [...financialObject, ...newFinancials];

  // Update localStorage with the combined financial object
  localStorage.setItem("financials", JSON.stringify(newFinancialObject));

  toast("Financials imported successfully!");
}
