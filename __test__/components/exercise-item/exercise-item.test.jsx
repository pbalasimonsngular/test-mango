import { render, screen } from "@testing-library/react";
import Exercise from "../../../app/components/exercise-item/exercise-item";
import "@testing-library/jest-dom";

describe("<Exercise />", () => {
  it("should render succesfully", async () => {
    render(<Exercise text="Exercise 1" path="exercise1" />);
    const link = screen.getByTestId("link");
    expect(link.href).toContain("exercise1");

    const article = screen.getByTestId("article");
    expect(article).toHaveTextContent("Exercise 1");
  });
});
