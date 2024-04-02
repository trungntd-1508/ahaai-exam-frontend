<template>
  <div>
    <a-table
      :data-source="getFormattedData"
      :columns="columns"
      :pagination="getPagination"
      size="middle"
      row-key="id"
      :scroll="{ x: 1300 }"
      @change="changePagination"
    >
    </a-table>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { paginationDefault } from "@/constants/pagination";
import { useDashboardStore } from "~~/stores/DashboardStore";
const columns = [
  {
    title: "Index",
    key: "index",
    width: "5%",
    dataIndex: "index",
  },
  {
    title: "Full name",
    key: "fullName",
    width: "27%",
    dataIndex: "fullName",
  },
  {
    title: "Email",
    key: "email",
    width: "27%",
    dataIndex: "email",
  },
  {
    title: "Verification status",
    key: "isVerify",
    align: "center",
    width: "10%",
    dataIndex: "isVerify",
  },
  {
    title: "Registered at",
    align: "center",
    key: "createdAt",
    width: "13%",
    dataIndex: "createdAt",
  },
  {
    title: "Login times",
    align: "right",
    key: "totalLogin",
    width: "5%",
    dataIndex: "totalLogin",
  },
  {
    title: "Last active at",
    align: "center",
    key: "lastActiveAt",
    width: "13%",
    dataIndex: "lastActiveAt",
  },
];

export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    paginationProp: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      columns,
      pagination: {
        ...this.paginationProp,
        ...paginationDefault,
        showTotal: (total) => `Total ${total}`,
      },
      users: [...this.data],
    };
  },

  computed: {
    getPagination() {
      return {
        ...this.pagination,
        current: +this.pagination.page,
      };
    },
    getFormattedData() {
      return this.users.map((record, index) => {
        return {
          ...record,
          index:
            (this.paginationProp.page - 1) * this.paginationProp.perPage +
            index +
            1,
          createdAt: record.createdAt
            ? dayjs(record.createdAt).format("YYYY/MM/DD hh:mm")
            : null,
          lastActiveAt: record.lastActiveAt
            ? dayjs(record.lastActiveAt).format("YYYY/MM/DD hh:mm")
            : null,
          isVerify: record.verificationAt ? "Yes" : "No",
        };
      });
    },
  },
  watch: {
    pagination: async function (pagination) {
      const dashboardStore = useDashboardStore();
      const indexUsersResponse = await dashboardStore.indexUsers(
        pagination.page,
        pagination.size
      );
      this.users = indexUsersResponse.users;
    },
  },

  mounted() {},

  methods: {
    changePagination(params) {
      this.pagination = {
        ...this.pagination,
        page: params.current,
        size: params.pageSize.toString(),
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
