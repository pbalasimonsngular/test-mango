"use client";

import styles from "./range.module.css";
import { RangeProps } from "../models/range";

export default function Range({
  width,
  limitMin,
  limitMax,
  currentMin,
  currentMax,
  inputMin,
  inputMax,
  valueText,
  isDraggingMin,
  isDraggingMax,
  handleMouseDown,
  rangeRef,
  minRef,
  maxRef,
  onInputChange,
  onBlur,
}: RangeProps) {
  const minPercentage = ((currentMin - limitMin) / (limitMax - limitMin)) * 100;
  const maxPercentage = ((currentMax - limitMin) / (limitMax - limitMin)) * 100;

  const minSelectorStyle = {
    left: `${minPercentage}%`,
  };

  const maxSelectorStyle = {
    left: `${maxPercentage}%`,
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles["min-container"]}>
          <input
            type="text"
            className={styles["min-amount"]}
            value={inputMin}
            onChange={(event) => onInputChange(event, "min")}
            onBlur={(event) => onBlur(event, "min")}
          />
          <span>€</span>
        </div>
        <div
          className={styles.range}
          style={{
            width: width ? `${width}px` : "100%",
          }}
          role="slider"
          aria-valuemin={limitMin}
          aria-valuemax={limitMax}
          aria-valuetext={valueText}
          ref={rangeRef}
        >
          <div
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
        <div className={styles["max-container"]}>
          <input
            type="text"
            className={styles["max-amount"]}
            value={inputMax}
            onChange={(event) => onInputChange(event, "max")}
            onBlur={(event) => onBlur(event, "max")}
          />
          <span>€</span>
        </div>
      </div>
    </>
  );
}
