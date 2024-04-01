<template>
  <NuxtLayout name="authentication">
    <div
      class="page-header min-vh-100"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-basic.jpg');
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container mt-8 mb-4">
        <div class="row justify-content-center">
          <div class="text-center" style="margin-bottom: 5px">
            <h2 class="text-white">Verify Account</h2>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-7 mt-2">
            <div class="card border-0 mb-0">
              <div class="card-header bg-transparent pb-1">
                <h5 class="text-dark text-center mt-2 mb-3">Voila! 🍻</h5>
                <div class="text-center text-muted">
                  <small>Your account is ready!!!</small>
                  <br />
                  <small
                    >You will be redirected to the homepage after
                    {{ timeLeft }}s.</small
                  >
                </div>
              </div>
              <div class="card-body px-lg-5 pt-0">
                <form
                  role="form"
                  class="text-start"
                  @submit.prevent="submitForm"
                >
                  <div class="mb-2 position-relative text-center">
                    <p
                      class="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3"
                    >
                      or
                    </p>
                  </div>
                  <div class="text-center">
                    <ArgonButton
                      type="submit"
                      color="success"
                      variant="gradient"
                      full-width
                      class="my-4 mb-2"
                      >Redirect now</ArgonButton
                    >
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <FooterCentered />
    </template>
  </NuxtLayout>
</template>

<script setup>
import { useRouter } from "vue-router";
import FooterCentered from "@/examples/Footer/Centered.vue";
import { useAuthStore } from "~~/stores/AuthStore";
import useToast from "~~/composables/useToast";
const router = useRouter();

definePageMeta({
  layout: false,
  middleware: ["guest"],
});

const authStore = useAuthStore();
const timeLeft = ref(0);
const timeInterval = ref(null);

onMounted(() => {
  const code = router.currentRoute.value.query.code;
  console.log(code);
  if (!code) return router.push("/");
  resetTimeInterval.value();
});

watch(timeLeft, (timeLeft) => {
  if (timeLeft === 0) {
    submitForm();
  }
});

const countdown = ref(() => {
  if (timeLeft.value <= 0) {
    clearInterval(timeInterval.value);
  } else {
    timeLeft.value--;
  }
});

const resetTimeInterval = ref(() => {
  timeLeft.value = 10;
  timeInterval.value = setInterval(countdown.value, 1000);
});

const submitForm = async () => {
  try {
    const code = router.currentRoute.value.query.code;
    await authStore.verify(code);
    await useToast("success", "Verify successfully.");
    return router.push({ path: "/dashboards/default" });
  } catch (error) {
    await useToast("error", error.message);
  }
};
</script>
