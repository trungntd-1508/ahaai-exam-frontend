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
            <h2 class="text-white">Log in</h2>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-7 mt-2">
            <div class="card border-0 mb-0">
              <div class="card-header bg-transparent">
                <h5 class="text-dark text-center mt-2 mb-3">Welcome! 👋🏻</h5>
                <div class="text-center text-muted mb-2">
                  <small
                    >Please sign-in to your account and start the
                    adventure</small
                  >
                </div>
              </div>
              <div class="card-body px-lg-5 pt-0">
                <a
                  :href="googleLoginUrl"
                  full-width
                  class="btn btn-neutral btn-icon btn-sm mb-0 w-100"
                >
                  <img class="w-10" src="@/assets/img/logos/google.svg" />
                  Google
                </a>
              </div>
              <div class="card-body px-lg-5 pt-0">
                <div class="text-center text-muted mb-4">
                  <small>Or sign in with credentials</small>
                </div>
                <form
                  role="form"
                  class="text-start"
                  @submit.prevent="submitForm"
                >
                  <div class="mb-3">
                    <ArgonInput
                      id="email"
                      v-model="formData.email"
                      name="email"
                      type="text"
                      placeholder="Email"
                      aria-label="Email"
                      :error="isError('email', errorsRef)"
                      :error-message="getErrorMessage('email', errorsRef)"
                    />
                  </div>
                  <div class="mb-3">
                    <ArgonInput
                      id="password"
                      v-model="formData.password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      aria-label="Password"
                      :error="isError('password', errorsRef)"
                      :error-message="getErrorMessage('password', errorsRef)"
                    />
                  </div>
                  <div class="text-center">
                    <ArgonButton
                      type="submit"
                      color="success"
                      variant="gradient"
                      full-width
                      class="my-4 mb-2"
                      >Sign in</ArgonButton
                    >
                  </div>
                  <div class="mb-2 position-relative text-center">
                    <p
                      class="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3"
                    >
                      or
                    </p>
                  </div>
                  <div class="text-center">
                    <ArgonButton
                      color="dark"
                      variant="gradient"
                      full-width
                      class="mt-2 mb-4"
                      @click.prevent="router.push({ path: '/register' })"
                      >Register</ArgonButton
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
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import FooterCentered from "@/examples/Footer/Centered.vue";
import { useAuthStore } from "~~/stores/AuthStore";
import useToast from "~~/composables/useToast";
import { getErrorMessage, isError } from "~~/helpers/errorHandler";
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
definePageMeta({
  layout: false,
  middleware: ["guest"],
});
const router = useRouter();
const authStore = useAuthStore();
const formData = reactive({});
const errorsRef = reactive([]);

const googleLoginUrl = computed(() => {
  return `${apiBaseUrl}/sessions/google`;
});

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("The email field is required", required),
      email: helpers.withMessage("Invalid email format", email),
    },
    password: {
      required: helpers.withMessage("The password field is required", required),
    },
  };
});
const v$ = useVuelidate(rules, formData);

const submitForm = async () => {
  v$.value.$validate();

  if (v$.value.$error) {
    const errors = JSON.parse(JSON.stringify(v$.value.$errors));
    errorsRef.value = [...errors];
  } else {
    try {
      const loginResult = await authStore.login(formData);
      if (loginResult.isVerify) {
        await useToast("success", "Login successfully.");
        return router.push({ path: "/dashboards/default" });
      } else {
        authStore.setAuthInfo(formData);
        return router.push({ path: "/auth/verifications/send" });
      }
    } catch (error) {
      await useToast("error", error.message);
    }
  }
};
</script>
