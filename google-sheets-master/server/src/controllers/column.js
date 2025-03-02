import Column from "../models/column";
import Grid from "../models/grid";
import { CustomError, asyncHandler } from "../utils";

const createColumn = asyncHandler(async (req, res) => {
  let { gridId } = req.params;

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not exist", status: 400 });
  }

  req.body.gridId = gridId;

  if (!req.body.columnId || !req.body.width) {
    throw new CustomError({ message: "Missing required column fields", status: 400 });
  }

  let column = await Column.create(req.body);

  res.status(200).send({
    data: {
      columnId: column._id,
    },
    message: "Column has been created successfully",
  });
});

const updateColumn = asyncHandler(async (req, res) => {
  let { columnId } = req.params;

  let column = await Column.findById(columnId);

  if (!column) {
    throw new CustomError({ message: "Column not exist", status: 400 });
  }

  await Column.findByIdAndUpdate(columnId, { $set: req.body });

  res.status(200).send({ message: "Column has been updated successfully" });
});

const ColumnController = { createColumn, updateColumn };

export default ColumnController;
