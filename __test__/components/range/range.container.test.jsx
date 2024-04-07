import { Range } from "../../../app/components/";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("<Range />", () => {
  const TEXT = "Normal range from min to max number";

  const normalValues = {
    min: 0,
    max: 1000,
  };
  const NORMAL = "normal";
  it("should render normal range sucesfully", () => {
    render(<Range type={NORMAL} valueText={TEXT} values={normalValues} />);

    const minAmount = screen.getByTestId("min-amount");
    expect(Number(minAmount.value)).toBe(normalValues.min);
    expect(minAmount.disabled).toBe(false);

    const range = screen.getByTestId("range");
    expect(Number(range.getAttribute("aria-valuemin"))).toBe(normalValues.min);
    expect(Number(range.getAttribute("aria-valuemax"))).toBe(normalValues.max);
    expect(range.getAttribute("aria-valuetext")).toBe(TEXT);

    const maxAmount = screen.getByTestId("max-amount");
    expect(Number(maxAmount.value)).toBe(normalValues.max);
    expect(maxAmount.disabled).toBe(false);
  });

  it("should change min-selector mouse icon when click down and click up the mouse", () => {
    render(<Range type={NORMAL} valueText={TEXT} values={normalValues} />);

    const minSelector = screen.getByTestId("min-selector");
    fireEvent.mouseDown(minSelector);
    expect(minSelector).toHaveStyle("cursor: grabbing;");

    fireEvent.mouseUp(minSelector);
    expect(minSelector).toHaveStyle("cursor: grab;");
  });

  it("should change input value when user fill a new correct value", () => {
    render(<Range type={NORMAL} valueText={TEXT} values={normalValues} />);
    const minInput = screen.getByTestId("min-amount");

    fireEvent.change(minInput, { target: { value: "1000" } });
    expect(minInput).toHaveValue("1000");
  });

  it("should not change input value when user fill a new invalid value", () => {
    render(<Range type={NORMAL} valueText={TEXT} values={normalValues} />);
    const minInput = screen.getByTestId("min-amount");

    fireEvent.change(minInput, { target: { value: "invalid" } });
    expect(minInput).toHaveValue("0");
  });
});
