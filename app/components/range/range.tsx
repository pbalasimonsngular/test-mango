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
}) {
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
            left: `${currentMin}px`,
            cursor: isDraggingMin ? "grabbing" : "grab",
          }}
          tabIndex={1}
        ></div>
        <div
          data-id="max"
          onMouseDown={() => handleMouseDown("max")}
          className={styles["max-selector"]}
          style={{
            left: `${currentMax}px`,
            cursor: isDraggingMax ? "grabbing" : "grab",
          }}
          tabIndex={2}
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
