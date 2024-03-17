"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Financial } from "../utils/types";
import { Label } from "@/components/ui/label";

interface ModifyProps {
  financial: Financial;
  states: any;
}

export function ModifyFinancial({ financial, states }: ModifyProps) {
  const { owned, setOwned, course, setCourse, value, setValue } = states;

  useEffect(() => {
    setValue((Number(owned) * Number(course)).toFixed(3));
  }, [owned, course, setValue]);

  return (
    <div className="grid w-full items-center gap-4">
      <Label htmlFor="owned">Amount owned</Label>
      <Input
        type="number"
        step="0.1"
        id="owned"
        placeholder="Amount owned"
        value={owned}
        onChange={(e) => {
          setOwned(Number(e.target.value));
        }}
      />

      <Label htmlFor="course">Median course</Label>
      <Input
        type="number"
        step="0.01"
        id="course"
        placeholder="Median course"
        value={course}
        onChange={(e) => {
          setCourse(Number(e.target.value));
        }}
      />

      <Label htmlFor="value">Value in {financial.currency}</Label>
      <Input
        type="number"
        step="0.01"
        id="value"
        placeholder="Value"
        value={value}
        onChange={(e) => {
          setValue(Number(e.target.value));
        }}
      />
    </div>
  );
}
