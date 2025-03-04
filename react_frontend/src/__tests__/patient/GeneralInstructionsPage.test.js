import { React } from 'react';
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GeneralInstructionsPage from "../../pages/patient/GeneralInstructionsPage";

describe("GeneralInstructionsPage", () => {
  test("renders the correct text content", () => {
    render(
      <MemoryRouter>
        <GeneralInstructionsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Task Instructions/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /These tasks are designed to monitor your cognitive abilities through a set of interactive games\. Here's what to expect:/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /You will be guided through a lighting and eye calibration test to ensure data capture is as effective as possible\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Each game instruction will appear before its subsequent game\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Read each instruction carefully before starting\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /For some tasks, your audio will be recorded for analysis\./i
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
      <MemoryRouter>
        <GeneralInstructionsPage />
      </MemoryRouter>
    );

    const startButton = screen.getByRole("link", {
      name: /Start Calibration/i,
    });

    expect(startButton).toBeInTheDocument();
    expect(startButton.getAttribute("href")).toBe("/lighting-calibration");
  });
});
