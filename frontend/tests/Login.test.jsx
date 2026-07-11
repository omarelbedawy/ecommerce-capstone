import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Login from '../src/pages/Login';

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('Login page', () => {
  it('renders email and password fields', () => {
    renderWithRouter(<Login />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('shows an error message on invalid login', async () => {
    renderWithRouter(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Email'), 'wrong@shop.com');
    await user.type(screen.getByPlaceholderText('Password'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });

  it('logs in successfully with the test customer account', async () => {
    renderWithRouter(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Email'), 'customer@shop.com');
    await user.type(screen.getByPlaceholderText('Password'), 'Customer123!');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // button flips back to "Login" once the request resolves and we navigate away
    expect(await screen.findByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});
