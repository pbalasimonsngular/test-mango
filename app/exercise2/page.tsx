"use client";

import { useEffect, useState } from "react";
import { Range } from "../components";
import { getFixedRange } from "../services/range";

import styles from "./page.module.css";
import { FixedRange } from "../components/models/range";

export default function Exercise1() {
  const [fixedValues, setFixedValues] = useState<FixedRange>([]);

  useEffect(() => {
    const fetchData = async () => {
      const values: FixedRange = await getFixedRange();
      setFixedValues(values);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Range type="fixed" values={fixedValues} />
    </div>
  );
}
