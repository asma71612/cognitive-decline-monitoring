import { React } from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import LightingCalibration from "../../pages/patient/LightingCalibration";

jest.useFakeTimers();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe("LightingCalibration", () => {
  const mockUserId = "test-user-123";

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ userId: mockUserId });
  });

  test("renders the correct text content", () => {
    render(
      <Router>
        <LightingCalibration />
      </Router>
    );

    expect(screen.getByText(/Lighting Calibration/i)).toBeInTheDocument();
    expect(
      screen.getByText(/1. Ensure your face is visible./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2. Ensure good lighting conditions./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/3. Ensure there is no strong light behind your back./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/4. Ensure there are no light reflections on glasses./i)
    ).toBeInTheDocument();
  });

  test("redirects to Scene Detective Instructions with user ID when Start button is clicked", () => {
    render(
      <Router>
        <LightingCalibration />
      </Router>
    );

    const startButton = screen.getByRole("button", {
      name: /Start/i,
    });
    fireEvent.click(startButton);

    expect(window.location.pathname).toBe(`/gaze-calibration-instructions/${mockUserId}`);
  });

//   test("displays error message when lighting is poor", async () => {});
//   test("displays success message when lighting is good", async () => {});
//   test("shows camera error message if camera access fails", async () => {});
});
