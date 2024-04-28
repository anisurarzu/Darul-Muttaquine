import axios from "axios";

export const coreAxios = axios.create({
  baseURL: process.env.REACT_APP_MAIN_URL,
  headers: { "Access-Control-Allow-Origin": "*" },
});
/* export const coreAxios2 = axios.create({
    baseURL: process.env.REACT_APP_MAIN_URL,
    headers: { "Access-Control-Allow-Origin": "*", "api-version": 1.1 },
}); */

coreAxios.interceptors.request.use(function (req) {
  let token = localStorage.getItem("token");
  if (token) {
    req.headers.authorization = "Bearer " + token;
  }

  return req;
});
coreAxios.interceptors.response.use(
  function (res) {
    return res;
  },
  (error) => {
    if (error?.response?.status === 401) {
      window.location =
        window.location.protocol + "//" + window.location.host + "#/login";
      localStorage.clear();
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);
