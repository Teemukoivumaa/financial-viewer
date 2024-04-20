"use client";

import React, { useState, useEffect } from "react";
import useAsync from "react-use/lib/useAsync";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getUserId } from "../utils/financialFunctions";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  DocumentData,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore/lite";
import { getAuth, signInAnonymously } from "firebase/auth";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { fetchHistory } from "../utils/getData";
import { generateTodaysDate } from "../utils/date";
import { CustomTooltip, formatAxis } from "./chartCustomization";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function sortByDateAscending(array: DocumentData[] | { date: string }[]) {
  return array.sort((a, b) => {
    const dateA: Date = new Date(a.date.split(".").reverse().join("."));
    const dateB: Date = new Date(b.date.split(".").reverse().join("."));

    return dateA.getTime() - dateB.getTime();
  });
}

function sumValuesByDate(data: { value: number; date: string }[]) {
  const result: { [date: string]: number } = {};

  for (const item of data) {
    const date = new Date(item.date).toLocaleDateString();

    if (result[date]) {
      result[date] += item.value; // If the date already exists, add the value to it
    } else {
      result[date] = item.value; // If it's a new date, initialize it with the value
    }
  }

  const values = Object.keys(result).map((date) => ({
    date,
    value: Number(result[date]).toFixed(2),
  }));

  return values;
}

function formatDates(data: DocumentData[]) {
  return data.map((item) => {
    return {
      value: item.value,
      date: new Date(item.date).toLocaleDateString(),
    };
  });
}

async function fetchMissingHistory(
  firstDate: string,
  history: any[],
  days: Number
) {
  const generatedHistory = await fetchHistory(firstDate, days);

  const newHistory = sumValuesByDate(generatedHistory.concat(history));

  return sortByDateAscending(newHistory);
}

async function getHistory(
  db: any,
  id: string,
  generateHistory: boolean,
  days: Number
): Promise<DocumentData[]> {
  const queryHistory = query(
    collection(db, "financialHistory"),
    where("user", "==", id)
  );

  const querySnapshot = await getDocs(queryHistory);

  // Map over the documents and return a Promise for each one
  const promises = querySnapshot.docs.map(async (doc) => {
    const values = doc.data();
    return values;
  });

  const rawHistory = await Promise.all(promises);

  const history = formatDates(rawHistory);

  // Wait for all promises to resolve
  let sortedHistory = sortByDateAscending(history);

  if (generateHistory) {
    sortedHistory = await fetchMissingHistory(
      sortedHistory[0]?.date,
      rawHistory,
      days
    );
  }

  return sortedHistory;
}

async function setHistoryForToday(db: any, id: string): Promise<void> {
  const today = generateTodaysDate();

  const totalValueStr = localStorage.getItem("totalValue");
  if (!totalValueStr) {
    return;
  }
  const modifiedString = totalValueStr
    .replace(",", ".")
    .replace(/\s/g, "")
    .replace("€", "")
    .trim();

  const historyCollection = collection(db, "financialHistory");
  const queryHistory = query(
    historyCollection,
    where("date", "==", today),
    where("user", "==", id)
  );
  const querySnapshot = await getDocs(queryHistory);
  const promises = querySnapshot.docs.map(async (doc) => {
    return doc.id;
  });
  const history = await Promise.all(promises);

  // Call the addFinancialDocument function to add a document with the generated date and retrieved value
  const auth = getAuth();
  signInAnonymously(auth)
    .then(async () => {
      if (history[0]) {
        const historyRef = doc(db, "financialHistory", history[0]);
        await updateDoc(historyRef, {
          value: modifiedString,
        });
      } else {
        await addDoc(historyCollection, {
          value: modifiedString,
          user: id,
          date: today,
          env: process.env.NEXT_PUBLIC_env,
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function RenderLineChart() {
  const [userId, setUserId] = useState<string | null>(null);
  const [db, setDb] = useState<any>(null);
  const [generateHistory, setGenerateHistory] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    // Initialize Firebase app and Firestore
    const env = process.env;
    const firebaseConfig = {
      apiKey: env.NEXT_PUBLIC_apiKey,
      authDomain: env.NEXT_PUBLIC_authDomain,
      projectId: env.NEXT_PUBLIC_projectId,
      storageBucket: env.NEXT_PUBLIC_storageBucket,
      messagingSenderId: env.NEXT_PUBLIC_messagingSenderId,
      appId: env.NEXT_PUBLIC_appId,
      measurementId: env.NEXT_PUBLIC_measurementId,
    };

    const app = initializeApp(firebaseConfig);
    setDb(getFirestore(app));

    const id = getUserId();
    if (id) setUserId(id);
  }, [process]);

  // Set financial history for today when db and userId are ready
  useAsync(async () => {
    if (db && userId) {
      await setHistoryForToday(db, userId);
    }
  }, [db, userId]);

  // Fetch financial history
  const { value: history } = useAsync(async () => {
    if (db && userId) {
      return await getHistory(db, userId, generateHistory, days);
    }
    return null;
  }, [db, userId, generateHistory, days]);

  return (
    <div
      className="max-w-screen-xl mt-10"
      style={{ width: "100%", height: 500 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="automatic-generation"
          checked={generateHistory}
          onCheckedChange={(value) => setGenerateHistory(value)}
        />
        <Label htmlFor="automatic-generation">
          Automatic generation (Experimental)
        </Label>
        {generateHistory ? (
          <Select
            onValueChange={(value) => setDays(Number(value))}
            defaultValue={String(days)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Days to generate?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="60">60 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          ""
        )}
      </div>
      <ResponsiveContainer className={"text-xs sm:text-sm font-medium"}>
        <AreaChart
          width={1000}
          height={700}
          data={history ?? []}
          margin={{
            top: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3" />
          <XAxis
            tick={(tickObject) => formatAxis(tickObject)}
            dataKey="date"
            interval={"preserveStartEnd"}
          />
          <YAxis tick={(tickObject) => formatAxis(tickObject)} />
          <Tooltip
            content={<CustomTooltip active={false} payload={[]} label={""} />}
          />
          <Area
            className={"text-black"}
            type="linear"
            dataKey="value"
            name="Price"
            dot={true}
            stroke="#000"
            fill="#3C6E71"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
