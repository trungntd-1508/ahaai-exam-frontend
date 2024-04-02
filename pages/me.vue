<template>
  <div class="py-4 container-fluid">
    <div class="card shadow-lg mx-4 profile-card">
      <div class="card-body p-3">
        <div class="row gx-4">
          <div class="col-auto">
            <div class="avatar avatar-xl position-relative">
              <img
                :src="defaultAvatar"
                alt="profile_image"
                class="shadow-sm w-100 border-radius-lg"
              />
            </div>
          </div>
          <div class="col-auto my-auto">
            <div class="h-100">
              <h5 class="mb-1">{{ authStore.currentUser.fullName }}</h5>
              <p class="mb-0 text-sm font-weight-bold">
                {{ authStore.currentUser.email }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="card shadow-lg mx-4 p-3 mt-4">
        <h5 class="font-weight-bolder mb-0">Edit Profile</h5>
        <div class="mt-4">
          <div class="col-12 mt-sm-0">
            <label>Full name</label>
            <ArgonInput
              id="user-name"
              v-model="newName"
              class="multisteps-form__input"
              type="text"
              placeholder="Name"
              :error="isError('name', errorsRef)"
              :error-message="getErrorMessage('name', errorsRef)"
            />
          </div>
          <div class="col-12 mt-sm-0">
            <label>Email</label>
            <div class="form-group multisteps-form__input">
              <div class="">
                <input
                  id="user-email"
                  type="email"
                  class="form-control form-control-default"
                  name=""
                  placeholder="Email"
                  isrequired="false"
                  :value="authStore.currentUser.email"
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="button-row d-flex mt-4">
            <ArgonButton
              type="button"
              color="primary"
              variant="gradient"
              class="ms-auto mb-0"
              @click.prevent="handleSubmit()"
              >Submit
            </ArgonButton>
          </div>
        </div>
      </div>
      <div class="card shadow-lg mx-4 p-3 mt-4">
        <h5 class="font-weight-bolder mb-0">Change Password</h5>
        <form role="form" @submit.prevent="handlePasswordChange">
          <div class="mt-4">
            <div class="col-12 mt-sm-0">
              <label>Current Password</label>
              <ArgonInput
                id="current-password"
                v-model="passwordFormData.currentPassword"
                class="multisteps-form__input"
                type="password"
                placeholder="******"
                :error="isError('currentPassword', passwordErrorsRef)"
                :error-message="
                  getErrorMessage('currentPassword', passwordErrorsRef)
                "
              />
            </div>
            <label>New Password</label>
            <ArgonInput
              id="new-password"
              v-model="passwordFormData.password"
              class="multisteps-form__input"
              type="password"
              placeholder="******"
              :error="isError('password', passwordErrorsRef)"
              :error-message="getErrorMessage('password', passwordErrorsRef)"
            />
          </div>
          <div class="col-12 mt-sm-0">
            <label>Repeat New Password</label>
            <ArgonInput
              id="repeat-password"
              v-model="passwordFormData.passwordConfirmation"
              class="multisteps-form__input"
              type="password"
              placeholder="******"
              :error="isError('passwordConfirmation', passwordErrorsRef)"
              :error-message="
                getErrorMessage('passwordConfirmation', passwordErrorsRef)
              "
            />
          </div>
          <div class="button-row d-flex mt-4">
            <ArgonButton
              type="submit"
              color="primary"
              variant="gradient"
              class="ms-auto mb-0"
              @click.prevent="handlePasswordChange()"
              >Submit
            </ArgonButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minLength, sameAs } from "@vuelidate/validators";
import defaultAvatar from "~~/assets/img/default_avatar.jpeg";
import { useAuthStore } from "~~/stores/AuthStore";
import { isError, getErrorMessage } from "~~/helpers/errorHandler";

definePageMeta({
  layout: "profile-layout",
  middleware: ["auth"],
});

const authStore = useAuthStore();
if (!authStore.currentUser && authStore.checkIsAuthenticated()) {
  await authStore.getProfile();
}
const newName = ref(authStore.currentUser.fullName);
const errorsRef = reactive([]);

const handleSubmit = async () => {
  try {
    errorsRef.value = [];
    handleProfileErrors();
    if (!errorsRef.value.length) {
      const body = {
        fullName: newName.value,
      };

      const updateUserResponse = await authStore.updateProfile(body);

      if (updateUserResponse.error.value) {
        const errorMessage =
          updateUserResponse.error.value.data.errors[0].detail;
        useToast("error", errorMessage);
      } else {
        await authStore.getProfile();
        useToast("success", "Profile updated successfully");
      }
    }
  } catch (error) {
    useToast("error", error.message);
  }
};

const passwordFormData = reactive({
  currentPassword: "",
  password: "",
  passwordConfirmation: "",
});
const passwordErrorsRef = reactive([]);

const passwordRules = computed(() => {
  return {
    currentPassword: {
      required: helpers.withMessage(
        "Current password field is required",
        required
      ),
      minLength: minLength(8),
    },
    password: {
      required: helpers.withMessage("The password field is required", required),
      minLength: minLength(8),
    },
    passwordConfirmation: {
      sameAs: helpers.withMessage(
        "Passwords don't match",
        sameAs(passwordFormData.password)
      ),
    },
  };
});
const vp$ = useVuelidate(passwordRules, passwordFormData);

const handlePasswordChange = async () => {
  try {
    vp$.value.$validate();
    passwordErrorsRef.value = [];
    if (vp$.value.$error) {
      const errors = JSON.parse(JSON.stringify(vp$.value.$errors));
      passwordErrorsRef.value = [...errors];
    } else {
      const { error } = await authStore.changePassword(passwordFormData);

      if (error.value) {
        if (error.value.data.error.errorCode === 120) {
          for (const key of Object.keys(error.value.data.error.messages)) {
            passwordErrorsRef.value = [
              ...passwordErrorsRef.value,
              {
                $property: key,
                $message: error.value.data.error.messages[key].join("\n"),
              },
            ];
          }
        } else {
          throw new Error(error.value.data.error.message);
        }
      } else {
        useToast("success", "Password updated successfully");
        Object.assign(passwordFormData, {
          currentPassword: "",
          password: "",
          passwordConfirmation: "",
        });
      }
    }
  } catch (error) {
    useToast("error", error.message);
  }
};

const handleProfileErrors = () => {
  if (!newName.value) {
    errorsRef.value = [
      ...errorsRef.value,
      { $property: "name", $message: "The name field is required." },
    ];
  }
};
</script>
