import axios from "./axios";
import { ROW_URL } from "./config";

export const createRow = (gridId, data) => {
  return axios({
    url: `${ROW_URL}/${gridId}/create`,
    method: "post",
    data,
  });
};

export const updateRowById = (rowId, data) => {
  return axios({
    url: `${ROW_URL}/${rowId}/update`,
    method: "put",
    data,
  });
};
