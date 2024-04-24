export type Financial = {
  title: string;
  ticker: string;
  type: string;
  date: string;
  amount: number;
  owned: number;
  course: string;
  currency: string;
};

export interface ParsedFinancial {
  symbol: string;
  shortname: string;
  exchDisp: string;
  typeDisp: string;
}

export interface StockInformation {
  regularMarketPrice: string;
  currency: string;
}

export interface AddFinance {
  financial: ParsedFinancial;
  info: StockInformation;
}

export type FinancialProductType = "ETF" | "Fund";
