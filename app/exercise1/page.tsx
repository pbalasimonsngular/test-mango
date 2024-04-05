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
  const [inputValues, setInputValues] = useState({ min: 0, max: 0 });
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
      setInputValues({ min: 0, max: rangeLimits.max });
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

      let newPosition = Math.round(
        (posX / totalWidth) * (rangeLimits.max - rangeLimits.min) +
          rangeLimits.min
      );
      newPosition = Math.max(rangeLimits.min, newPosition);
      newPosition = Math.min(rangeLimits.max, newPosition);

      if (isDragging.min && newPosition + selectorPoints > currentValues.max) {
        return;
      } else if (
        isDragging.max &&
        newPosition - selectorPoints < currentValues.min
      ) {
        return;
      }

      const range = getRange();

      setInputValues({
        ...inputValues,
        [range]: newPosition,
      });
      setCurrentValues({
        ...currentValues,
        [range]: newPosition,
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

    if (key === "min" && (newValue < rangeLimits.min || isNaN(newValue))) {
      setInputValues({
        ...inputValues,
        [key]: rangeLimits.min,
      });
      setCurrentValues({
        ...currentValues,
        [key]: rangeLimits.min,
      });
      return;
    }

    if (key === "max" && (newValue > rangeLimits.max || isNaN(newValue))) {
      setInputValues({
        ...inputValues,
        [key]: rangeLimits.max,
      });
      setCurrentValues({
        ...currentValues,
        [key]: rangeLimits.max,
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
        valueMin={rangeLimits.min}
        valueMax={rangeLimits.max}
        valueText="Normal range from min to max number"
        currentMin={currentValues.min}
        currentMax={currentValues.max}
        inputMin={inputValues.min}
        inputMax={inputValues.max}
        isDraggingMin={isDragging.min}
        isDraggingMax={isDragging.max}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
      />
    </div>
  );
}
