<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div
            v-for="{
              title,
              value,
              description,
              icon: { component, background, shape },
            } of cardData"
            :key="title"
            class="col-lg-4 col-md-6 col-12"
          >
            <MiniStatisticsCard
              :title="title"
              :value="value"
              :description="description"
              :icon="{
                component: component,
                background: background,
                shape: shape,
              }"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">Users List</h3>
          </div>
          <div class="table-responsive px-4">
            <Table :data="userData" :pagination-prop="userDataPagination" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Table from "@/components/users/Table.vue";
import { useDashboardStore } from "~~/stores/DashboardStore";
import MiniStatisticsCard from "~~/examples/cards/MiniStatisticsCard.vue";
const dashboardStore = useDashboardStore();

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});
const cardData = [
  {
    title: "Total Users",
    key: "totalUsersCount",
    value: "0",
    icon: {
      component: "ni ni-badge",
      background: "bg-gradient-danger",
      shape: "rounded-circle",
    },
  },
  {
    title: "Daily Sessions",
    key: "totalUsersActiveToday",
    value: "0",
    icon: {
      component: "ni ni-user-run",
      background: "bg-gradient-success",
      shape: "rounded-circle",
    },
  },
  {
    title: "Weekly Sessions",
    key: "totalUsersActiveThisWeek",
    value: "0",
    icon: {
      component: "ni ni-user-run",
      background: "bg-gradient-warning",
      shape: "rounded-circle",
    },
  },
];

const userData = ref([]);
const userDataPagination = ref({});

onMounted(() => {});

const loadUsers = async (page, limit) => {
  const indexUsersResponse = await dashboardStore.indexUsers(page, limit);
  userData.value = indexUsersResponse.users;
  userDataPagination.value = indexUsersResponse.pagination;
};

await useAsyncData(async () => {
  const statistics = await dashboardStore.statistic();
  cardData.forEach((card) => {
    card.value = statistics[card.key] ? statistics[card.key].toString() : "0";
  });
  await loadUsers();
});
</script>
