import { React } from 'react';
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PatientHomePage from "../../pages/patient/PatientHomePage";

const renderWithRouter = (ui, { route = "/patient-home-page/123" } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/patient-home-page/:userId" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe("PatientHomePage", () => {
  test("renders menu items and redirects correctly", () => {
    renderWithRouter(<PatientHomePage />, { route: "/patient-home-page/123" });

    // Verify the "Home" link
    const homeLink = screen.getByRole("link", { name: /Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute("href")).toBe("/patient-home-page/123");

    // Verify the "My Reports" link
    const reportsLink = screen.getByRole("link", { name: /My Reports/i });
    expect(reportsLink).toBeInTheDocument();
    expect(reportsLink.getAttribute("href")).toBe("/patient-report-page/123");

    // Verify the "Support" link
    const supportLink = screen.getByRole("link", { name: /Support/i });
    expect(supportLink).toBeInTheDocument();
    expect(supportLink.getAttribute("href")).toBe("/support-page/123");
  });

  test('renders "Home" heading on the right side', () => {
    renderWithRouter(<PatientHomePage />, { route: "/patient-home-page/123" });
    const headingElement = screen.getByRole("heading", { name: /^Home$/i });
    expect(headingElement).toBeInTheDocument();
  });
});
