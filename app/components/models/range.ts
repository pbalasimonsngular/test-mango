import { RefObject, ChangeEvent, FocusEvent } from "react";

export interface RangeResponse {
  min: number;
  max: number;
}

export interface RangeProps {
  width: number;
  valueMin: number;
  valueMax: number;
  currentMin: number;
  currentMax: number;
  inputMin: number;
  inputMax: number;
  valueText: string;
  isDraggingMin: boolean;
  isDraggingMax: boolean;
  handleMouseDown: (key: string) => void;
  rangeRef: RefObject<HTMLDivElement>;
  minRef: RefObject<HTMLDivElement>;
  maxRef: RefObject<HTMLDivElement>;
  onInputChange: (event: ChangeEvent, key: string) => void;
  onBlur: (vent: FocusEvent<HTMLInputElement>, key: string) => void;
}
