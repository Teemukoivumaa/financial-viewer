"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddFinancialFields } from "./addFields";
import { Search } from "../search/search";

export function AddFinancial() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-2 mr-4">
          Add new financial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Add financial</DialogTitle>
          <DialogDescription>
            Search for the financial you would like to add
          </DialogDescription>
        </DialogHeader>

        {/* <AddFinancialFields /> */}

        <Search setOpen={setOpen} />

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
