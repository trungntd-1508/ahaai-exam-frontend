import Jsona from "jsona";

const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const dataFormatter = new Jsona();

const login = async (email, password) => {
  try {
    clearNuxtData();
    const body = {
      email,
      password,
    };

    const response = await useFetch(`${apiBaseUrl}/sessions/login`, {
      method: "POST",
      body,
    });

    if (response?.data?.value?.success) {
      const accessToken = response.data.value.data.accessToken;
      const isVerify = response.data.value.data.isVerify;
      if (accessToken) {
        if (process.client) {
          localStorage.setItem("authToken", accessToken);
        }
      }
      return { accessToken, isVerify };
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const requestVerify = async ({ email, password }) => {
  try {
    clearNuxtData();
    const body = {
      email,
      password,
    };
    const { error } = await useFetch(`${apiBaseUrl}/verifications/send`, {
      method: "POST",
      body,
    });
    if (error.value) {
      const errorMessage = error.value.data.error.message;
      throw new Error(errorMessage);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const verify = async (code) => {
  try {
    clearNuxtData();
    const body = {
      code,
    };

    const { data, error } = await useFetch(
      `${apiBaseUrl}/verifications/verify`,
      {
        method: "POST",
        body,
      }
    );

    if (error.value) {
      const errorMessage = error.value.data.error.message;
      throw new Error(errorMessage);
    }

    const accessToken = data.value.data.accessToken;
    if (accessToken) {
      if (process.client) {
        localStorage.setItem("authToken", accessToken);
      }
    }
    return { accessToken };
  } catch (error) {
    throw new Error(error.message);
  }
};

const register = async (name, email, password, password_confirmation) => {
  try {
    clearNuxtData();
    const body = dataFormatter.serialize({
      stuff: {
        type: "users",
        name,
        email,
        password,
        password_confirmation,
      },
    });

    const { data, error } = await useFetch(`${apiBaseUrl}/register`, {
      method: "POST",
      body,
    });

    if (error.value) {
      const errorMessage = error.value.data.message;
      throw new Error(errorMessage);
    }

    const { access_token } = data.value;

    if (process.client) {
      localStorage.setItem("authToken", access_token);
    }

    return access_token;
  } catch (error) {
    throw new Error(error.message);
  }
};

const logout = async () => {
  try {
    const access_token = localStorage.getItem("authToken");
    await useFetch(`${apiBaseUrl}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    localStorage.removeItem("authToken");
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProfile = async () => {
  const accessToken = localStorage.getItem("authToken");
  const profileResponse = await useFetch(`${apiBaseUrl}/sessions/current`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return dataFormatter.deserialize(profileResponse.data.value.data.user);
};

const updateProfile = async (userId, body) => {
  const access_token = localStorage.getItem("authToken");
  try {
    return await useFetch(`${apiBaseUrl}/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.api+json",
        "Content-type": "application/vnd.api+json",
      },
      body,
    });
  } catch (error) {
    useToast("error", error.message);
  }
};

export default {
  login,
  requestVerify,
  verify,
  register,
  logout,
  getProfile,
  updateProfile,
};
