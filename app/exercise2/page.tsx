"use client";

import { useEffect, useState } from "react";
import { Range } from "../components";
import { getFixedRange } from "../services/range";

import "../global.css";

import { FixedRange } from "../components/models/range";
import { FIXED } from "../constants/range";

export default function Exercise1() {
  const TEXT = "Fixed number of options range";

  const [fixedValues, setFixedValues] = useState<FixedRange>([]);

  useEffect(() => {
    const fetchData = async () => {
      const values: FixedRange = await getFixedRange();
      setFixedValues(values);
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h4>{TEXT}</h4>
      <Range type={FIXED} valueText={TEXT} values={fixedValues} />
    </div>
  );
}
