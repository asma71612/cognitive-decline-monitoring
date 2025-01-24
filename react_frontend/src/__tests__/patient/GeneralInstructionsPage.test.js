import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import GeneralInstructionsPage from "../../pages/patient/GeneralInstructionsPage";

describe("GeneralInstructionsPage", () => {
  test("renders the correct text content", () => {
    render(
      <Router>
        <GeneralInstructionsPage />
      </Router>
    );

    expect(screen.getByText(/Task Instructions/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /This task is designed to monitor your cognitive abilities through a set of interactive games. Here's what to expect:/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /You will be guided through an ambient light calibration test and an eye gaze calibration test to ensure data capture is as effective as possible./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Each game instruction will appear before its subsequent game. Read each instruction carefully before starting./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /There are a total of __ games, each taking up to 1 minute to complete. All games must be completed in one sitting, back-to-back./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Make sure you're in a quiet environment, free from distractions, so you can fully focus on your task!/i
      )
    ).toBeInTheDocument();
  });

  test("redirects to lighting calibration page when Start Calibration button is clicked", () => {
    render(
      <Router>
        <GeneralInstructionsPage />
      </Router>
    );

    const startButton = screen.getByRole("link", {
      name: /Start Calibration/i,
    });

    expect(startButton).toBeInTheDocument();

    startButton.click();

    expect(window.location.pathname).toBe("/lighting-calibration");
  });
});
