import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../../components/Login/Login.jsx';

test('shows keycloak login button', () => {
  render(<Login />);

  expect(screen.getByRole('button', { name: /Ingresar con Keycloak/i })).toBeInTheDocument();
});
