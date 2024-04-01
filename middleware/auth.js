import { defineNuxtRouteMiddleware } from "#app";
import { useAuthStore } from "~~/stores/AuthStore";

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (!authStore.checkIsAuthenticated()) {
    return "/login";
  }
});
