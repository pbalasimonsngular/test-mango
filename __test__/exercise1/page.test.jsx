import React from "react";
import { render, screen } from "@testing-library/react";
import Exercise1 from "../../app/exercise1/page";
import { getNormalRange } from "../../app/services/range";
import "@testing-library/jest-dom";

jest.mock("../../app/services/range", () => ({
  getNormalRange: jest.fn(),
}));

describe("Exercise1", () => {
  it("renders a h4", async () => {
    getNormalRange.mockResolvedValue({ min: 1, max: 10 });

    render(<Exercise1 />);

    const headingElement = await screen.findByText(
      "Normal range from min to max number"
    );
    expect(headingElement).toBeInTheDocument();
  });
});
