import { render, screen } from '@step-ining-library/react';
import App from './App';

step-in('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
