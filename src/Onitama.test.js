import { render, screen } from '@testing-library/react';
import Onitama from './Onitama';

test('renders learn react link', () => {
  render(<Onitama />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
