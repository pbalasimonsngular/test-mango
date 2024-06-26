"use client";

import styles from "./range.module.css";
import { RangeProps } from "../models/range";
import { MAX, MIN, NORMAL } from "../../constants/range";

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
  type,
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
            onChange={(event) => onInputChange(event, MIN)}
            onBlur={(event) => onBlur(event, MIN)}
            disabled={type === NORMAL ? false : true}
            data-testid="min-amount"
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
          data-testid="range"
        >
          <div
            onMouseDown={() => handleMouseDown(MIN)}
            className={styles["min-selector"]}
            style={{
              ...minSelectorStyle,
              cursor: isDraggingMin ? "grabbing" : "grab",
            }}
            tabIndex={1}
            ref={minRef}
            data-testid="min-selector"
          ></div>
          <div
            onMouseDown={() => handleMouseDown(MAX)}
            className={styles["max-selector"]}
            style={{
              ...maxSelectorStyle,
              cursor: isDraggingMax ? "grabbing" : "grab",
            }}
            tabIndex={2}
            ref={maxRef}
            data-testid="max-selector"
          ></div>
        </div>
        <div className={styles["max-container"]}>
          <input
            type="text"
            className={styles["max-amount"]}
            value={inputMax}
            onChange={(event) => onInputChange(event, MAX)}
            onBlur={(event) => onBlur(event, MAX)}
            disabled={type === NORMAL ? false : true}
            data-testid="max-amount"
          />
          <span>€</span>
        </div>
      </div>
    </>
  );
}
