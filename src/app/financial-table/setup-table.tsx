"use client";

import { getData } from "../utils/getData";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import React from "react";
import RenderLineChart from "../chart/financialChart";

export default function SetupDataTable() {
  const data = getData();

  return (
    <>
      <DataTable columns={columns} data={data} />

      <RenderLineChart />
    </>
  );
}
