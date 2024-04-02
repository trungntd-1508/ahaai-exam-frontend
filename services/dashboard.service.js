const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;

const statistic = async () => {
  const accessToken = localStorage.getItem("authToken");
  const statisticResponse = await useFetch(`${apiBaseUrl}/statistics`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return statisticResponse.data.value.data;
};

const indexUsers = async (page, limit) => {
  const accessToken = localStorage.getItem("authToken");
  const usersResponse = await useFetch(`${apiBaseUrl}/users`, {
    method: "GET",
    query: {
      page,
      limit,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return usersResponse.data.value.data;
};

export default {
  statistic,
  indexUsers,
};
