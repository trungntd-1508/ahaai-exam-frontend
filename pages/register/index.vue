<template>
  <NuxtLayout name="authentication">
    <div
      class="page-header min-vh-100"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-basic.jpg');
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container mt-7">
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-7">
            <div class="card z-index-0">
              <div class="card-header text-center pt-4">
                <h5>Register with</h5>
              </div>
              <div class="card-body pt-0">
                <a
                  :href="googleLoginUrl"
                  full-width
                  class="btn btn-neutral btn-icon btn-sm mb-0 w-100"
                >
                  <img class="w-10" src="@/assets/img/logos/google.svg" />
                  Google
                </a>
              </div>
              <div class="row px-xl-5 px-sm-4 px-3">
                <div class="mt-2 position-relative text-center">
                  <p
                    class="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3"
                  >
                    or
                  </p>
                </div>
              </div>
              <div class="card-body">
                <form role="form" @submit.prevent="submitForm">
                  <ArgonInput
                    id="name"
                    v-model="formData.name"
                    name="name"
                    type="text"
                    placeholder="Name"
                    aria-label="Name"
                    :error="isError('name', errorsRef)"
                    :error-message="getErrorMessage('name', errorsRef)"
                  />
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
                  <ArgonInput
                    id="passwordConfirm"
                    v-model="formData.passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    placeholder="Confirm Password"
                    aria-label="Password"
                    :error="isError('passwordConfirm', errorsRef)"
                    :error-message="
                      getErrorMessage('passwordConfirm', errorsRef)
                    "
                  />
                  <span
                    v-if="isError('terms', errorsRef)"
                    style="color: #fd5c70; margin-left: 5px; font-size: 12px"
                  >
                    {{ getErrorMessage("terms", errorsRef) }}
                  </span>
                  <div class="text-center">
                    <ArgonButton
                      type="submit"
                      full-width
                      color="dark"
                      variant="gradient"
                      class="my-4 mb-2"
                      >Register
                    </ArgonButton>
                  </div>

                  <p class="text-sm mt-3 mb-0">
                    Already have an account?
                    <NuxtLink to="/" class="text-dark font-weight-bolder">
                      Sign in
                    </NuxtLink>
                  </p>
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
import {
  required,
  email,
  helpers,
  minLength,
  sameAs,
} from "@vuelidate/validators";
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
const formData = reactive({
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  isChecked: false,
});
const errorsRef = reactive([]);
const googleLoginUrl = computed(() => {
  return `${apiBaseUrl}/sessions/google`;
});

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("The name field is required", required),
    },
    email: {
      required: helpers.withMessage("The email field is required", required),
      email: helpers.withMessage("Invalid email format", email),
    },
    password: {
      required: helpers.withMessage("The password field is required", required),
      minLength: minLength(8),
    },
    passwordConfirm: {
      sameAs: helpers.withMessage(
        "Passwords don't match",
        sameAs(formData.password)
      ),
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
      await authStore.register(formData);
      router.push({ path: "/register/success" });
    } catch (error) {
      await useToast("error", error.message);
    }
  }
};
</script>
