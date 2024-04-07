"use server";

import { FixedRange, NormalRange } from "../components/models/range";
import { MIN_VALUE, MAX_VALUE } from "../constants/range";

export async function getNormalRange(): Promise<NormalRange> {
  try {
    const response = await fetch("http://demo0145425.mockable.io/exercise1");
    const ranges: NormalRange = await response.json();
    return ranges;
  } catch (error) {
    console.error(`Error fetching normal range. Set default values. ${error}`);
    return { min: MIN_VALUE, max: MAX_VALUE };
  }
}

export async function getFixedRange(): Promise<FixedRange> {
  try {
    const response = await fetch("http://demo0145425.mockable.io/exercise2");
    const data = await response.json();
    const ranges: FixedRange = data.values;
    return ranges;
  } catch (error) {
    console.error(`Error fetching fixed range. Set default values. ${error}`);
    return [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
  }
}
