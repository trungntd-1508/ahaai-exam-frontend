import { defineStore } from "pinia";
import authService from "../services/auth.service";

export const useAuthStore = defineStore("AuthStore", {
  state: () => {
    return {
      currentUser: null,
      authInfo: null,
    };
  },
  actions: {
    async login({ email, password }) {
      const loginResult = await authService.login(email, password);
      if (loginResult.accessToken) this.getProfile();
      return loginResult;
    },
    async requestVerify({ email, password }) {
      await authService.requestVerify({ email, password });
    },
    async verify(code) {
      await authService.verify(code);
      this.getProfile();
    },
    async googleCallback(query) {
      await authService.googleCallback(query);
      this.getProfile();
    },
    async register({ name, email, password, passwordConfirm }) {
      await authService.register(name, email, password, passwordConfirm);
      this.getProfile();
    },
    async logout() {
      await authService.logout();
    },
    checkIsAuthenticated() {
      if (localStorage.getItem("authToken")) return true;

      return false;
    },
    async getProfile() {
      this.currentUser = await authService.getProfile();
    },
    async updateProfile(userId, body) {
      return await authService.updateProfile(userId, body);
    },
    setAuthInfo(authInfo) {
      this.authInfo = authInfo;
    },
  },
});
