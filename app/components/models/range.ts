import { RefObject, MouseEvent, FocusEvent } from "react";

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
  valueText: string;
  isDraggingMin: boolean;
  isDraggingMax: boolean;
  handleMouseDown: (key: string) => void;
  rangeRef: RefObject<HTMLDivElement>;
  minRef: RefObject<HTMLDivElement>;
  maxRef: RefObject<HTMLDivElement>;
  onInputChange: (event: FocusEvent, key: string) => void;
}
