"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

function getData() {
  if (typeof window === "undefined") return [];

  return JSON.parse(localStorage.getItem("financials") || "[]");
}

export default function SetupDataTable() {
  const [refresh, setRefresh] = useState(false);
  const data = getData();

  const handleRefresh = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  return (
    <>
      <Button onClick={handleRefresh} variant="outline" className="mb-2">
        <ReloadIcon className="mr-2 h-4 w-4" /> Refresh table
      </Button>
      <DataTable columns={columns} data={data} />
    </>
  );
}
