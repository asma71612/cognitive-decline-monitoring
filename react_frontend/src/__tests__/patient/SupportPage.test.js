import { React } from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SupportPage from "../../pages/patient/SupportPage";

const renderWithRouter = (ui, { route = "/support-page/123" } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        {/* Route to support page providing the userId */}
        <Route path="/support-page/:userId" element={ui} />
        {/* Dummy routes to simulate navigation */}
        <Route
          path="/patient-home-page/:userId"
          element={<div>Home Page</div>}
        />
        <Route
          path="/patient-report-page/:userId"
          element={<div>Report Page</div>}
        />
        <Route path="/patient-login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("SupportPage", () => {
  test("renders the support page with correct heading and subheading", () => {
    renderWithRouter(<SupportPage />);
    expect(
      screen.getByRole("heading", { name: /Support/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Need Help\?/i })
    ).toBeInTheDocument();
  });

  test("renders the correct contact information", () => {
    renderWithRouter(<SupportPage />);
    expect(screen.getByText(/patientsupport@cognify.ca/i)).toBeInTheDocument();
    expect(screen.getByText(/1-\(800\)-123-4567/i)).toBeInTheDocument();
  });

  test("renders the disclaimer text", () => {
    renderWithRouter(<SupportPage />);
    expect(
      screen.getByText(/Cognify is designed to support physicians/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  });

  test("navigates to correct page when clicking on menu links", () => {
    renderWithRouter(<SupportPage />);
    const homeLink = screen.getByRole("link", { name: /home/i });
    fireEvent.click(homeLink);
    expect(screen.getByText("Home Page")).toBeInTheDocument();

    renderWithRouter(<SupportPage />, { route: "/support-page/123" });
    const reportsLink = screen.getByRole("link", { name: /My Reports/i });
    fireEvent.click(reportsLink);
    expect(screen.getByText("Report Page")).toBeInTheDocument();

    renderWithRouter(<SupportPage />, { route: "/support-page/123" });
    const logoutLink = screen.getByRole("link", { name: /Log Out/i });
    fireEvent.click(logoutLink);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
