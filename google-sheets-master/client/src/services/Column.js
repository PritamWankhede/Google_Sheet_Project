import axios from "./axios";
import { COLUMN_URL } from "./config";

export const createColumn = (gridId, data) => {
  return axios({
    url: `${COLUMN_URL}/${gridId}/create`,
    method: "post",
    data,
  });
};

export const updateColumnById = (columnId, data) => {
  return axios({
    url: `${COLUMN_URL}/${columnId}/update`,
    method: "put",
    data,
  });
};
