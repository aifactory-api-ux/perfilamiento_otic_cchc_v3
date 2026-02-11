import { describe, it, expect, vi, beforeEach } from 'vitest';

const buildKeycloakMock = (overrides = {}) => {
  return {
    authenticated: true,
    token: 'token-123',
    tokenParsed: {
      preferred_username: 'tester',
      email: 'tester@example.com',
      realm_access: { roles: ['admin'] },
    },
    init: vi.fn().mockResolvedValue(true),
    login: vi.fn().mockResolvedValue(true),
    logout: vi.fn().mockResolvedValue(true),
    updateToken: vi.fn().mockResolvedValue(true),
    onTokenExpired: null,
    ...overrides,
  };
};

const loadService = async (keycloakInstance) => {
  vi.resetModules();
  vi.doMock('keycloak-js', () => {
    return {
      default: function KeycloakMock() {
        return keycloakInstance;
      },
    };
  });
  const module = await import('../../services/auth.service.js');
  return module.default;
};

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes keycloak only once', async () => {
    const instance = buildKeycloakMock();
    const service = await loadService(instance);

    const first = await service.init();
    const second = await service.init();

    expect(first).toBe(true);
    expect(second).toBe(true);
    expect(instance.init).toHaveBeenCalledTimes(1);
  });

  it('returns authentication status and token', async () => {
    const instance = buildKeycloakMock({ authenticated: false, token: null });
    const service = await loadService(instance);

    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBe(null);
  });

  it('updates the token when available', async () => {
    const instance = buildKeycloakMock();
    const service = await loadService(instance);

    const updated = await service.updateToken();

    expect(updated).toBe(true);
    expect(instance.updateToken).toHaveBeenCalledWith(30);
  });

  it('extracts profile and roles from token', async () => {
    const instance = buildKeycloakMock({
      tokenParsed: {
        preferred_username: 'admin',
        email: 'admin@example.com',
        realm_access: { roles: ['admin', 'manager'] },
      },
    });
    const service = await loadService(instance);

    const profile = service.getProfile();

    expect(profile.username).toBe('admin');
    expect(profile.roles).toContain('manager');
    expect(service.hasRole(['admin'])).toBe(true);
  });

  it('returns false when update token fails', async () => {
    const instance = buildKeycloakMock({ updateToken: vi.fn().mockRejectedValue(new Error('fail')) });
    const service = await loadService(instance);

    const updated = await service.updateToken();

    expect(updated).toBe(false);
  });
});
