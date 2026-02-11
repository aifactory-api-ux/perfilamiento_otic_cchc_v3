import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import Login from '../../components/Login/Login.jsx';

const authMock = {
  login: vi.fn(),
};

vi.mock('../../services/auth.service.js', () => {
  return {
    default: authMock,
  };
});

describe('Login component', () => {
  let container;
  let root;

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root.unmount();
      });
    }
    if (container) {
      container.remove();
    }
    authMock.login.mockClear();
  });

  it('renders login call to action', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(<Login />);
    });

    expect(container.textContent).toContain('Acceso al sistema');
    expect(container.textContent).toContain('Ingresar con Keycloak');
  });

  it('triggers login on button click', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(<Login />);
    });

    const button = container.querySelector('button');
    expect(button).toBeTruthy();

    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(authMock.login).toHaveBeenCalledTimes(1);
  });
});
