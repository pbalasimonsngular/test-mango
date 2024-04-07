"use client";

import { FocusEvent, useEffect, useRef, useState } from "react";
import Range from "./range.ui";
import { FixedRange, NormalRange, RangeValues } from "../models/range";

import styles from "./range.module.css";

export default function RangeContainer({
  type,
  values,
}: {
  type: string;
  values: RangeValues;
}) {
  const rangeRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef<HTMLDivElement>(null);
  const [normalValues, setNormalValues] = useState<NormalRange>({
    min: 0,
    max: 0,
  });
  const [fixedValues, setFixedValues] = useState<FixedRange>([]);
  const [limits, setLimits] = useState({
    min: 0,
    max: 0,
  });
  const [inputValues, setInputValues] = useState({ min: 0, max: 0 });
  const [currentValues, setCurrentValues] = useState({ min: 0, max: 0 });
  const [isDragging, setIsDragging] = useState({ min: false, max: false });
  const [selectorPoints, setSelectorPoints] = useState(0);

  useEffect(() => {
    let commonValues = {
      min: 0,
      max: 0,
    };

    if (type === "normal") {
      const normalValues = values as NormalRange;
      commonValues = { ...normalValues };
      setNormalValues(normalValues);

      // in case of normal range calculate selector size
      const selectorPoints = calculateSelectorPoints();
      setSelectorPoints(selectorPoints);
    } else {
      const fixedValues = values as FixedRange;
      let min = fixedValues.length > 0 ? fixedValues[0] : 0;
      let max = fixedValues[fixedValues.length - 1] ?? 0;
      commonValues = { min, max };
      setFixedValues(fixedValues);
    }

    setLimits(commonValues);
    setInputValues(commonValues);
    setCurrentValues(commonValues);
  }, [values]);

  const getRange = () => {
    return isDragging.min ? "min" : "max";
  };

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
      const rangePoints = limits.max - limits.min;
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
      calculateNewValue(event);
    }
  };

  const canMoveMinSelector = (newValue: number): boolean => {
    return newValue + selectorPoints <= currentValues.max;
  };

  const canMoveMaxSelector = (newValue: number): boolean => {
    return newValue - selectorPoints >= currentValues.min;
  };

  const calculateNewValue = (event: MouseEvent) => {
    const rangeBoundingClientRect = rangeRef.current?.getBoundingClientRect();
    if (rangeBoundingClientRect) {
      let newValue = 0;
      const offsetX = event.clientX - rangeBoundingClientRect.left;
      const rangeWidth = rangeBoundingClientRect.width;

      newValue = Math.round(
        (offsetX / rangeWidth) * (limits.max - limits.min) + limits.min
      );
      newValue = Math.max(limits.min, newValue);
      newValue = Math.min(limits.max, newValue);

      const range = getRange();

      if (type === "normal") {
        if (isDragging.min && !canMoveMinSelector(newValue)) {
          return;
        }
        if (isDragging.max && !canMoveMaxSelector(newValue)) {
          return;
        }
      } else {
        const rangeValues = values as FixedRange;

        let closestValue = rangeValues.reduce((prev, curr) => {
          return Math.abs(curr - newValue) < Math.abs(prev - newValue)
            ? curr
            : prev;
        });

        if (isDragging.min && closestValue >= inputValues.max) {
          return;
        } else if (isDragging.max && closestValue <= inputValues.min) {
          return;
        }

        newValue = closestValue;
      }

      setInputValues({
        ...inputValues,
        [range]: newValue,
      });
      setCurrentValues({
        ...currentValues,
        [range]: newValue,
      });
    }
  };

  const handleInputChange = (
    event: FocusEvent<HTMLInputElement>,
    key: string
  ) => {
    const newValue = Number(event.target.value);

    if (isNaN(newValue)) {
      return;
    }
    setInputValues({
      ...currentValues,
      [key]: newValue,
    });
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>, key: string) => {
    const newValue = Number(event.target.value);

    if (key === "min" && (newValue < limits.min || isNaN(newValue))) {
      setInputValues({
        ...inputValues,
        [key]: limits.min,
      });
      setCurrentValues({
        ...currentValues,
        [key]: limits.min,
      });
      return;
    }

    if (key === "max" && (newValue > limits.max || isNaN(newValue))) {
      setInputValues({
        ...inputValues,
        [key]: limits.max,
      });
      setCurrentValues({
        ...currentValues,
        [key]: limits.max,
      });
      return;
    }

    if (key === "min") {
      if (newValue + selectorPoints > currentValues.max) {
        setCurrentValues({
          ...currentValues,
          [key]: currentValues.max - selectorPoints,
        });
        setInputValues({
          ...inputValues,
          [key]: currentValues.max - selectorPoints,
        });
        return;
      }

      setCurrentValues({
        ...currentValues,
        [key]: newValue,
      });
    } else {
      if (newValue - selectorPoints < currentValues.min) {
        setCurrentValues({
          ...currentValues,
          [key]: currentValues.min + selectorPoints,
        });
        setInputValues({
          ...inputValues,
          [key]: currentValues.min + selectorPoints,
        });
        return;
      }

      setCurrentValues({
        ...currentValues,
        [key]: newValue,
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
        limitMin={limits.min}
        limitMax={limits.max}
        valueText="Normal range from min to max number"
        currentMin={currentValues.min}
        currentMax={currentValues.max}
        inputMin={inputValues.min}
        inputMax={inputValues.max}
        isDraggingMin={isDragging.min}
        isDraggingMax={isDragging.max}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
        type={type}
      />
    </div>
  );
}
