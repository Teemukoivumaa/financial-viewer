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

function sortByDateAscending(array: DocumentData[] | { date: string }[]) {
  return array.sort((a, b) => {
    const dateA: Date = new Date(a.date.split(".").reverse().join("."));
    const dateB: Date = new Date(b.date.split(".").reverse().join("."));

    return dateA.getTime() - dateB.getTime();
  });
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
  const history = await Promise.all(promises);

  return history;
}

async function setHistoryForToday(db: any, id: string): Promise<void> {
  const today = new Date();
  const date = `${today.getDate()}.${
    today.getMonth() + 1
  }.${today.getFullYear()}`;

  const totalValueStr = localStorage.getItem("totalValue");
  if (!totalValueStr) {
    console.error("Total value not found in localStorage");
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
      <ResponsiveContainer>
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
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
