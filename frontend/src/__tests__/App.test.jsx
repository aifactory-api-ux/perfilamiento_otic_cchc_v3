import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import App from '../App.jsx';

vi.mock('../services/auth.service.js', () => {
  return {
    default: {
      isAuthenticated: vi.fn(() => false),
      hasRole: vi.fn(() => true),
    },
  };
});

const renderWithRouter = async (initialEntries) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>,
    );
  });

  return { container, root };
};

describe('App routing', () => {
  let cleanup = null;

  beforeEach(() => {
    cleanup = null;
  });

  afterEach(async () => {
    if (cleanup) {
      await act(async () => {
        cleanup.root.unmount();
      });
      cleanup.container.remove();
    }
  });

  it('renders login route directly', async () => {
    cleanup = await renderWithRouter(['/login']);
    expect(cleanup.container.textContent).toContain('Acceso al sistema');
  });

  it('redirects unauthenticated users to login', async () => {
    cleanup = await renderWithRouter(['/']);
    expect(cleanup.container.textContent).toContain('Acceso al sistema');
  });
});
