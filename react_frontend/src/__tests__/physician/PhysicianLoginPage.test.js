import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import PhysicianLoginPage from "../../pages/physician/PhysicianLoginPage";

// Mock the necessary Firebase modules to prevent real Firebase connections
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(), // Mock initializeApp so it doesn't actually initialize Firebase
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ auth: "mockAuthInstance" })),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({ firestore: "mockFirestoreInstance" })),
}));

describe("PhysicianLoginPage", () => {
//   test("renders the correct text content", () => {
//     render(
//       <Router>
//         <PhysicianLoginPage />
//       </Router>
//     );

//     // Check for static text on the page
//     expect(screen.getByText(/Welcome to Cognify!/i)).toBeInTheDocument();
//     expect(screen.getByText(/Log In/i)).toBeInTheDocument();
//     expect(
//       screen.getByText(/Enter your email and password to start./i)
//     ).toBeInTheDocument();
//     expect(screen.getByText(/Forgot your password\?/i)).toBeInTheDocument();

//     // Use a regex to match the text more flexibly
//     expect(
//       screen.getByText(
//         /Don['']t have an account\?[\s\S]*Sign up here/i // Allows flexibility in whitespace and possible line breaks
//       )
//     ).toBeInTheDocument();

//     // Use getAllByText to ensure both instances of "Log In" are checked
//     const logInElements = screen.getAllByText(/Log In/i);
//     expect(logInElements.length).toBeGreaterThanOrEqual(1); // This ensures the text appears at least once
//   });

  //   test("handles login with valid credentials", async () => {
  //     const email = "test@example.com";
  //     const password = "testpassword";

  //     // Mock the signInWithEmailAndPassword function to resolve successfully
  //     require("firebase/auth").signInWithEmailAndPassword.mockResolvedValueOnce({
  //       user: { email },
  //     });

  //     render(
  //       <Router>
  //         <PhysicianLoginPage />
  //       </Router>
  //     );

  //     fireEvent.change(screen.getByLabelText(/Email/i), {
  //       target: { value: email },
  //     });
  //     fireEvent.change(screen.getByLabelText(/Password/i), {
  //       target: { value: password },
  //     });

  //     fireEvent.click(screen.getByRole("button", { name: /Log In/i }));

  //     // Check if the navigation happens after successful login
  //     await waitFor(() => {
  //       // Assuming the navigate function works as expected in this mock setup
  //       expect(window.location.pathname).toBe("/physician-home-page");
  //     });
  //   });

  //   test("displays error with invalid credentials", async () => {
  //     const email = "test@example.com";
  //     const password = "wrongpassword";

  //     // Mock signInWithEmailAndPassword to simulate an error (rejected promise)
  //     require("firebase/auth").signInWithEmailAndPassword.mockRejectedValueOnce(
  //       new Error("Incorrect password")
  //     );

  //     render(
  //       <Router>
  //         <PhysicianLoginPage />
  //       </Router>
  //     );

  //     fireEvent.change(screen.getByLabelText(/Email/i), {
  //       target: { value: email },
  //     });
  //     fireEvent.change(screen.getByLabelText(/Password/i), {
  //       target: { value: password },
  //     });

  //     fireEvent.click(screen.getByRole("button", { name: /Log In/i }));

  //     await waitFor(() =>
  //       expect(
  //         screen.getByText(/Error: Incorrect email or password\./i)
  //       ).toBeInTheDocument()
  //     );
  //   });

  //   test("handles Google login button click", async () => {
  //     const mockGoogleUser = { email: "google@example.com" };

  //     // Mock the signInWithPopup to resolve with a mock user
  //     require("firebase/auth").signInWithPopup.mockResolvedValueOnce({
  //       user: mockGoogleUser,
  //     });

  //     render(
  //       <Router>
  //         <PhysicianLoginPage />
  //       </Router>
  //     );

  //     fireEvent.click(
  //       screen.getByRole("button", { name: /Sign in with Google/i })
  //     );

  //     await waitFor(() => {
  //       // Check if the user is redirected to the home page after successful Google login
  //       expect(window.location.pathname).toBe("/physician-home-page");
  //     });
  //   });

  //   test("handles password reset request", async () => {
  //     const email = "test@example.com";

  //     // Mock sendPasswordResetEmail to simulate successful password reset
  //     require("firebase/auth").sendPasswordResetEmail.mockResolvedValueOnce();

  //     render(
  //       <Router>
  //         <PhysicianLoginPage />
  //       </Router>
  //     );

  //     fireEvent.change(screen.getByLabelText(/Email/i), {
  //       target: { value: email },
  //     });
  //     fireEvent.click(screen.getByText(/Forgot your password\?/i));

  //     await waitFor(() =>
  //       expect(
  //         screen.getByText(/Password reset email sent. Please check your inbox./i)
  //       ).toBeInTheDocument()
  //     );
  //   });
});
