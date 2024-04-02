<template>
  <div>
    {{ data }}
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~~/stores/AuthStore";
const router = useRouter();
const authStore = useAuthStore();

definePageMeta({
  layout: false,
  middleware: ["guest"],
});

await useAsyncData(async () => {
  const query = router.currentRoute.value.query;
  await authStore.googleCallback(query);
});

onMounted(() => {
  router.push("/");
});
</script>
