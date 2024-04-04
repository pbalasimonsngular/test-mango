"use client";

import { useEffect, useRef, useState } from "react";
import { Range } from "../components";
import { getNormalRange } from "../services/range";

import styles from "./page.module.css";
import { RangeResponse } from "../components/models/range";
import { MIN, MAX } from "../constants/range";

export default function Exercise1() {
  const rangeRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef<HTMLDivElement>(null);
  const [rangeLimits, setRangeLimits] = useState({ min: MIN, max: MAX });
  const [currentValues, setCurrentValues] = useState({ min: 1000, max: 9000 });
  const [isDragging, setIsDragging] = useState({ min: false, max: false });

  const getRange = () => {
    return isDragging.min ? "min" : "max";
  };

  useEffect(() => {
    const fetchData = async () => {
      const { min, max }: RangeResponse = await getNormalRange();
      setRangeLimits({ min, max });
    };

    fetchData();
  }, []);

  const handleMouseDown = (range: string) => {
    setIsDragging({ ...isDragging, [range]: true });
  };

  const handleMouseUp = () => {
    const range = getRange();
    setIsDragging({ ...isDragging, [range]: false });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging.min || isDragging.max) {
      calculatePosition(event);
    }
  };
  const calculatePosition = (event: MouseEvent) => {
    const rangeBoundingClientRect = rangeRef.current?.getBoundingClientRect();
    const minBoundingClientRect = minRef.current?.getBoundingClientRect();
    const maxBoundingClientRect = maxRef.current?.getBoundingClientRect();

    if (
      rangeBoundingClientRect &&
      minBoundingClientRect &&
      maxBoundingClientRect
    ) {
      const posX = event.clientX - rangeBoundingClientRect.left;
      const totalWidth = rangeBoundingClientRect.width;

      let selectedValue = Math.round(
        (posX / totalWidth) * (rangeLimits.max - rangeLimits.min) +
          rangeLimits.min
      );
      selectedValue = Math.max(rangeLimits.min, selectedValue);
      selectedValue = Math.min(rangeLimits.max, selectedValue);

      const minPosition =
        ((currentValues.min - rangeLimits.min) /
          (rangeLimits.max - rangeLimits.min)) *
        totalWidth;
      const maxPosition =
        ((currentValues.max - rangeLimits.min) /
          (rangeLimits.max - rangeLimits.min)) *
        totalWidth;

      if (isDragging.min) {
        const maxAllowedPosition = maxPosition - minBoundingClientRect.width;
        const newPosition =
          ((selectedValue - rangeLimits.min) /
            (rangeLimits.max - rangeLimits.min)) *
          totalWidth;
        if (newPosition > maxAllowedPosition) {
          selectedValue =
            Math.round(
              (maxAllowedPosition / totalWidth) *
                (rangeLimits.max - rangeLimits.min)
            ) + rangeLimits.min;
        }
      } else if (isDragging.max) {
        const minAllowedPosition = minPosition + minBoundingClientRect.width;
        const newPosition =
          ((selectedValue - rangeLimits.min) /
            (rangeLimits.max - rangeLimits.min)) *
          totalWidth;
        if (newPosition < minAllowedPosition) {
          selectedValue =
            Math.round(
              (minAllowedPosition / totalWidth) *
                (rangeLimits.max - rangeLimits.min)
            ) + rangeLimits.min;
        }
      }

      const range = getRange();

      setCurrentValues({
        ...currentValues,
        [range]: selectedValue,
      });
    }
  };

  const handleInputChange = (event, id: string) => {
    const newValue = parseFloat(event.target.value);

    if (
      id === "min" &&
      newValue >= rangeLimits.min &&
      newValue < currentValues.max
    ) {
      setCurrentValues({
        ...currentValues,
        [id]: newValue,
      });
    } else if (
      id === "max" &&
      newValue <= rangeLimits.max &&
      newValue > currentValues.min
    ) {
      setCurrentValues({
        ...currentValues,
        [id]: newValue,
      });
    }
  };

  useEffect(() => {
    if (isDragging.min || isDragging.max) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging.min, isDragging.max]);

  return (
    <div className={styles.container}>
      <Range
        rangeRef={rangeRef}
        minRef={minRef}
        maxRef={maxRef}
        width={500}
        handleMouseDown={handleMouseDown}
        valueMin={rangeLimits.min}
        valueMax={rangeLimits.max}
        valueText="Normal range from min to max number"
        currentMin={currentValues.min}
        currentMax={currentValues.max}
        isDraggingMin={isDragging.min}
        isDraggingMax={isDragging.max}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
