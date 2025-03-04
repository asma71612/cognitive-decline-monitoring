import { React } from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NaturesGaze2Instructions from "../../../pages/games/naturesGaze/NaturesGaze2Instructions";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("NaturesGaze2Instructions Page", () => {
  test("renders the page title", () => {
    render(
      <MemoryRouter>
        <NaturesGaze2Instructions />
      </MemoryRouter>
    );
    const titleElement = screen.getByText(/Nature's Gaze II/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders the How to Play header", () => {
    render(
      <MemoryRouter>
        <NaturesGaze2Instructions />
      </MemoryRouter>
    );
    const howToPlayHeader = screen.getByText(/How to Play/i);
    expect(howToPlayHeader).toBeInTheDocument();
  });

  test("renders the instructions list", () => {
    render(
      <MemoryRouter>
        <NaturesGaze2Instructions />
      </MemoryRouter>
    );
    const instruction1 = screen.getByText(
      /You will begin by focusing on the red dot at the centre of the screen./i
    );
    const instruction2 = screen.getByText(
      /A cat will appear either horizontally or vertically from the central red dot./i
    );
    expect(instruction1).toBeInTheDocument();
    expect(instruction2).toBeInTheDocument();
  });

  test("renders the placeholder for the number of cats", () => {
    render(
      <MemoryRouter>
        <NaturesGaze2Instructions />
      </MemoryRouter>
    );
    const placeholder = screen.getByText(/__/i);
    expect(placeholder).toBeInTheDocument();
  });

  test("renders the Start button", () => {
    render(
      <MemoryRouter>
        <NaturesGaze2Instructions />
      </MemoryRouter>
    );
    const startButton = screen.getByText(/Start/i);
    expect(startButton).toBeInTheDocument();
  });

  test("navigates to /natures-gaze-2-game when Start button is clicked", () => {
    render(
      <MemoryRouter>
        <NaturesGaze2Instructions />
      </MemoryRouter>
    );
    const startButton = screen.getByText(/Start/i);
    fireEvent.click(startButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/natures-gaze-2-game");
  });
});
