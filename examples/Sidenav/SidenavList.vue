<template>
  <div id="sidenav-collapse-main" class="collapse navbar-collapse w-auto h-100">
    <ul class="navbar-nav">
      <li class="nav-item d-flex align-items-center mx-4 px-2">
        <i class="ni ni-chart-bar-32 text-warning text-sm opacity-10"></i>
        <SidenavItem to="/dashboards" mini-icon="C" text="Dashboards" />
      </li>
    </ul>
  </div>
</template>
<script setup>
import SidenavItem from "./SidenavItem.vue";

defineProps({
  isRTL: {
    type: Boolean,
    default: false,
  },
});
</script>
