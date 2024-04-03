"use client";

import { RefObject } from "react";
import styles from "./range.module.css";

export default function Range({
  width,
  valueMin,
  valueMax,
  currentMin,
  currentMax,
  valueText,
  isDraggingMin,
  isDraggingMax,
  handleMouseDown,
  rangeRef,
  minRef,
  maxRef,
}: {
  width: number;
  valueMin: number;
  valueMax: number;
  currentMin: number;
  currentMax: number;
  isDraggingMin: boolean;
  isDraggingMax: boolean;
  valueText: string;
  handleMouseDown: any;
  rangeRef: RefObject<HTMLDivElement>;
  minRef: RefObject<HTMLDivElement>;
  maxRef: RefObject<HTMLDivElement>;
}) {
  const minPercentage = ((currentMin - valueMin) / (valueMax - valueMin)) * 100;
  const maxPercentage = ((currentMax - valueMin) / (valueMax - valueMin)) * 100;

  const minSelectorStyle = {
    left: `${minPercentage}%`,
  };

  const maxSelectorStyle = {
    left: `${maxPercentage}%`,
  };

  return (
    <>
      <div
        className={styles.range}
        style={{
          width: width ? `${width}px` : "100%",
        }}
        role="slider"
        aria-valuemin={valueMin}
        aria-valuemax={valueMax}
        aria-valuetext={valueText}
        ref={rangeRef}
      >
        <div
          data-id="min"
          onMouseDown={() => handleMouseDown("min")}
          className={styles["min-selector"]}
          style={{
            ...minSelectorStyle,
            cursor: isDraggingMin ? "grabbing" : "grab",
          }}
          tabIndex={1}
          ref={minRef}
        ></div>
        <div
          data-id="max"
          onMouseDown={() => handleMouseDown("max")}
          className={styles["max-selector"]}
          style={{
            ...maxSelectorStyle,
            cursor: isDraggingMax ? "grabbing" : "grab",
          }}
          tabIndex={2}
          ref={maxRef}
        ></div>
      </div>
      <div>
        {currentMin} - isDraggingMin: {isDraggingMin ? "1" : "0"}
      </div>
      <div>
        {currentMax} - isDraggingMax: {isDraggingMax ? "1" : "0"}
      </div>
    </>
  );
}
