<template>
  <nav
    id="navbarBlur"
    :class="
      navStore.navFixed
        ? `navbar navbar-main navbar-expand-lg px-0 mx-4 border-radius-xl shadow-none position-sticky left-auto top-2 z-index-sticky ${
            navStore.darkMode ? 'bg-default' : 'bg-white'
          }`
        : `navbar navbar-main navbar-expand-lg px-0 mx-4 border-radius-xl shadow-none`
    "
    v-bind="$attrs"
    data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <Breadcrumbs />
      <div class="sidenav-toggler sidenav-toggler-inner d-xl-block d-none">
        <a
          href="#"
          class="p-0 nav-link text-body"
          @click.prevent="toggleSidenav"
        >
          <div class="sidenav-toggler-inner">
            <i
              class="sidenav-toggler-line"
              :class="
                navStore.navFixed && !navStore.darkMode
                  ? 'opacity-8 bg-dark'
                  : 'bg-white'
              "
            ></i>
            <i
              class="sidenav-toggler-line"
              :class="
                navStore.navFixed && !navStore.darkMode
                  ? 'opacity-8 bg-dark'
                  : 'bg-white'
              "
            ></i>
            <i
              class="sidenav-toggler-line"
              :class="
                navStore.navFixed && !navStore.darkMode
                  ? 'opacity-8 bg-dark'
                  : 'bg-white'
              "
            ></i>
          </div>
        </a>
      </div>
      <div
        id="navbar"
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
      >
        <div class="pe-md-3 d-flex align-items-center ms-md-auto"></div>
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item dropdown d-flex align-items-center pe-2">
            <a
              id="dropdownMenuButton"
              href="#"
              :class="`p-0 nav-link text-white ${showProfile ? 'show' : ''}`"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click="showProfile = !showProfile"
            >
              <img :src="defaultAvatar" class="avatar rounded-circle mx-2" />
              <span class="d-sm-inline d-none">{{
                authStore.currentUser?.name
              }}</span>
            </a>
            <ul
              class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4"
              :class="showProfile ? 'show' : ''"
              aria-labelledby="dropdownMenuButton"
            >
              <li
                class="mb-2 dropdown-item"
                @click.prevent="router.push({ path: '/examples/user-profile' })"
              >
                <i class="fas fa-user me-sm-1"></i>
                <span class="d-sm-inline d-none mx-2">My Profile</span>
              </li>
              <li class="dropdown-item" @click.prevent="handleLogout()">
                <i class="ni ni-user-run me-sm-1"></i>
                <span class="d-sm-inline d-none mx-2">Logout</span>
              </li>
            </ul>
          </li>
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
              id="iconNavbarSidenav"
              href="#"
              class="p-0 nav-link text-white"
              @click.prevent="toggleSidenav"
            >
              <div class="sidenav-toggler-inner">
                <i
                  class="sidenav-toggler-line"
                  :class="
                    navStore.navFixed && !navStore.darkMode
                      ? 'opacity-8 bg-dark'
                      : 'bg-white'
                  "
                ></i>
                <i
                  class="sidenav-toggler-line"
                  :class="
                    navStore.navFixed && !navStore.darkMode
                      ? 'opacity-8 bg-dark'
                      : 'bg-white'
                  "
                ></i>
                <i
                  class="sidenav-toggler-line"
                  :class="
                    navStore.navFixed && !navStore.darkMode
                      ? 'opacity-8 bg-dark'
                      : 'bg-white'
                  "
                ></i>
              </div>
            </a>
          </li>
          <li class="px-3 nav-item d-flex align-items-center">
            <a class="p-0 nav-link" @click="toggleShowConfig">
              <i
                class="fas fa-cog pe-2 cursor-pointer fixed-plugin-button-nav"
                :class="
                  navStore.darkMode || !navStore.navFixed
                    ? 'text-white'
                    : 'text-dark opacity-8'
                "
              ></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { useRouter } from "vue-router";
import Breadcrumbs from "../Breadcrumbs";
import defaultAvatar from "../../assets/img/default_avatar.jpeg";
import { useNavStore } from "~~/stores/NavStore";
import { useAuthStore } from "~~/stores/AuthStore";
const router = useRouter();
const navStore = useNavStore();
function toggleSidenav() {
  navStore.toggleSidenavCollapsing();
}
function toggleShowConfig() {
  navStore.toggleShowConfig();
}
const authStore = useAuthStore();

if (!authStore.currentUser && authStore.checkIsAuthenticated()) {
  await authStore.getProfile();
}

const showProfile = ref(false);

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push({ path: "/login" });
  } catch (error) {
    await useToast("error", error.message);
  }
};
</script>
