import Keycloak from 'keycloak-js';
import { KEYCLOAK_CLIENT_ID, KEYCLOAK_REALM, KEYCLOAK_URL } from '../utils/constants.js';

class AuthService {
  constructor() {
    this.keycloak = new Keycloak({
      url: KEYCLOAK_URL,
      realm: KEYCLOAK_REALM,
      clientId: KEYCLOAK_CLIENT_ID,
    });
    this.initialized = false;
  }

  async init() {
    if (this.initialized) {
      return true;
    }
    const authenticated = await this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
    });
    this.initialized = true;
    if (authenticated) {
      this.keycloak.onTokenExpired = () => this.updateToken();
    }
    return authenticated;
  }

  login() {
    return this.keycloak.login();
  }

  logout() {
    return this.keycloak.logout({ redirectUri: window.location.origin + '/login' });
  }

  isAuthenticated() {
    return Boolean(this.keycloak?.authenticated);
  }

  getToken() {
    return this.keycloak?.token;
  }

  async updateToken() {
    if (!this.keycloak) {
      return false;
    }
    try {
      return await this.keycloak.updateToken(30);
    } catch (error) {
      return false;
    }
  }

  getProfile() {
    const tokenParsed = this.keycloak?.tokenParsed || {};
    return {
      username: tokenParsed.preferred_username,
      email: tokenParsed.email,
      roles: tokenParsed.realm_access?.roles ?? [],
    };
  }

  hasRole(roles = []) {
    const profile = this.getProfile();
    return roles.some((role) => profile.roles.includes(role));
  }
}

export default new AuthService();
