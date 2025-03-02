import axios from "./axios";
import { GRID_URL } from "./config";

export const getGridById = (gridId) => {
  return axios({
    url: `${GRID_URL}/${gridId}/detail`,
    method: "get",
  });
};

export const createGrid = (sheetId) => {
  return axios({
    url: `${GRID_URL}/${sheetId}/create`,
    method: "post",
  });
};

export const searchGrid = (gridId, q) => {
  return axios({
    url: `${GRID_URL}/${gridId}/search`,
    method: "get",
    params: { q },
  });
};

export const removeGridById = (gridId) => {
  return axios({
    url: `${GRID_URL}/${gridId}/remove`,
    method: "delete",
  });
};

export const updateGridById = (gridId, data) => {
  return axios({
    url: `${GRID_URL}/${gridId}/update`,
    method: "put",
    data,
  });
};

export const duplicateGridById = (gridId) => {
  return axios({
    url: `${GRID_URL}/${gridId}/duplicate`,
    method: "post",
  });
};