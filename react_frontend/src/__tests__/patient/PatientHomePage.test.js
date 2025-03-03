import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { act } from 'react';
import PatientHomePage from "../../pages/patient/PatientHomePage";
import { onSnapshot } from 'firebase/firestore';

// Mock Firebase Firestore and firebaseConfig
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock("../../firebaseConfig", () => ({
  db: {}, // Mock db, you can leave it empty or make it more specific if needed
}));

// Mocked data for Firestore
const mockUserData = {
  completedDays: ["2025-03-01", "2025-03-02"],
  numCompletedDays: 2,
  playFrequency: 6,
  firstPlayed: "2025-01-01",
};

describe("PatientHomePage", () => {
  beforeEach(() => {
    // Mock the onSnapshot function to call the provided callback with mock data
    onSnapshot.mockImplementation((docRef, callback) => {
      callback({
        exists: () => true,
        data: () => mockUserData,
      });
      return jest.fn(); // Return a mock unsubscribe function
    });

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