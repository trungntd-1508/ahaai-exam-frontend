import { defineStore } from "pinia";
import dashboardService from "../services/dashboard.service";

export const useDashboardStore = defineStore("DashboardStore", {
  state: () => {},
  actions: {
    async statistic() {
      return await dashboardService.statistic();
    },
    async indexUsers(page, limit) {
      return await dashboardService.indexUsers(page, limit);
    },
  },
});
