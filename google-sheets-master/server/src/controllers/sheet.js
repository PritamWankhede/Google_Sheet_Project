const Sheet = require("../models/sheet");
const Grid = require("../models/grid");
const Cell = require("../models/cell");
const Row = require("../models/row");
const Column = require("../models/column");
const { asyncHandler, CustomError } = require("../utils");

const createSheet = asyncHandler(async (req, res) => {
  const sheet = await Sheet.create({
    createdBy: req.user._id,
  });

  const grid = await Grid.create({ sheetId: sheet._id, createdBy: req.user._id });

  await Sheet.findByIdAndUpdate(sheet._id, { $push: { grids: grid._id } });

  res.status(200).send({
    data: { sheetId: sheet._id },
    message: "Sheet has been created successfully",
  });
});

const getSheetById = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;

  const sheet = await Sheet.findById(sheetId, {
    grids: 1,
    title: 1,
    createdBy: 1,
  }).populate({
    path: "grids",
    select: { title: 1, color: 1, sheetId: 1 },
  });

  if (!sheet) {
    throw new CustomError({ message: "Sheet not exist", status: 400 });
  }

  if (sheet.createdBy.toString() !== req.user._id) {
    throw new CustomError({
      message: "You don't have access to view and edit the sheet",
      status: 400,
    });
  }

  await Sheet.findByIdAndUpdate(sheetId, {
    $set: { lastOpenedAt: new Date().toISOString() },
  });

  res.status(200).send({
    data: {
      _id: sheet._id,
      title: sheet.title,
      grids: sheet.grids,
    },
    message: "Success",
  });
});

const updateSheetById = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;

  const sheet = await Sheet.findById(sheetId);

  if (!sheet) {
    throw new CustomError({ status: 400, message: "Sheet not exist" });
  }

  await Sheet.findByIdAndUpdate(sheetId, { $set: req.body });

  res.status(200).send({ message: "Sheet has been updated successfully" });
});

const getSheetList = asyncHandler(async (req, res) => {
  const { page = 1, search = "", limit = 20 } = req.query;
  const { _id: userId } = req.user;

  const matchQuery = {
    createdBy: userId,
    title: { $regex: search, $options: "i" },
  };

  const sheets = await Sheet.find(
    matchQuery,
    { createdBy: 0 },
    {
      sort: {
        createdAt: 1,
      },
      limit: +limit,
      skip: (+page - 1) * +limit,
    }
  );

  const count = (await Sheet.find(matchQuery)).length;

  const pageMeta = {
    totalPages: Math.ceil(count / +limit),
    total: count,
    page: +page,
  };

  res.status(200).send({ data: { sheets, pageMeta }, message: "Success" });
});

const removeSheetById = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;

  const sheet = await Sheet.findById(sheetId);

  if (!sheet) {
    throw new CustomError({ message: "Sheet not exist", status: 400 });
  }

  const query = { gridId: { $in: sheet.grids } };

  await Cell.deleteMany(query);
  await Row.deleteMany(query);
  await Column.deleteMany(query);
  await Grid.deleteMany({ _id: { $in: sheet.grids } });
  await Sheet.findByIdAndDelete(sheetId);

  res.status(200).send({ message: "Sheet has been deleted successfully" });
});

module.exports = {
  createSheet,
  getSheetById,
  getSheetList,
  updateSheetById,
  removeSheetById,
};
