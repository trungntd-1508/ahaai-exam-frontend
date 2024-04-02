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
          <div class="col-lg-4 col-md-7 mt-2">
            <div class="card border-0 mb-0">
              <div class="card-header bg-transparent pb-1">
                <h5 class="text-dark text-center mt-2 mb-3">
                  Congratulation! 🍻
                </h5>
                <div class="text-center text-muted">
                  <small
                    >You have completed account registration. Please access your
                    email to perform the account verification step, and then you
                    can use our application.</small
                  >
                  <br />
                  <small
                    >You will be redirected to the login page after
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
import useToast from "~~/composables/useToast";
const router = useRouter();

definePageMeta({
  layout: false,
  middleware: ["guest"],
});

const timeLeft = ref(0);
const timeInterval = ref(null);

onMounted(() => {
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
    return router.push({ path: "/login" });
  } catch (error) {
    await useToast("error", error.message);
  }
};
</script>
