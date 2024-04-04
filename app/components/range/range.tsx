"use client";

import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import styles from "./range.module.css";
import { RangeProps } from "../models/range";

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
  onInputChange,
}: RangeProps) {
  const [min, setMin] = useState(currentMin);
  const [max, setMax] = useState(currentMax);

  const minPercentage = ((currentMin - valueMin) / (valueMax - valueMin)) * 100;
  const maxPercentage = ((currentMax - valueMin) / (valueMax - valueMin)) * 100;

  const minSelectorStyle = {
    left: `${minPercentage}%`,
  };

  const maxSelectorStyle = {
    left: `${maxPercentage}%`,
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const { value } = event.target;
    if (key === "min") {
      setMin(Number(value));
    } else if (key === "max") {
      setMax(Number(value));
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>, key: string) => {
    onInputChange(event, key);
  };

  useEffect(() => {
    setMin(currentMin);
  }, [currentMin]);

  useEffect(() => {
    setMax(currentMax);
  }, [currentMax]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles["min-container"]}>
          <input
            type="text"
            className={styles["min-amount"]}
            value={min}
            onChange={(event) => handleInputChange(event, "min")}
            onBlur={(event) => handleBlur(event, "min")}
          />
          <span>€</span>
        </div>
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
            value={max}
            onChange={(event) => handleInputChange(event, "max")}
            onBlur={(event) => handleBlur(event, "max")}
          />
          <span>€</span>
        </div>
      </div>
    </>
  );
}
