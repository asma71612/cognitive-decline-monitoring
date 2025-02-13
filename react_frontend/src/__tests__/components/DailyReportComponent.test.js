import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DailyReportComponent from "../../components/DailyReportComponent";
import { getDoc, getDocs } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  collection: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
}));

const mockFirestoreData = {
  users: {
    testUser: {
      allTimeReports: {
        "01-01-2025": {
          games: {
            memoryVault: { CorrectlyRememberedItems: 100 },
            naturesGaze: {
              FixationErrorPercentage: 12.3,
              SaccadeDuration: 150,
              SaccadeErrorPercentage: 7.5,
              SaccadeOmissionPercentage: 2.1,
            },
            processQuest: {
              AverageNounLexicalFrequency: 0.45,
              OpenedClosedRatio: 1.2,
              RevisionRatio: 0.8,
              SemanticIdeaDensity: 2.3,
            },
            sceneDetective: {
              AverageNounLexicalFrequency: 0.38,
              OpenedClosedRatio: 1.1,
              RevisionRatio: 0.7,
              SemanticIdeaDensity: 2.1,
            },
          },
        },
        "12-31-2024": {
          games: {
            memoryVault: { CorrectlyRememberedItems: 80 },
          },
        },
      },
    },
  },
};

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  getDoc: jest.fn(async (docRef) => {
    const pathSegments = docRef.path.split("/");
    const userId = pathSegments[1];
    const date = pathSegments[3];

    const data = mockFirestoreData.users[userId]?.allTimeReports[date] || null;
    return data
      ? { exists: () => true, data: () => data }
      : { exists: () => false };
  }),
  getDocs: jest.fn(async (collectionRef) => {
    const pathSegments = collectionRef.path.split("/");
    const userId = pathSegments[1];

    if (pathSegments.length === 3) {
      const dates = Object.keys(
        mockFirestoreData.users[userId]?.allTimeReports || {}
      );
      return { docs: dates.map((id) => ({ id })) };
    }

    if (pathSegments.length === 5) {
      const date = pathSegments[3];
      const games =
        mockFirestoreData.users[userId]?.allTimeReports[date]?.games || {};
      return {
        docs: Object.entries(games).map(([id, data]) => ({
          id,
          data: () => data,
        })),
      };
    }

    return { docs: [] };
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("renders header and date filter without patient info when no patientId is provided", () => {
  render(<DailyReportComponent />);
  expect(screen.getByText("Daily Reports")).toBeInTheDocument();
  expect(screen.getByRole("combobox")).toBeInTheDocument();
  expect(screen.queryByText(/User ID:/)).toBeNull();
});

it("renders patient info and available dates when patientId is provided", async () => {
  getDoc.mockResolvedValue({
    exists: () => true,
    data: () => ({
      firstName: "John",
      lastName: "Doe",
      dob: "1980-05-15",
      sex: "Male",
    }),
  });

  getDocs.mockResolvedValue({
    docs: [{ id: "02-10-2025" }, { id: "02-11-2025" }],
  });

  render(<DailyReportComponent patientId="testUser" />);

  await waitFor(() => {
    expect(
      screen.getByText((content, element) => {
        return element.textContent.trim() === "John Doe (44, Male)";
      })
    ).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(
      screen.getByText((content, element) => {
        return element.textContent.trim() === "User ID: testUser";
      })
    ).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(
      screen.getByText((content, element) => {
        return element.textContent.trim() === "Date of Birth: 1980-05-15";
      })
    ).toBeInTheDocument();
  });
});

test("renders available dates in the date filter", async () => {
  getDocs.mockResolvedValue({
    docs: [{ id: "02-10-2025" }, { id: "02-11-2025" }],
  });

  render(<DailyReportComponent patientId="testUser" />);

  await waitFor(() => {
    expect(screen.getByRole("combobox")).toHaveLength(3);
    expect(screen.getByText("02-11-2025")).toBeInTheDocument();
    expect(screen.getByText("02-10-2025")).toBeInTheDocument();
  });
});
