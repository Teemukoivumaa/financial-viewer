import useAsync from "react-use/lib/useAsync";
import { calculateCurrentValue, requestCourse } from "./getTableInfo";

export function calculateAllValueNow(
  table: any,
  filterValue: string,
  refresh: boolean
) {
  return useAsync(async () => {
    try {
      const rows = table.getCoreRowModel().flatRows;

      if (rows?.length <= 0) {
        return "";
      }

      const totalValue = await Promise.all(
        rows.map(async (row: any) => {
          const type = row.getValue("type") as string;
          if (filterValue && type !== filterValue) {
            return 0;
          }

          const ticker = row.getValue("ticker") as string;
          const owned = Number(row.getValue("owned"));

          const { regularMarketPrice } = await requestCourse(ticker);

          return calculateCurrentValue(regularMarketPrice, owned);
        })
      );

      // Calculate the sum of all current values
      const sumValue = totalValue.reduce((acc, curr) => acc + curr, 0);

      const formatted = new Intl.NumberFormat("fi-FI", {
        style: "currency",
        currency: `EUR`,
      }).format(sumValue);

      localStorage.setItem("totalValue", formatted);

      return formatted;
    } catch (error) {
      throw new Error("Failed to calculate total value");
    }
  }, [table, refresh, filterValue]);
}

export function calculateAllInitialInvestment(
  table: any,
  filterValue: string,
  refresh: boolean
) {
  return useAsync(async () => {
    try {
      const rows = table.getCoreRowModel().flatRows;

      if (rows?.length <= 0) {
        return "";
      }

      const totalValue = await Promise.all(
        rows.map(async (row: any) => {
          const type = row.getValue("type") as string;
          if (filterValue && type !== filterValue) {
            return 0;
          }

          return Number(row.getValue("amount"));
        })
      );

      // Calculate the sum of all current values
      const sumValue = totalValue.reduce((acc, curr) => acc + curr, 0);

      const formatted = new Intl.NumberFormat("fi-FI", {
        style: "currency",
        currency: `EUR`,
      }).format(sumValue);

      localStorage.setItem("totalValue", formatted);

      return formatted;
    } catch (error) {
      throw new Error("Failed to calculate total value");
    }
  }, [table, refresh, filterValue]);
}
