import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import PhysicianSupportPage from "../../pages/physician/PhysicianSupportPage";

describe("PhysicianSupportPage", () => {
  const renderWithRouter = (ui) => {
    return render(<Router>{ui}</Router>);
  };

  test("renders the support page with correct heading and subheading", () => {
    renderWithRouter(<PhysicianSupportPage />);

    expect(
      screen.getByRole("heading", { name: /Support/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Need Help\?/i })
    ).toBeInTheDocument();
  });

  test("renders the correct contact information", () => {
    renderWithRouter(<PhysicianSupportPage />);

    expect(
      screen.getByText(/physiciansupport@cognify.ca/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/1-\(800\)-COGNIFY/i)).toBeInTheDocument();
  });

  test("renders the disclaimer text", () => {
    renderWithRouter(<PhysicianSupportPage />);

    expect(
      screen.getByText(
        /While every effort has been made to ensure the accuracy/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
  });

  test("correctly renders the menu links with icons", () => {
    render(
      <MemoryRouter>
        <PhysicianSupportPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", { name: /My Patients/i })
    ).toBeInTheDocument();

    const supportLinks = screen.getAllByRole("link", { name: /Support/i });
    const supportMenuLink = supportLinks.find(
      (link) => link.getAttribute("href") === "/physician-support"
    );
    expect(supportMenuLink).toBeInTheDocument();
  });
});
