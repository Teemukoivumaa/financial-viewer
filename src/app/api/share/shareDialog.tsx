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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { getData } from "@/app/utils/getData";
import { importFinancials } from "@/app/utils/financialFunctions";

function generateRandomSixDigitNumber() {
  const min = 100000; // Minimum value for a 6-digit number
  const max = 999999; // Maximum value for a 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ShareFinancial() {
  const [open, setOpen] = useState(false);
  const [userFunction, setUserFunction] = useState("share");
  const [shareId, setShareId] = useState(generateRandomSixDigitNumber());
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const financials = getData();

    const response = await fetch(`/api/share/${shareId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(financials),
    });

    const data = await response.json();
    if (data === "OK") {
      toast("Financials shared!");
      setShared(true);
    } else {
      toast("Something went wrong with the sharing");
    }
  };

  const handleImport = async (shareId: string) => {
    const response = await fetch(`/api/share/${shareId}`, {
      method: "GET",
    });

    const data = await response.json();
    importFinancials(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Share or Import financials</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Share or Import financials</DialogTitle>
          <DialogDescription>
            Select what you would like to do
          </DialogDescription>
        </DialogHeader>

        <Select
          onValueChange={(value) => {
            setUserFunction(value);
            setShareId(generateRandomSixDigitNumber());
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Share" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="share">Share</SelectItem>
            <SelectItem value="import">Import</SelectItem>
          </SelectContent>
        </Select>

        {userFunction === "share" && (
          <>
            {shared ? (
              <>
                <p className="font-medium text-center">Your share ID is</p>
                <p className="font-bold text-xl text-center">{shareId}</p>
                <p className="text-sm text-center">
                  Use this code to import the financials
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-center">
                  Share your financials by clicking the button below
                </p>
                <Button onClick={handleShare}>Share Financials</Button>
              </>
            )}
          </>
        )}

        {userFunction === "import" && (
          <div>
            <Label htmlFor="shareIdInput">Enter Share ID:</Label>
            <Input
              type="text"
              id="shareIdInput"
              className="mb-5"
              maxLength={6}
              onChange={(e) => setShareId(e.target.value)}
            />
            <Button onClick={() => handleImport(shareId)}>
              Import Financials
            </Button>
          </div>
        )}

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
