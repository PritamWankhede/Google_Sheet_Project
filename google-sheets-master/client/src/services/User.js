import axios from "./axios";
import { USER_URL } from "./config";

export const signInUser = (data) => {
  return axios({
    url: `${USER_URL}/sign-in`,
    method: "post",
    data,
  });
};

export const signUpUser = (data) => {
  return axios({
    url: `${USER_URL}/sign-up`,
    method: "post",
    data,
  });
};