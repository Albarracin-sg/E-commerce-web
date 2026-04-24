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

    expect(screen.getByRole('heading', { name: /bienvenido/i })).toBeInTheDocument();
  });
});
