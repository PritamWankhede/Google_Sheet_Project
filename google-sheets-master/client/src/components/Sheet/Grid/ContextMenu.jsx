import { useMemo, useState } from "react";
import { usePopper } from "react-popper";

const ContextMenu = ({
  rect,
  onCopy,
  onPaste,
  onDeleteCell,
  onDeleteRow,
  onDeleteColumn,
  onInsertRow,
  onInsertColumn,
}) => {
  const [popperElement, setPopperElement] = useState(null);

  const virtualReference = useMemo(() => {
    return {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        right: 0,
        bottom: 0,
        left: rect.x,
        top: rect.y,
      }),
    };
  }, [rect]);

  const { attributes, styles } = usePopper(virtualReference, popperElement, {
    placement: "right",
  });

  const Divider = () => <div className="w-full h-[1px] bg-[#dadce0] my-3"></div>;

  return (
    <div
      ref={setPopperElement}
      className="w-72 shadow-[0_2px_6px_2px_rgba(60,64,67,.15)] border border-transparent rounded bg-white z-50"
      style={styles.popper}
      {...attributes.popper}
    >
      <div className="flex flex-col py-3 font-medium">
        <button
          className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={onCopy}
        >
          <span className="flex items-center gap-3">
            <i className="bx-copy text-xl"></i>
            Copy
          </span>
          <span>Ctrl+C</span>
        </button>
        <button
          className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={onPaste}
        >
          <span className="flex items-center gap-3">
            <i className="bx-paste text-xl"></i>
            Paste
          </span>
          <span>Ctrl+P</span>
        </button>
        <Divider />
        <button
          className="flex gap-3 items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={() => onInsertRow("top")}
        >
          <i className="bx-plus text-xl"></i>
          <span>Insert one row top</span>
        </button>
        <button
          className="flex gap-3 items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={() => onInsertRow("bottom")}
        >
          <i className="bx-plus text-xl"></i>
          <span>Insert one row bottom</span>
        </button>
        <button
          className="flex gap-3 items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={() => onInsertColumn("left")}
        >
          <i className="bx-plus text-xl"></i>
          <span>Insert one column left</span>
        </button>
        <button
          className="flex gap-3 items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={() => onInsertColumn("right")}
        >
          <i className="bx-plus text-xl"></i>
          <span>Insert one column right</span>
        </button>
        <Divider />
        <button
          className="flex gap-3 items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={onDeleteRow}
        >
          <i className="bx-trash text-xl"></i>
          <span>Delete row</span>
        </button>
        <button
          className="flex gap-3 items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={onDeleteColumn}
        >
          <i className="bx-trash text-xl"></i>
          <span>Delete column</span>
        </button>
        <button
          className="flex gap-3 items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={onDeleteCell}
        >
          <i className="bx-trash text-xl"></i>
          <span>Delete cell</span>
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;
