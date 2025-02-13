import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import SupportPage from "../../pages/patient/SupportPage";

describe("SupportPage", () => {
  const renderWithRouter = (ui) => {
    return render(<Router>{ui}</Router>);
  };

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

  test("correctly renders the menu links with icons", () => {
    render(
      <MemoryRouter>
        <SupportPage />
      </MemoryRouter>
    );

    const allSupportLinks = screen.getAllByRole("link", { name: /Support/i });

    const supportMenuLink = allSupportLinks.find(
      (link) => link.getAttribute("href") === "/support-page"
    );

    expect(supportMenuLink).toBeInTheDocument();
  });

  test("navigates to correct page when clicking on menu links", () => {
    renderWithRouter(<SupportPage />);

    fireEvent.click(screen.getByRole("link", { name: /Home/i }));
    expect(window.location.pathname).toBe("/patient-home-page");

    fireEvent.click(screen.getByRole("link", { name: /My Reports/i }));
    expect(window.location.pathname).toBe("/patient-report-page");

    fireEvent.click(screen.getByRole("link", { name: /Log Out/i }));
    expect(window.location.pathname).toBe("/patient-login");
  });

  //   test("renders current date in EST format with suffix", () => {});
});
