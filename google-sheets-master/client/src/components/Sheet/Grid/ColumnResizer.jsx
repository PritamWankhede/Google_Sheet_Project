import classNames from "classnames";

const HighLightCell = ({ cell, dashed = false }) => {
  return (
    <div className={classNames("absolute", { "z-20": dashed, "z-10": !dashed })}>
      {["top", "bottom", "left", "right"].map((side) => {
        const isHorizontal = side === "top" || side === "bottom";
        return (
          <div
            key={side}
            className={classNames("absolute border-2 border-blue", {
              "border-dashed": dashed,
              "border-t": side === "top",
              "border-b": side === "bottom",
              "border-l": side === "left",
              "border-r": side === "right",
            })}
            style={{
              width: isHorizontal ? cell.width : undefined,
              height: isHorizontal ? undefined : cell.height,
              left: side === "right" ? cell.x + cell.width : cell.x,
              top: side === "bottom" ? cell.y + cell.height : cell.y,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default HighLightCell;
