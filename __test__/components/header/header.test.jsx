import { render, screen } from "@testing-library/react";
import Header from "../../../app/components/header/header";
import "@testing-library/jest-dom";

describe("<Header />", () => {
  it("should render succesfully", async () => {
    render(<Header />);
    const header = screen.getByTestId("header");
    expect(header).toBeTruthy();

    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("href", "/");

    const image = screen.getByTestId("img");
    expect(image).toHaveAttribute(
      "src",
      "https://st.mngbcn.com/images/headerNew/logos/mango.svg"
    );
    expect(image).toHaveAttribute("alt", "logo");
  });
});
