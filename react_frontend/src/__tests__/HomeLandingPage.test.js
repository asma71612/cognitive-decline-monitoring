import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomeLandingPage from '../pages/HomeLandingPage';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

test('renders Home Landing Page title', () => {
  render(
    <MemoryRouter>
      <HomeLandingPage />
    </MemoryRouter>
  );
  const titleElement = screen.getByAltText(/Title/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders small description', () => {
  render(
    <MemoryRouter>
      <HomeLandingPage />
    </MemoryRouter>
  );
  const descriptionElement = screen.getByText(/Bringing clarity to cognitive health./i);
  expect(descriptionElement).toBeInTheDocument();
});

test('renders patient login button and navigates on click', () => {
  render(
    <MemoryRouter>
      <HomeLandingPage />
    </MemoryRouter>
  );
  const patientButton = screen.getByText(/I am a patient/i);
  expect(patientButton).toBeInTheDocument();
  fireEvent.click(patientButton);
  expect(mockedNavigate).toHaveBeenCalledWith('/patient-login');
});

test('renders healthcare administrator login button and navigates on click', () => {
  render(
    <MemoryRouter>
      <HomeLandingPage />
    </MemoryRouter>
  );
  const adminButton = screen.getByText(/I am a healthcare administrator/i);
  expect(adminButton).toBeInTheDocument();
  fireEvent.click(adminButton);
  expect(mockedNavigate).toHaveBeenCalledWith('/physician-login');
});
