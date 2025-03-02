import Cell from "../models/cell";
import Grid from "../models/grid";
import { CustomError, asyncHandler } from "../utils";

const createCell = asyncHandler(async (req, res) => {
  let { gridId } = req.params;

  let grid = await Grid.findById(gridId);
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 400 });

  req.body.gridId = gridId;

  let cell = await Cell.create(req.body);
  res.status(200).send({ data: { cellId: cell._id }, message: "Cell created successfully" });
});

const updateCell = asyncHandler(async (req, res) => {
  let { cellId } = req.params;

  let cell = await Cell.findById(cellId);
  if (!cell) throw new CustomError({ message: "Cell does not exist", status: 400 });

  await Cell.findByIdAndUpdate(cellId, { $set: req.body });

  res.status(200).send({ message: "Cell updated successfully" });
});

const duplicateCells = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { createCells, updateCells, cellId } = req.body;

  if (!cellId || !Array.isArray(createCells) || !Array.isArray(updateCells) || (!createCells.length && !updateCells.length)) {
    return res.status(200).send({ data: { cells: [] }, message: "No cells to duplicate" });
  }

  let grid = await Grid.findById(gridId);
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 400 });

  let cell = await Cell.findById(cellId, { _id: 0, __v: 0, rowId: 0, columnId: 0, updatedAt: 0, createdAt: 0 });
  if (!cell) throw new CustomError({ message: "Cell does not exist", status: 400 });

  let cellDetail = cell.toObject();

  let newCells = createCells.map(({ rowId, columnId }) => ({
    ...cellDetail,
    rowId,
    columnId,
  }));

  let insertedCells = await Cell.create(newCells);

  let updateData = { ...cellDetail };
  delete updateData._id;

  await Cell.updateMany({ _id: { $in: updateCells } }, { $set: updateData });

  res.status(200).send({ data: { cells: [...insertedCells, ...updateCells] }, message: "Cells duplicated successfully" });
});

const removeCell = asyncHandler(async (req, res) => {
  let { cellId } = req.params;

  let cell = await Cell.findById(cellId);
  if (!cell) throw new CustomError({ message: "Cell does not exist", status: 400 });

  await Cell.findByIdAndDelete(cellId);

  res.status(200).send({ message: "Cell deleted successfully" });
});

const copyPasteCell = asyncHandler(async (req, res) => {
  let { cellId } = req.params;
  let { columnId, rowId } = req.body;

  let copyCell = await Cell.findById(cellId, { background: 1, content: 1, gridId: 1, text: 1 });
  if (!copyCell) throw new CustomError({ message: "Cell does not exist", status: 400 });

  let cellData = { ...copyCell.toObject(), rowId, columnId };
  delete cellData._id;

  let existingCell = await Cell.findOne({ gridId: cellData.gridId, rowId, columnId });

  if (existingCell) {
    await Cell.findByIdAndUpdate(existingCell._id, { $set: cellData });
    res.status(200).send({ message: "Cell updated successfully", data: { cell: { ...cellData, _id: existingCell._id } } });
  } else {
    let newCell = await Cell.create(cellData);
    res.status(200).send({ message: "Cell copied successfully", data: { cell: newCell } });
  }
});

const insertColumn = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { columnId, direction } = req.body;

  if (!Number.isInteger(columnId)) return res.status(400).send({ message: "Valid ColumnId is required" });

  let grid = await Grid.findById(gridId);
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 400 });

  if (!["left", "right"].includes(direction)) return res.status(400).send({ message: "Invalid direction" });

  await Cell.updateMany({ gridId, columnId: { [direction === "right" ? "$gt" : "$gte"]: columnId } }, { $inc: { columnId: 1 } });

  res.status(200).send({ message: `Column inserted ${direction} successfully` });
});

const insertRow = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { rowId, direction } = req.body;

  if (!Number.isInteger(rowId)) return res.status(400).send({ message: "Valid RowId is required" });

  let grid = await Grid.findById(gridId);
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 400 });

  if (!["top", "bottom"].includes(direction)) return res.status(400).send({ message: "Invalid direction" });

  await Cell.updateMany({ gridId, rowId: { [direction === "bottom" ? "$gt" : "$gte"]: rowId } }, { $inc: { rowId: 1 } });

  res.status(200).send({ message: "Row inserted successfully" });
});

const removeRow = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { rowId } = req.body;

  if (!Number.isInteger(rowId)) return res.status(400).send({ message: "Valid RowId is required" });

  let grid = await Grid.findById(gridId);
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 400 });

  await Cell.deleteMany({ gridId, rowId });

  res.status(200).send({ message: "Row deleted successfully" });
});

const removeColumn = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { columnId } = req.body;

  if (!Number.isInteger(columnId)) return res.status(400).send({ message: "Valid ColumnId is required" });

  let grid = await Grid.findById(gridId);
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 400 });

  await Cell.deleteMany({ gridId, columnId });

  res.status(200).send({ message: "Column deleted successfully" });
});

const CellController = {
  createCell,
  updateCell,
  removeCell,
  duplicateCells,
  copyPasteCell,
  insertColumn,
  insertRow,
  removeColumn,
  removeRow,
};

export default CellController;
