import axios from "./axios";
import { SHEET_URL } from "./config";

export const getSheetById = (sheetId) => {
  return axios({
    url: `${SHEET_URL}/${sheetId}/detail`,
    method: "get",
  });
};

export const updateSheetById = (sheetId, data) => {
  return axios({
    url: `${SHEET_URL}/${sheetId}/update`,
    method: "put",
    data,
  });
};

export const getSheetList = (params) => {
  return axios({
    url: `${SHEET_URL}/list`,
    method: "get",
    params,
  });
};

export const removeSheetById = (sheetId) => {
  return axios({
    url: `${SHEET_URL}/${sheetId}/remove`,
    method: "delete",
  });
};

export const createSheet = () => {
  return axios({
    url: `${SHEET_URL}/create`,
    method: "post",
  });
};
