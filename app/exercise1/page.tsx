"use client";

import { useEffect, useState } from "react";
import { Range } from "../components";
import { getNormalRange } from "../services/range";

import styles from "./page.module.css";
import { NormalRange } from "../components/models/range";

export default function Exercise1() {
  const [normalValues, setNormalValues] = useState<NormalRange>({
    min: 0,
    max: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const values: NormalRange = await getNormalRange();
      setNormalValues(values);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Range type="normal" values={normalValues} />
    </div>
  );
}
