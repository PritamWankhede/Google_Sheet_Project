import { ChangeEvent, Fragment, useEffect, useState } from "react";
import classNames from "classnames";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Tooltip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useSheet } from "@/hooks/useSheet";
import ColorPicker from "./Grid/ColorPicker";
import { debounce } from "@/utils";
import { config } from "@/constants";

const activeClassName = "bg-light-blue rounded";
const btnClassName = "flex justify-center items-center w-[24px] h-[24px]";
const hoverClassName = "hover:bg-[#DFE4EB] p-1 rounded transition-colors";

const DEFAULT_ACTIVE_STYLE = {
  bold: false,
  strike: false,
  italic: false,
  font: config.defaultFont,
  underline: false,
  background: "#ffffff",
  color: "#000000",
  size: config.defaultFontSize,
};

const ToolBar = () => {
  const [activeStyle, setActiveStyle] = useState(DEFAULT_ACTIVE_STYLE);

  const {
    quill,
    scale,
    editCell,
    selectedCell,
    activeHighLightIndex,
    highLightCells,
    getCellById,
    handleSearchSheet,
    handleFormatCell,
    handleSearchNext,
    handleSearchPrevious,
    handleScaleChange,
  } = useSheet();

  let { background } = getCellById(selectedCell?.cellId) || {};

  useEffect(() => {
    if (!quill) return;

    quill.on("selection-change", handleSelectionChange);
    return () => {
      quill.off("selection-change", handleSelectionChange);
    };
  }, [quill]);

  useEffect(() => {
    if (!selectedCell) return;
    setActiveStyle({
      ...DEFAULT_ACTIVE_STYLE,
      font: config.defaultFont,
      background: background || DEFAULT_ACTIVE_STYLE.background,
    });
  }, [selectedCell]);

  const handleSelectionChange = () => {
    if (!quill) return;

    let {
      bold,
      strike,
      font,
      underline,
      color,
      italic,
      size = config.defaultFontSize,
    } = quill.getFormat();

    setActiveStyle({
      bold: !!bold,
      strike: !!strike,
      underline: !!underline,
      italic: !!italic,
      font: font || DEFAULT_ACTIVE_STYLE.font,
      color: color || DEFAULT_ACTIVE_STYLE.color,
      size: Array.isArray(size) && size.length ? size[size.length - 1] : size,
    });
  };

  const formatText = (type, value) => {
    if (type === "background" || type === "align") {
      handleFormatCell(type, value);
      setActiveStyle({ ...activeStyle, [type]: value });
    } else {
      if (!quill) return;
      quill.format(type, value);
      setActiveStyle({ ...activeStyle, [type]: value });
    }
  };

  const handleRemoveFormat = () => {
    if (!quill) return;
    let selection = quill.getSelection();
    if (!selection) return;
    quill.removeFormat(selection.index, selection.length);
    handleSelectionChange();
  };

  const handleSearch = debounce((e) => handleSearchSheet(e.target.value), 500);

  const Divider = () => <div className="border border-r-[#c7c7c7] h-2/3"></div>;

  return (
    <Fragment>
      <div className="flex items-center h-[calc(var(--toolbar-height)-10px)] bg-mild-blue rounded-full mx-4 mb-[10px]">
        <div className="flex items-center gap-3 px-4">
          <Menu placement="bottom-start">
            {({ isOpen }) => (
              <Fragment>
                <Tooltip label="Zoom" placement="bottom" className="tooltip">
                  <MenuButton className={classNames("w-15", hoverClassName)}>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">
                        {scale * 100}%
                      </span>
                      <i
                        className={classNames(
                          "bx-caret-down transition-transform",
                          isOpen ? "rotate-180" : "rotate-0"
                        )}
                      ></i>
                    </div>
                  </MenuButton>
                </Tooltip>
                <Portal>
                  <MenuList
                    minW={0}
                    className="relative bg-white w-fit"
                    zIndex={999}
                  >
                    {config.scale.map((value, index) => {
                      return (
                        <MenuItem
                          key={index}
                          className={`ql-font-${value} text-sm font-medium py-1 px-4`}
                          onClick={() => handleScaleChange(value)}
                        >
                          {value * 100}%
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Portal>
              </Fragment>
            )}
          </Menu>
        </div>
        <Divider />
        <div className="flex gap-3 px-4">
          <Menu placement="bottom-start">
            {({ isOpen }) => (
              <Fragment>
                <Tooltip label="Font" placement="bottom" className="tooltip">
                  <MenuButton
                    className={classNames("w-44", hoverClassName)}
                    disabled={!editCell}
                  >
                    <div className="flex justify-between items-center gap-4 pl-2 pr-2">
                      <span className="text-sm">
                        {config.fonts[activeStyle.font]}
                      </span>
                      <i
                        className={classNames(
                          "bx-caret-down transition-transform",
                          isOpen ? "rotate-180" : "rotate-0"
                        )}
                      ></i>
                    </div>
                  </MenuButton>
                </Tooltip>
                <Portal>
                  <MenuList
                    className="relative bg-white max-h-60 w-40 overflow-y-scroll"
                    zIndex={999}
                  >
                    {config.customFonts.map((value, index) => {
                      return (
                        <MenuItem
                          key={index}
                          className={`ql-font-${value} py-1 px-4`}
                          onClick={() => formatText("font", value)}
                        >
                          {config.fonts[value]}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Portal>
              </Fragment>
            )}
          </Menu>
          <div className="flex items-center gap-3">
            <Menu placement="bottom-start">
              {({ isOpen }) => (
                <Fragment>
                  <Tooltip label="Font Size" placement="bottom" className="tooltip">
                    <MenuButton
                      className={classNames("w-15", hoverClassName)}
                      disabled={!editCell}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                          {activeStyle.size}
                        </span>
                        <i
                          className={classNames(
                            "bx-caret-down transition-transform",
                            isOpen ? "rotate-180" : "rotate-0"
                          )}
                        ></i>
                      </div>
                    </MenuButton>
                  </Tooltip>
                  <Portal>
                    <MenuList
                      minW={0}
                      className="relative bg-white w-fit max-h-56 overflow-y-auto"
                      zIndex={999}
                    >
                      {config.fontSizes.map((value, index) => {
                        return (
                          <MenuItem
                            key={index}
                            className="text-sm font-medium py-1 px-4"
                            onClick={() => formatText("size", value)}
                          >
                            {value}
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Portal>
                </Fragment>
              )}
            </Menu>
          </div>
        </div>
        <Divider />
        <div className="flex items-center gap-3 px-4 text-xl">
          <Tooltip className="tooltip" label="Bold (Ctrl+B)">
            <button
              className={classNames(btnClassName, hoverClassName, {
                [activeClassName]: activeStyle.bold,
              })}
              disabled={!editCell}
              onClick={() => formatText("bold", !activeStyle.bold)}
            >
              <i className="bx-bold"></i>
            </button>
          </Tooltip>
          <Tooltip className="tooltip" label="Italic (Ctrl+I)">
            <button
              className={classNames(btnClassName, hoverClassName, {
                [activeClassName]: activeStyle.italic,
              })}
              disabled={!editCell}
              onClick={() => formatText("italic", !activeStyle.italic)}
            >
              <i className="bx-italic"></i>
            </button>
          </Tooltip>
          <Tooltip className="tooltip" label="Underline (Ctrl+U)">
            <button
              className={classNames(btnClassName, hoverClassName, {
                [activeClassName]: activeStyle.underline,
              })}
              disabled={!editCell}
              onClick={() => formatText("underline", !activeStyle.underline)}
            >
              <i className="bx-underline"></i>
            </button>
          </Tooltip>
          <Tooltip className="tooltip" label="Strikethrough (Ctrl+S)">
            <button
              className={classNames(btnClassName, hoverClassName, {
                [activeClassName]: activeStyle.strike,
              })}
              disabled={!editCell}
              onClick={() => formatText("strike", !activeStyle.strike)}
            >
              <i className="bx-strikethrough"></i>
            </button>
          </Tooltip>
        </div>
        <Divider />
        <div className="flex items-center gap-3 px-4 text-xl">
          <Popover>
            {({ isOpen, onClose }) => (
              <Fragment>
                <Tooltip className="tooltip" label="Text Color">
                  <PopoverTrigger>
                    <button
                      className={classNames(btnClassName, hoverClassName)}
                      disabled={!editCell}
                    >
                      <div
                        className={classNames(
                          "w-[20px] h-[20px] rounded-full",
                          {
                            [activeClassName]: activeStyle.color !== "#000000",
                          }
                        )}
                        style={{ backgroundColor: activeStyle.color }}
                      ></div>
                    </button>
                  </PopoverTrigger>
                </Tooltip>
                <PopoverContent>
                  <ColorPicker
                    currentColor={activeStyle.color}
                    onSelectColor={(color) => {
                      formatText("color", color);
                      onClose();
                    }}
                  />
                </PopoverContent>
              </Fragment>
            )}
          </Popover>
          <Popover>
            {({ isOpen, onClose }) => (
              <Fragment>
                <Tooltip className="tooltip" label="Background Color">
                  <PopoverTrigger>
                    <button
                      className={classNames(btnClassName, hoverClassName)}
                      disabled={!editCell}
                    >
                      <div
                        className={classNames(
                          "w-[20px] h-[20px] rounded-full",
                          {
                            [activeClassName]:
                              activeStyle.background !== "#ffffff",
                          }
                        )}
                        style={{
                          backgroundColor: activeStyle.background,
                        }}
                      ></div>
                    </button>
                  </PopoverTrigger>
                </Tooltip>
                <PopoverContent>
                  <ColorPicker
                    currentColor={activeStyle.background}
                    onSelectColor={(color) => {
                      formatText("background", color);
                      onClose();
                    }}
                  />
                </PopoverContent>
              </Fragment>
            )}
          </Popover>
        </div>
        <Divider />
        <div className="flex gap-4 px-4 items-center">
          <div>
            <input
              type="text"
              onChange={handleSearch}
              className="text-sm p-2 w-60 rounded-lg border bg-transparent text-dark-blue"
              placeholder="Search"
            />
          </div>
          <button
            disabled={!editCell}
            onClick={handleSearchNext}
            className={classNames(
              "px-3 py-2 rounded-lg hover:bg-[#F0F2F5] focus:bg-[#F0F2F5] transition-colors"
            )}
          >
            <i className="bx bx-chevron-right text-lg"></i>
          </button>
          <button
            disabled={!editCell}
            onClick={handleSearchPrevious}
            className={classNames(
              "px-3 py-2 rounded-lg hover:bg-[#F0F2F5] focus:bg-[#F0F2F5] transition-colors"
            )}
          >
            <i className="bx bx-chevron-left text-lg"></i>
          </button>
        </div>
        <Divider />
      </div>
    </Fragment>
  );
};

export default ToolBar;
