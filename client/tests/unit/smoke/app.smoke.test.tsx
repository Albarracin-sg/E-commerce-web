import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../../src/App';

describe('App smoke', () => {
  it('renders the login route shell', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/vibra shop/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 1, name: /^bienvenido$/i })).toBeInTheDocument();
  });
});
