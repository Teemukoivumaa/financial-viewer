import { Transaction } from "../financial-table/columns";
import { toast } from "sonner";

export function saveFinancial(
  newFinancial: Transaction,
  oldFinancial: Transaction
) {
  if (typeof window === "undefined" || newFinancial === undefined) return;

  const financialObject = JSON.parse(
    localStorage.getItem("financials") || "[]"
  );

  let newFinancialObject = financialObject.filter((financial: Transaction) => {
    return JSON.stringify(financial) !== JSON.stringify(oldFinancial);
  });
  newFinancialObject?.push(newFinancial);

  localStorage.setItem("financials", JSON.stringify(newFinancialObject));

  toast("Saved modifications!");
}

export function deleteFinancial(oldFinancial: Transaction) {
  if (typeof window === "undefined" || oldFinancial === undefined) return;

  const financialObject = JSON.parse(
    localStorage.getItem("financials") || "[]"
  );

  let newFinancialObject = financialObject.filter((financial: Transaction) => {
    return JSON.stringify(financial) !== JSON.stringify(oldFinancial);
  });

  localStorage.setItem("financials", JSON.stringify(newFinancialObject));

  toast("Financial deleted successfully!");
}
