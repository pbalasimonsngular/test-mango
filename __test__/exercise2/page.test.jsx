import React from "react";
import { render, screen } from "@testing-library/react";
import Exercise2 from "../../app/exercise2/page";
import { getFixedRange } from "../../app/services/range";
import "@testing-library/jest-dom";

jest.mock("../../app/services/range", () => ({
  getFixedRange: jest.fn(),
}));

describe("Exercise2", () => {
  it("renders a h4", async () => {
    getFixedRange.mockResolvedValue([1.99, 5.99, 10.99, 30.99, 50.99, 70.99]);

    render(<Exercise2 />);

    const headingElement = await screen.findByText(
      "Fixed number of options range"
    );
    expect(headingElement).toBeInTheDocument();
  });
});
