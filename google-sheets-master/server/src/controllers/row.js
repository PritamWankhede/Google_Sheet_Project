const Grid = require("../models/grid");
const Row = require("../models/row");
const { CustomError, asyncHandler } = require("../utils");

const createRow = asyncHandler(async (req, res) => {
  const { gridId } = req.params;

  const grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not exist", status: 400 });
  }

  req.body.gridId = gridId;

  const row = await Row.create(req.body);

  res.status(200).send({
    data: { rowId: row._id },
    message: "Row has been created successfully",
  });
});

const updateRow = asyncHandler(async (req, res) => {
  const { rowId } = req.params;

  const row = await Row.findById(rowId);

  if (!row) {
    throw new CustomError({ message: "Row not exist", status: 400 });
  }

  await Row.findByIdAndUpdate(rowId, { $set: req.body });

  res.status(200).send({ message: "Row has been updated successfully" });
});

module.exports = { createRow, updateRow };
