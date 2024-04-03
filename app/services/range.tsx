"use server";

import { RangeResponse } from "../components/models/range";

export async function getNormalRange(): Promise<RangeResponse> {
  try {
    const response = await fetch("http://demo0145425.mockable.io/exercise1");
    const ranges: RangeResponse = await response.json();
    return ranges;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching normal range");
  }
}
