"use client";

import { useEffect, useRef, useState } from "react";
import { Range } from "../components";
import { getNormalRange } from "../services/range";

import styles from "./page.module.css";
import { RangeResponse } from "../components/models/range";
import { MIN, MAX } from "../constants/range";

export default function Exercise1() {
  const rangeRef = useRef<HTMLDivElement>(null);
  const [rangeLimits, setRangeLimits] = useState({ min: MIN, max: MAX });
  const [currentValues, setCurrentValues] = useState({ min: MIN, max: MAX });
  const [isDragging, setIsDragging] = useState({ min: false, max: false });

  const getRange = () => {
    return isDragging.min ? "min" : "max";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: RangeResponse = await getNormalRange();
        setRangeLimits({ min: response.min, max: response.max });
      } catch (error) {
        setRangeLimits({ min: MIN, max: MAX });
      }
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
      moveSliderPosition(event);
    }
  };

  const moveSliderPosition = (event: MouseEvent) => {
    const sliderBoundingClientRect = rangeRef.current?.getBoundingClientRect();

    if (sliderBoundingClientRect) {
      const posX = event.clientX - sliderBoundingClientRect.left;
      const totalWidth = sliderBoundingClientRect.width;

      let selectedValue = Math.round(
        (posX / totalWidth) * (rangeLimits.max - rangeLimits.min) +
          rangeLimits.min
      );
      selectedValue = Math.max(rangeLimits.min, selectedValue);
      selectedValue = Math.min(rangeLimits.max, selectedValue);

      const range = getRange();

      if (range === "min") {
        if (selectedValue + 10 >= currentValues.max) {
          selectedValue = currentValues.max - 10;
        }
      } else {
        if (selectedValue - 10 <= currentValues.min) {
          selectedValue = currentValues.min + 10;
        }
      }

      setCurrentValues({
        ...currentValues,
        [range]: selectedValue,
      });
    }
  };

  useEffect(() => {
    if (isDragging.min || isDragging.max) {
      console.log("useEffect => isDragging");
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      console.log("useEffect => return");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging.min, isDragging.max]);

  return (
    <div className={styles.container}>
      <Range
        rangeRef={rangeRef}
        width={500}
        handleMouseDown={handleMouseDown}
        valueMin={rangeLimits.min}
        valueMax={rangeLimits.max}
        valueText="Normal range from min to max number"
        currentMin={currentValues.min}
        currentMax={currentValues.max}
        isDraggingMin={isDragging.min}
        isDraggingMax={isDragging.max}
      />
    </div>
  );
}
