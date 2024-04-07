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
  Text,
  ResponsiveContainer,
} from "recharts";
import { getTotalValueFormatted, getUserId } from "../utils/financialFunctions";
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
import { fetchHistory } from "../utils/getData";

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
    const date = new Date(item.date).toLocaleDateString("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); // Format the date

    if (result[date]) {
      result[date] += item.value; // If the date already exists, add the value to it
    } else {
      result[date] = item.value; // If it's a new date, initialize it with the value
    }
  }

  return Object.keys(result).map((date) => ({ date, value: result[date] }));
}

async function fetchMissingHistory(history: any[]) {
  if (history.length >= 5) {
    return history; // No need to fetch more history if we already have 5 or more entries
  }

  let newHistory = await fetchHistory();

  const totalValueToday = getTotalValueFormatted();

  if (totalValueToday) {
    newHistory.push({
      value: Number(totalValueToday),
      date: new Date().toISOString(),
    });
  }

  return sumValuesByDate(newHistory);
}

async function getHistory(db: any, id: string): Promise<DocumentData[]> {
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

  // Wait for all promises to resolve
  let history = await Promise.all(promises);

  history = await fetchMissingHistory(history);

  return history;
}

async function setHistoryForToday(db: any, id: string): Promise<void> {
  const today = new Date();
  const date = `${today.getDate()}.${
    today.getMonth() + 1
  }.${today.getFullYear()}`;

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
    where("date", "==", date),
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
          date: date,
          env: process.env.NEXT_PUBLIC_env,
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#353535] p-3 shadow text-white">
        <span>{label}</span>
        <br />
        {payload.map(
          (
            ele: {
              name: any;
              value: any;
            },
            index: React.Key | null | undefined
          ) => (
            <>
              <small
                key={index}
                className="text-xs sm:text-sm font-medium text-white"
              >
                {ele.name}: {ele.value}
              </small>
              <br />
            </>
          )
        )}
      </div>
    );
  }
  return null;
};

export const formatYAxis = (tickObject: any) => {
  const {
    payload: { value },
  } = tickObject;

  tickObject["fill"] = "#857F74";
  // localStorage.getItem("theme") === "light" ? "#000" : "#fff";

  return <Text {...tickObject}>{value}</Text>;
};

const test = () => {
  console.debug("hello");
};

export default function RenderLineChart() {
  const [userId, setUserId] = useState<string | null>(null);
  const [db, setDb] = useState<any>(null);

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
  const { loading: loadingHistory, value: history } = useAsync(async () => {
    if (db && userId) {
      return await getHistory(db, userId);
    }
    return null;
  }, [db, userId]);

  if (loadingHistory) {
    return <div className="mt-10">Loading history...</div>;
  }

  if (!history) {
    return (
      <div className="mt-10">No history data found yet. Refresh the page.</div>
    );
  }

  const sortedData = sortByDateAscending(history);

  return (
    <div
      className="max-w-screen-xl mt-10"
      style={{ width: "100%", height: 500 }}
    >
      <ResponsiveContainer className={"text-xs sm:text-sm font-medium"}>
        <AreaChart
          width={1000}
          height={700}
          data={sortedData ?? []}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3" />
          <XAxis
            tick={(tickObject) => formatYAxis(tickObject)}
            dataKey="date"
          />
          <YAxis tick={(tickObject) => formatYAxis(tickObject)} />
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
