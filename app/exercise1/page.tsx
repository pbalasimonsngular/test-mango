"use client";

import { FocusEvent, useEffect, useRef, useState } from "react";
import { Range } from "../components";
import { getNormalRange } from "../services/range";

import styles from "./page.module.css";
import { RangeResponse } from "../components/models/range";

export default function Exercise1() {
  const rangeRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef<HTMLDivElement>(null);
  const [rangeLimits, setRangeLimits] = useState({ min: 0, max: 0 });
  const [currentValues, setCurrentValues] = useState({ min: 0, max: 0 });
  const [isDragging, setIsDragging] = useState({ min: false, max: false });
  const [selectorPoints, setSelectorPoints] = useState(0);

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

  useEffect(() => {
    if (rangeLimits.min !== null && rangeLimits.max !== null) {
      setCurrentValues({ min: 0, max: rangeLimits.max });
      const selectorPoints = calculateSelectorPoints();
      setSelectorPoints(selectorPoints);
    }
  }, [rangeLimits]);

  const calculateSelectorPoints = () => {
    let selectorPoints = 0;

    if (minRef.current && rangeRef.current) {
      const rangeBoundingClientRect = rangeRef.current?.getBoundingClientRect();
      const minBoundingClientRect = minRef.current?.getBoundingClientRect();

      const minSelectorLeftPosition =
        minBoundingClientRect.left - rangeBoundingClientRect.left;
      const minSelectorRightPosition =
        minSelectorLeftPosition + minRef.current.offsetWidth;

      const selectorWidth = minSelectorRightPosition - minSelectorLeftPosition;

      const rangeWidth = rangeBoundingClientRect.width;
      const rangePoints = rangeLimits.max - rangeLimits.min;
      selectorPoints = Math.round((selectorWidth * rangePoints) / rangeWidth);
    }
    return selectorPoints;
  };

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

    if (rangeBoundingClientRect) {
      const posX = event.clientX - rangeBoundingClientRect.left;
      const totalWidth = rangeBoundingClientRect.width;

      let selectedValue = Math.round(
        (posX / totalWidth) * (rangeLimits.max - rangeLimits.min) +
          rangeLimits.min
      );
      selectedValue = Math.max(rangeLimits.min, selectedValue);
      selectedValue = Math.min(rangeLimits.max, selectedValue);

      if (
        isDragging.min &&
        selectedValue + selectorPoints > currentValues.max
      ) {
        return;
      } else if (
        isDragging.max &&
        selectedValue - selectorPoints < currentValues.min
      ) {
        return;
      }

      const range = getRange();

      setCurrentValues({
        ...currentValues,
        [range]: selectedValue,
      });
    }
  };

  const handleInputChange = (
    event: FocusEvent<HTMLInputElement>,
    key: string
  ) => {
    const newValue = parseFloat(event.target.value);

    if (key === "min") {
      if (newValue >= rangeLimits.min && newValue < currentValues.max) {
        setCurrentValues({
          ...currentValues,
          [key]: newValue,
        });
      } else {
        setCurrentValues({
          ...currentValues,
          min: currentValues.max - selectorPoints,
        });
      }
    } else {
      if (newValue <= rangeLimits.max && newValue > currentValues.min) {
        setCurrentValues({
          ...currentValues,
          [key]: newValue,
        });
      } else {
        setCurrentValues({
          ...currentValues,
          max: currentValues.min + selectorPoints,
        });
      }
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
