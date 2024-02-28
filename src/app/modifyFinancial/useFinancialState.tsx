import { useState } from "react";
import { Transaction } from "../financial-table/columns";

function useFinancialState(initialFinancial: Transaction) {
  const [owned, setOwned] = useState(Number(initialFinancial.owned) ?? 0);
  const [course, setCourse] = useState(Number(initialFinancial.course) ?? 0);
  const [value, setValue] = useState(Number(initialFinancial.amount) ?? 0);

  return { owned, setOwned, course, setCourse, value, setValue };
}

export default useFinancialState;
