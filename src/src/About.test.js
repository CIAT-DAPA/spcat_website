import React from "react";
import { render } from "@testing-library/react";

import About from "./components/about/about.jsx";
describe("MapTools component", () => {
  test("renders 'hola' text", () => {
    const { getByText } = render(<About />);
    const holaText = getByText(/Background/i);
    expect(holaText).toBeInTheDocument();
  });
});