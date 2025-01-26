import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PatientLoginPage from "../../pages/patient/PatientLoginPage";
import { getDoc, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Mock Firebase functions and firestore methods
jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock("../../firebaseConfig.js", () => ({
  db: {}, // Mock db (Firestore)
  auth: {}, // Mock auth (Firebase Authentication)
}));

// Mock navigate from react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("PatientLoginPage", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    getFirestore.mockReturnValue({}); // Mock the Firestore instance return value
  });

  test("renders PatientLoginPage and checks elements", async () => {
    render(<PatientLoginPage />);

    expect(await screen.findByText("Welcome to Cognify!")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /log in/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Enter your user identification code to start.")
    ).toBeInTheDocument();
  });

  test("handles input change", () => {
    render(<PatientLoginPage />);

    const inputField = screen.getByRole("textbox");
    fireEvent.change(inputField, { target: { value: "testUserId" } });

    expect(inputField.value).toBe("testUserId");
  });

  // test("shows error when invalid user ID is entered", async () => {
  //   // Mock Firebase response to simulate invalid user ID
  //   getDoc.mockResolvedValueOnce({ exists: jest.fn(() => false) });

  //   render(<PatientLoginPage />);

  //   const inputField = screen.getByRole("textbox");
  //   fireEvent.change(inputField, { target: { value: "invalidUserId" } });
  //   fireEvent.click(screen.getByRole("button", { name: /log in/i }));

  //   await waitFor(() => {
  //     expect(
  //       screen.getByText("ERROR: Invalid User Identification Code.")
  //     ).toBeInTheDocument();
  //   });
  // });

  test("navigates to patient home page on successful login", async () => {
    // Mock Firebase response to simulate valid user ID
    getDoc.mockResolvedValueOnce({
      exists: jest.fn(() => true),
      data: jest.fn(() => ({ userId: "validUserId" })),
    });

    render(<PatientLoginPage />);

    const inputField = screen.getByRole("textbox");
    fireEvent.change(inputField, { target: { value: "validUserId" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/patient-home-page");
    });
  });

  test("shows error when Firebase request fails", async () => {
    // Simulate a Firebase error
    getDoc.mockRejectedValueOnce(new Error("Firebase error"));

    render(<PatientLoginPage />);

    const inputField = screen.getByRole("textbox");
    fireEvent.change(inputField, { target: { value: "validUserId" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(
        screen.getByText("An error occurred. Please try again.")
      ).toBeInTheDocument();
    });
  });

//   test("disables login button when there is an error", async () => {});
//   test("does not allow login without a user ID", async () => {});
});
