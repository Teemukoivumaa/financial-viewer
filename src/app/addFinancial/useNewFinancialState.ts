import { useReducer, useEffect } from "react";
import { AddFinance } from "../utils/types";

const initialState = {
  type: "",
  name: "",
  owned: 0,
  course: "",
  value: 0,
  expenseRatio: 0,
  interestRate: 0,
  openDate: 0,
  currency: "",
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_OWNED":
      return { ...state, owned: action.payload };
    case "SET_COURSE":
      return { ...state, course: action.payload };
    case "SET_VALUE":
      return { ...state, value: action.payload };
    case "SET_EXPENSE_RATIO":
      return { ...state, expenseRatio: action.payload };
    case "SET_INTEREST_RATE":
      return { ...state, interestRate: action.payload };
    case "SET_OPEN_DATE":
      return { ...state, openDate: action.payload };
    case "SET_CURRENCY":
      return { ...state, currency: action.payload };
    case "SET_FINANCE_DETAILS":
      return {
        ...state,
        type: action.payload.type,
        name: action.payload.name,
        owned: action.payload.owned,
        course: action.payload.course,
        value: action.payload.value,
        expenseRatio: action.payload.expenseRatio,
        interestRate: action.payload.interestRate,
        openDate: action.payload.openDate,
        currency: action.payload.currency,
      };
    default:
      return state;
  }
}

function useNewFinancialState(finance: AddFinance | undefined) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Set finance details initially
  useEffect(() => {
    if (finance && finance.financial && finance.info) {
      const { typeDisp, shortname } = finance.financial;
      const { regularMarketPrice, currency } = finance.info;

      dispatch({
        type: "SET_FINANCE_DETAILS",
        payload: {
          type: typeDisp !== "Equity" ? typeDisp.toLowerCase() : "stock",
          name: shortname,
          course: regularMarketPrice,
          currency: currency,
        },
      });
    }
  }, [finance]);

  return {
    ...state,
    setType: (type: string) => dispatch({ type: "SET_TYPE", payload: type }),
    setName: (name: string) => dispatch({ type: "SET_NAME", payload: name }),
    setOwned: (owned: number) =>
      dispatch({ type: "SET_OWNED", payload: owned }),
    setCourse: (course: number) =>
      dispatch({ type: "SET_COURSE", payload: course }),
    setValue: (value: number) =>
      dispatch({ type: "SET_VALUE", payload: value }),
    setExpenseRatio: (ratio: number) =>
      dispatch({ type: "SET_EXPENSE_RATIO", payload: ratio }),
    setInterestRate: (rate: number) =>
      dispatch({ type: "SET_INTEREST_RATE", payload: rate }),
    setOpenDate: (date: string) =>
      dispatch({ type: "SET_OPEN_DATE", payload: date }),
    setCurrency: (currency: string) =>
      dispatch({ type: "SET_CURRENCY", payload: currency }),
    dispatch,
  };
}

export default useNewFinancialState;
