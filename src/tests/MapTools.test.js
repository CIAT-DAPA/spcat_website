import { render, screen } from '@testing-library/react';
import MapTools from './MapTools';

test('renders MapTools component', async () => {
  render(<MapTools />);
  const mapToolsElement = screen.getByRole('row');
  expect(mapToolsElement).toBeInTheDocument();
});
