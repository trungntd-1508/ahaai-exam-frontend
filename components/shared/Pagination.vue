<template>
  <div
    v-if="pagination && pagination.page"
    class="ct-pagination flex justify-end items-center space-x-4"
  >
    <!-- <div class="text-gray-60">
          Tổng cộng {{ pagination.total | numberFormat }} bản ghi
      </div> -->
    <a-pagination
      v-model.number="pagination.page"
      :total="pagination.total"
      :page-size="pagination.perPage"
      show-less-items
      @change="handleChangePage"
    />
  </div>
</template>

<script>
import _assign from "lodash/assign";
import _clondeDeep from "lodash/cloneDeep";
import _omit from "lodash/omit";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    queryParam: {
      type: String,
      default: "page",
    },
  },

  data() {
    return {
      pagination: _clondeDeep({
        ...this.data,
        page: parseInt(this.data?.page, 10),
      }),
    };
  },

  watch: {
    data(value) {
      this.pagination = _clondeDeep({
        ...value,
        page: parseInt(value.page, 10),
      });
    },
  },

  methods: {
    handleChangePage(page) {
      this.$router.push(this.to(page));
    },

    to(page) {
      const path = this.$route.path;

      const otherParams = _omit(this.$route.query, [this.queryParam]);
      const query =
        page !== 1
          ? _assign({}, otherParams, { [this.queryParam]: page })
          : otherParams;

      return { path, query };
    },
  },
};
</script>

<style lang="scss">
.ct-pagination {
  .ant-pagination-item-active {
    @apply bg-orange-100 border-orange-100;
  }
  .ant-pagination-item {
    @apply hover:border-orange-100;
    a {
      @apply hover:text-orange-100;
    }
    &-active {
      a {
        color: white !important;
      }
    }
  }
  .ant-pagination-item-link {
    @apply hover:border-orange-100 hover:text-orange-100;
  }
}
</style>
