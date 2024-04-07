"use client";

import { useEffect, useState } from "react";
import { Range } from "../components";
import { getNormalRange } from "../services/range";

import "../global.css";

import { NormalRange } from "../components/models/range";
import { NORMAL } from "../constants/range";

export default function Exercise1() {
  const TEXT = "Normal range from min to max number";

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
    <div className="container">
      <h4>{TEXT}</h4>
      <Range type={NORMAL} valueText={TEXT} values={normalValues} />
    </div>
  );
}
