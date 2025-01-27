import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import LightingCalibration from "../../pages/patient/LightingCalibration";

jest.useFakeTimers();

describe("LightingCalibration", () => {
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

  test("redirects to gaze calibration page when Start Calibration button is clicked", () => {
    render(
      <Router>
        <LightingCalibration />
      </Router>
    );

    const startButton = screen.getByRole("button", {
      name: /Start Gaze Calibration/i,
    });
    fireEvent.click(startButton);

    expect(window.location.pathname).toBe("/gaze-calibration");
  });

//   test("displays error message when lighting is poor", async () => {});
//   test("displays success message when lighting is good", async () => {});
//   test("shows camera error message if camera access fails", async () => {});
});
