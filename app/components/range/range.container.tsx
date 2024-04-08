"use client";

import { FocusEvent, useEffect, useRef, useState } from "react";
import Range from "./range.ui";
import { FixedRange, NormalRange, RangeValues } from "../models/range";

import styles from "./range.module.css";
import { MAX, MIN, NORMAL } from "../../constants/range";

export default function RangeContainer({
  type,
  values,
  valueText,
}: {
  type: string;
  values: RangeValues;
  valueText: string;
}) {
  const rangeRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef<HTMLDivElement>(null);
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

    if (type === NORMAL) {
      const normalValues = values as NormalRange;
      commonValues = { ...normalValues };

      // in case of normal range calculate selector width
      const selectorPoints = calculateSelectorPoints();
      setSelectorPoints(selectorPoints);
    } else {
      const fixedValues = values as FixedRange;
      let min = fixedValues.length > 0 ? fixedValues[0] : 0;
      let max = fixedValues[fixedValues.length - 1] ?? 0;
      commonValues = { min, max };
    }

    setLimits(commonValues);
    setInputValues(commonValues);
    setCurrentValues(commonValues);
  }, [values]);

  /**
   *  @returns "min" or "max" depending which selector are selected
   */
  const getRange = () => {
    return isDragging.min ? MIN : MAX;
  };

  /**
   * in case of rendering a NORMAL range. it calculate the width of a selector (min) to have it
   * ready when need it to avoid collisions
   */
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
    console.log(selectorPoints);
    return selectorPoints;
  };
  /**
   *
   * @param range "min" or "max"
   * set range selected to true
   */
  const handleMouseDown = (range: string) => {
    setIsDragging({ ...isDragging, [range]: true });
  };

  /**
   *
   * @param range "min" or "max"
   * set range selected to false
   */
  const handleMouseUp = () => {
    const range = getRange();
    setIsDragging({ ...isDragging, [range]: false });
  };

  /**
   *  @param event: MouseEvent
   * call calculateNewValue of the selector selected
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging.min || isDragging.max) {
      calculateNewValue(event);
    }
  };

  /**
   * @param newValue
   * @returns if the min selector can be moved
   */
  const canMoveMinSelector = (newValue: number): boolean => {
    return newValue + selectorPoints <= currentValues.max;
  };

  /**
   * @param newValue
   * @returns if the max selector can be moved
   */
  const canMoveMaxSelector = (newValue: number): boolean => {
    return newValue - selectorPoints >= currentValues.min;
  };

  /**
   *
   * @param event
   * set the new input value and set the selector in the new position
   */
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

      if (type === NORMAL) {
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

  /**
   *
   * @param event
   * @param key "min" or "max"
   * update the inputs with the user values
   */

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

  /**
   * @param event
   * @param key "min" or "max"
   * update the input values with the correct value and set the selector in the new positions
   */

  const handleBlur = (event: FocusEvent<HTMLInputElement>, key: string) => {
    const newInputValue = Number(event.target.value);
    let newValue = 0;

    if (key === MIN) {
      if (newInputValue < limits.min || isNaN(newInputValue)) {
        newValue = limits.min;
      } else if (newInputValue + selectorPoints > currentValues.max) {
        newValue = currentValues.max - selectorPoints;
      } else {
        newValue = newInputValue;
      }
    } else {
      if (newInputValue > limits.max || isNaN(newInputValue)) {
        newValue = limits.max;
      } else if (newInputValue - selectorPoints < currentValues.min) {
        newValue = currentValues.min + selectorPoints;
      } else {
        newValue = newInputValue;
      }
    }

    setInputValues({
      ...currentValues,
      [key]: newValue,
    });
    setCurrentValues({
      ...currentValues,
      [key]: newValue,
    });
  };

  /**
   * add events listeners
   */
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
        valueText={valueText}
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
