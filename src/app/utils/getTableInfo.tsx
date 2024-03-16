import { StockInformation } from "./types";
import { ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";

export async function getTickerData(
  ticker: string,
  initialInvestment: Number,
  owned: Number,
  currency: string
) {
  const response = await fetch(`/api/financial/${ticker}`);
  const financeInformation: StockInformation = await response.json();

  const currentPrice = Number(financeInformation.regularMarketPrice);
  const currentValue = currentPrice * Number(owned);
  const gainOrLoss = currentValue - Number(initialInvestment);

  const formatted = new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: `${currency}`,
  }).format(currentValue);

  const formattedGain = new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: `${currency}`,
  }).format(gainOrLoss);

  return (
    <>
      <div className="text-right font-medium">
        {formatted}
        <p className={gainOrLoss >= 0 ? "text-green-500" : "text-red-500"}>
          ({formattedGain})
        </p>
      </div>
    </>
  );
}
