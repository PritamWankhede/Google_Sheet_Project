import { Types } from "mongoose";
import Cell from "../models/cell";
import Column from "../models/column";
import Grid from "../models/grid";
import Row from "../models/row";
import Sheet from "../models/sheet";
import { CustomError, asyncHandler } from "../utils";

const createGrid = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;

  const sheet = await Sheet.findById(sheetId);
  if (!sheet) throw new CustomError({ message: "Sheet does not exist", status: 400 });

  const grid = await Grid.create({
    sheetId,
    title: `Sheet ${sheet?.grids?.length ? sheet.grids.length + 1 : 1}`,
    createdBy: req.user._id,
  });

  await Sheet.findByIdAndUpdate(sheetId, { $push: { grids: grid._id } });

  res.status(201).json({
    data: {
      _id: grid._id,
      title: grid.title,
      sheetId: grid.sheetId,
      color: grid.color,
    },
    message: "Grid has been created successfully",
  });
});

const getGridById = asyncHandler(async (req, res) => {
  const { gridId } = req.params;

  const grid = await Grid.findById(gridId, { title: 1, sheetId: 1, color: 1 });
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 404 });

  const [rows, columns, cells] = await Promise.all([
    Row.find({ gridId }, { rowId: 1, height: 1 }),
    Column.find({ gridId }, { columnId: 1, width: 1 }),
    Cell.find({ gridId }, { createdAt: 0, updatedAt: 0, __v: 0 }),
  ]);

  res.status(200).json({
    data: { grid, rows, columns, cells },
    message: "Success",
  });
});

const searchGrid = asyncHandler(async (req, res) => {
  const { gridId } = req.params;
  let { q } = req.query;
  q = q?.trim();

  if (!q) return res.status(200).json({ data: { cells: [] }, message: "Success" });

  const grid = await Grid.findById(gridId);
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 404 });

  const cells = await Cell.aggregate([
    { $match: { gridId: new Types.ObjectId(gridId), text: { $regex: q, $options: "i" } } },
    { $sort: { rowId: 1, columnId: 1 } },
    { $project: { _id: 1 } },
  ]);

  res.status(200).json({ data: { cells: cells.map((cell) => cell._id) }, message: "Success" });
});

const removeGridById = asyncHandler(async (req, res) => {
  const { gridId } = req.params;

  const grid = await Grid.findById(gridId);
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 404 });

  await Promise.all([
    Cell.deleteMany({ gridId }),
    Row.deleteMany({ gridId }),
    Column.deleteMany({ gridId }),
    Grid.findByIdAndDelete(gridId),
  ]);

  const updatedSheet = await Sheet.findById(grid.sheetId);
  const isRemoveSheet = updatedSheet?.grids?.length === 0;

  if (isRemoveSheet) {
    await Sheet.findByIdAndDelete(grid.sheetId);
    res.status(200).json({ message: "Sheet has been deleted successfully" });
  } else {
    await Sheet.findByIdAndUpdate(grid.sheetId, { $pull: { grids: gridId } });
    res.status(200).json({ message: "Grid has been deleted successfully" });
  }
});

const updateGridById = asyncHandler(async (req, res) => {
  const { gridId } = req.params;

  const grid = await Grid.findById(gridId);
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 404 });

  await Grid.findByIdAndUpdate(gridId, { $set: req.body });

  res.status(200).json({ message: "Grid has been updated successfully" });
});

const duplicateGridById = asyncHandler(async (req, res) => {
  const { gridId } = req.params;

  const grid = await Grid.findById(gridId);
  if (!grid) throw new CustomError({ message: "Grid does not exist", status: 404 });

  const newGrid = await Grid.create({
    color: grid.color,
    sheetId: grid.sheetId,
    title: `Copy of ${grid.title}`,
    createdBy: req.user._id,
  });

  await Sheet.findByIdAndUpdate(grid.sheetId, { $push: { grids: newGrid._id } });

  const [cells, rows, columns] = await Promise.all([
    Cell.find({ gridId }),
    Row.find({ gridId }),
    Column.find({ gridId }),
  ]);

  if (cells.length) {
    const newCells = cells.map((c) => ({ ...c.toObject(), _id: new Types.ObjectId(), gridId: newGrid._id }));
    await Cell.insertMany(newCells);
  }

  if (rows.length) {
    const newRows = rows.map((r) => ({ ...r.toObject(), _id: new Types.ObjectId(), gridId: newGrid._id }));
    await Row.insertMany(newRows);
  }

  if (columns.length) {
    const newColumns = columns.map((col) => ({ ...col.toObject(), _id: new Types.ObjectId(), gridId: newGrid._id }));
    await Column.insertMany(newColumns);
  }

  res.status(201).json({
    message: "Grid has been duplicated successfully",
    data: { grid: newGrid.toObject() },
  });
});

export default {
  createGrid,
  getGridById,
  searchGrid,
  removeGridById,
  updateGridById,
  duplicateGridById,
};
