const createIRow = (rowId, x, y, width, height) => ({ rowId, x, y, width, height });
const createIColumn = (columnId, x, y, width, height) => ({ columnId, x, y, width, height });
const createICell = (cellId, rowId, columnId, x, y, width, height) => ({ cellId, rowId, columnId, x, y, width, height });

const createIColumnDetail = (_id, columnId, width) => ({ _id, columnId, width });
const createIRowDetail = (_id, rowId, height) => ({ _id, rowId, height });
const createICellDetail = (_id, rowId, columnId, text, content, background) => ({
  _id,
  rowId,
  columnId,
  text,
  content,
  background
});

const createIRowProps = (height, backgroundColor) => ({ height, backgroundColor });
const createIColumnProps = (width, backgroundColor) => ({ width, backgroundColor });

const createIActiveStyle = (bold, strike, italic, font, underline, background, color, size) => ({
  bold,
  strike,
  italic,
  font,
  underline,
  background,
  color,
  size
});

const IDirection = ["top", "bottom", "left", "right"];
const IPickerOptions = ["background", "color"];
const IFormatTypes = [
  "bold",
  "italic",
  "strike",
  "underline",
  "align",
  "direction",
  "font",
  "size",
  "textAlign",
  ...IPickerOptions
];

// IGrid, IConfig
const createIGrid = (rows, columns, cells) => ({ rows, columns, cells });
const createIConfig = (
  lineWidth,
  strokeStyle,
  cellHeight,
  cellWidth,
  colWidth,
  defaultFont,
  defaultFontSize,
  scrollBarSize,
  scrollThumbSize,
  rowHeight,
  customFonts,
  fonts,
  scale,
  fontSizes
) => ({
  lineWidth,
  strokeStyle,
  cellHeight,
  cellWidth,
  colWidth,
  defaultFont,
  defaultFontSize,
  scrollBarSize,
  scrollThumbSize,
  rowHeight,
  customFonts,
  fonts,
  scale,
  fontSizes
});


const createISheetGrid = (_id, title, color, sheetId) => ({ _id, title, color, sheetId });
const createISheetDetail = (_id, title, grids) => ({ _id, title, grids });
const createISheetList = (_id, title, createdAt, updatedAt, lastOpenedAt) => ({
  _id,
  title,
  createdAt,
  updatedAt,
  lastOpenedAt
});

const createIAutoFillDetail = (srcCellId, destCellId, rect) => ({ srcCellId, destCellId, rect });
const createIPageMeta = (page, total, totalPages) => ({ page, total, totalPages });
const createIAutoFillData = (createCells, updateCells, cellId) => ({ createCells, updateCells, cellId });

const createIGridData = (grid, rows, columns, cells) => ({ grid, rows, columns, cells });

