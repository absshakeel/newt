import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home page', () => {
  it('renders the main platform heading', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to Global Tourism Platform/i)).toBeInTheDocument();
  });
});
