import axios from "./axios";
import { CELL_URL } from "./config";

export const createCell = (gridId, data) =>
  axios({
    url: `${CELL_URL}/${gridId}/create`,
    method: "post",
    data,
  });

export const updateCellById = (cellId, data) =>
  axios({
    url: `${CELL_URL}/${cellId}/update`,
    method: "put",
    data,
  });

export const duplicateCells = (gridId, data) =>
  axios({
    url: `${CELL_URL}/${gridId}/duplicate`,
    method: "post",
    data,
  });

export const copyPasteCell = (cellId, data) =>
  axios({
    url: `${CELL_URL}/${cellId}/copypaste`,
    method: "post",
    data,
  });

export const insertColumn = (gridId, data) =>
  axios({
    url: `${CELL_URL}/${gridId}/insert/column`,
    method: "put",
    data,
  });

export const insertRow = (gridId, data) =>
  axios({
    url: `${CELL_URL}/${gridId}/insert/row`,
    method: "put",
    data,
  });

export const deleteCellById = (cellId) =>
  axios({
    url: `${CELL_URL}/${cellId}/cell`,
    method: "delete",
  });

export const deleteColumn = (gridId, columnId) =>
  axios({
    url: `${CELL_URL}/${gridId}/column`,
    method: "delete",
    data: { columnId },
  });

export const deleteRow = (gridId, rowId) =>
  axios({
    url: `${CELL_URL}/${gridId}/row`,
    method: "delete",
    data: { rowId },
  });
