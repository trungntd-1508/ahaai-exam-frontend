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
    width: "30%",
    dataIndex: "fullName",
  },
  {
    title: "Email",
    key: "email",
    width: "30%",
    dataIndex: "email",
  },
  {
    title: "Registed at",
    align: "center",
    key: "createdAt",
    width: "15%",
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
    width: "15%",
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
    };
  },

  computed: {
    getPagination() {
      return {
        ...this.paginationProp,
        ...paginationDefault,
        current: +this.paginationProp.page,
        showTotal: (total) => `Total ${total}`,
      };
    },
    getFormattedData() {
      return this.data.map((record, index) => {
        console.log(record);
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
        };
      });
    },
  },

  mounted() {},

  methods: {
    changePagination(params) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: params.current,
          size: params.pageSize,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
