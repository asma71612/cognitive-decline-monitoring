import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PatientHomePage from "../../pages/patient/PatientHomePage";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ to, children }) => (
    <a href={to} data-testid={`link-${to}`}>
      {children}
    </a>
  ),
}));

describe("PatientHomePage", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <PatientHomePage />
      </MemoryRouter>
    );
  });

  test("renders menu items and redirects correctly", () => {
    const homeMenuItem = screen
      .getByTestId("link-/patient-home-page")
      .querySelector("span");
    expect(homeMenuItem).toHaveTextContent("Home");

    const reportsLink = screen
      .getByTestId("link-/patient-report-page")
      .querySelector("span");
    expect(reportsLink).toHaveTextContent("My Reports");

    const supportLink = screen
      .getByTestId("link-/support-page")
      .querySelector("span");
    expect(supportLink).toHaveTextContent("Support");
  });

  test("renders correct date in EST", () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      timeZone: "America/New_York",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const day = parseInt(
      new Date().toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        day: "numeric",
      }),
      10
    );

    const ordinalSuffix =
      day % 10 === 1 && day % 100 !== 11
        ? "st"
        : day % 10 === 2 && day % 100 !== 12
        ? "nd"
        : day % 10 === 3 && day % 100 !== 13
        ? "rd"
        : "th";

    const expectedDate = currentDate.replace(
      `${day}`,
      `${day}${ordinalSuffix}`
    );

    const dateElement = screen.getByText(
      new RegExp(`Today is ${expectedDate}`, "i")
    );
    expect(dateElement).toBeInTheDocument();
  });

  test('renders "Home" heading on the right side', () => {
    const headingElement = screen.getByRole("heading", { name: /^Home$/i });
    expect(headingElement).toBeInTheDocument();
  });
});
