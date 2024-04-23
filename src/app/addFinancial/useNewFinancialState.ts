import { useState } from "react";

function useNewFinancialState() {
  const [type, setType] = useState(String);
  const [name, setName] = useState(String);
  const [owned, setOwned] = useState(Number);
  const [course, setCourse] = useState(String);
  const [value, setValue] = useState(Number);
  const [expenseRatio, setExpenseRatio] = useState(Number);
  const [interestRate, setInterestRate] = useState(Number);
  const [openDate, setOpenDate] = useState(Number);

  return {
    type,
    setType,
    name,
    setName,
    owned,
    setOwned,
    course,
    setCourse,
    value,
    setValue,
    expenseRatio,
    setExpenseRatio,
    interestRate,
    setInterestRate,
    openDate,
    setOpenDate,
  };
}

export default useNewFinancialState;
