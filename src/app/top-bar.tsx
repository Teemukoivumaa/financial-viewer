"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { ShareFinancial } from "./api/share/shareDialog";

export function TopBar() {
  return (
    <div className="dark:bg-gray-800 bg-zinc-100 p-4 flex">
      <h1 className="text-lg sm:text-xl font-bold">Financial Viewer</h1>
      <div className="flex flex-row ">
        <ShareFinancial />
        <ModeToggle />
      </div>
    </div>
  );
}
