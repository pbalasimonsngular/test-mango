import { Range } from "../../../app/components/";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("<Range />", () => {
  const TEXT_NORMAL = "Normal range from min to max number";
  const normalValues = {
    min: 0,
    max: 10000,
  };
  const NORMAL = "normal";

  const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
  const FIXED = "fixed";
  const TEXT_FIXED = "Fixed number of options range";

  it("should render normal range sucesfully", () => {
    render(
      <Range type={NORMAL} valueText={TEXT_NORMAL} values={normalValues} />
    );

    const minAmount = screen.getByTestId("min-amount");
    expect(Number(minAmount.value)).toBe(normalValues.min);
    expect(minAmount.disabled).toBe(false);

    const range = screen.getByTestId("range");
    expect(Number(range.getAttribute("aria-valuemin"))).toBe(normalValues.min);
    expect(Number(range.getAttribute("aria-valuemax"))).toBe(normalValues.max);
    expect(range.getAttribute("aria-valuetext")).toBe(TEXT_NORMAL);

    const maxAmount = screen.getByTestId("max-amount");
    expect(Number(maxAmount.value)).toBe(normalValues.max);
    expect(maxAmount.disabled).toBe(false);
  });

  it("should change min-selector mouse icon when click down and click up the mouse", () => {
    render(
      <Range type={NORMAL} valueText={TEXT_NORMAL} values={normalValues} />
    );

    const minSelector = screen.getByTestId("min-selector");
    fireEvent.mouseDown(minSelector);
    expect(minSelector).toHaveStyle("cursor: grabbing;");

    fireEvent.mouseUp(minSelector);
    expect(minSelector).toHaveStyle("cursor: grab;");
  });

  it("should change input value when user fill a new correct value", () => {
    render(
      <Range type={NORMAL} valueText={TEXT_NORMAL} values={normalValues} />
    );
    const minInput = screen.getByTestId("min-amount");

    fireEvent.change(minInput, { target: { value: "1000" } });
    expect(minInput).toHaveValue("1000");
  });

  it("should not change input value when user fill a new invalid value", () => {
    render(
      <Range type={NORMAL} valueText={TEXT_NORMAL} values={normalValues} />
    );
    const minInput = screen.getByTestId("min-amount");

    fireEvent.change(minInput, { target: { value: "invalid" } });
    expect(minInput).toHaveValue("0");
  });

  it("should update inputMin to min limit when new value is less than MIN", () => {
    render(
      <Range type={NORMAL} valueText={TEXT_NORMAL} values={normalValues} />
    );
    const minInput = screen.getByTestId("min-amount");

    fireEvent.change(minInput, { target: { value: "-100" } });
    fireEvent.blur(minInput);

    expect(minInput.value).toBe(normalValues.min.toString());
  });

  it("should update inputMin to min limit when new value is not a number ", () => {
    render(
      <Range type={NORMAL} valueText={TEXT_NORMAL} values={normalValues} />
    );
    const minInput = screen.getByTestId("min-amount");

    fireEvent.change(minInput, { target: { value: "not a number" } });
    fireEvent.blur(minInput);

    expect(minInput.value).toBe(normalValues.min.toString());
  });

  it("should update inputMax to max limit when new value is more than MAX", () => {
    render(
      <Range type={NORMAL} valueText={TEXT_NORMAL} values={normalValues} />
    );
    const maxInput = screen.getByTestId("max-amount");

    fireEvent.change(maxInput, { target: { value: "15000" } });
    fireEvent.blur(maxInput);

    expect(maxInput.value).toBe(normalValues.max.toString());
  });

  it("should update inputMax to max limit when new value is not a number", () => {
    render(
      <Range type={NORMAL} valueText={TEXT_NORMAL} values={normalValues} />
    );
    const maxInput = screen.getByTestId("max-amount");

    fireEvent.change(maxInput, { target: { value: "not a mumber" } });
    fireEvent.blur(maxInput);

    expect(maxInput.value).toBe(normalValues.max.toString());
  });

  it("should render normal range sucesfully", () => {
    render(<Range type={FIXED} valueText={TEXT_FIXED} values={fixedValues} />);

    const minAmount = screen.getByTestId("min-amount");
    expect(Number(minAmount.value)).toBe(fixedValues[0]);
    expect(minAmount.disabled).toBe(true);

    const range = screen.getByTestId("range");
    expect(Number(range.getAttribute("aria-valuemin"))).toBe(fixedValues[0]);
    expect(Number(range.getAttribute("aria-valuemax"))).toBe(
      fixedValues[fixedValues.length - 1]
    );
    expect(range.getAttribute("aria-valuetext")).toBe(TEXT_FIXED);

    const maxAmount = screen.getByTestId("max-amount");
    expect(Number(maxAmount.value)).toBe(fixedValues[fixedValues.length - 1]);
    expect(maxAmount.disabled).toBe(true);
  });
});
