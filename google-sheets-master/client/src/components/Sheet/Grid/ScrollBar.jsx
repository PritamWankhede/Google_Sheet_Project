import { forwardRef, useState, useRef } from "react";
import classNames from "classnames";

const ScrollBar = forwardRef(({ axis, onScroll }, ref) => {
  const [pointerId, setPointerId] = useState(null);

  const scrollPosition = useRef({
    curr: { x: 0, y: 0 },
    prev: { x: 0, y: 0 },
  });

  const isVertical = axis === "y";

  const handlePointerDown = (event) => {
    let { target, pointerId, pageX, pageY } = event;
    target.setPointerCapture(pointerId);
    scrollPosition.current.curr.x = pageX;
    scrollPosition.current.curr.y = pageY;
    setPointerId(pointerId);
  };

  const handlePointerMove = (event) => {
    if (!pointerId) return;

    let { pageX, pageY } = event;

    scrollPosition.current.prev.x = scrollPosition.current.curr.x;
    scrollPosition.current.prev.y = scrollPosition.current.curr.y;

    scrollPosition.current.curr.x = pageX;
    scrollPosition.current.curr.y = pageY;

    let delta = isVertical
      ? scrollPosition.current.curr.y - scrollPosition.current.prev.y
      : scrollPosition.current.curr.x - scrollPosition.current.prev.x;

    onScroll(delta);
  };

  const handlePointerUp = () => {
    if (!pointerId) return;
    if (ref?.current) ref.current.releasePointerCapture(pointerId);
    setPointerId(null);
  };

  return (
    <div
      className={classNames(
        "absolute flex justify-center bg-white border border-light-gray z-50",
        isVertical
          ? "w-[var(--scrollbar-size)] h-[calc(100%-var(--scrollbar-size))] right-0 top-0"
          : "h-[var(--scrollbar-size)] w-[calc(100%-var(--scrollbar-size))] left-0 bottom-0"
      )}
    >
      <div
        ref={ref}
        className={classNames(
          "absolute bg-light-gray rounded-full cursor-pointer",
          isVertical
            ? "left-1/2 -translate-x-1/2 w-[90%] h-[var(--scrollbar-thumb-size)]"
            : "top-1/2 -translate-y-1/2 w-[var(--scrollbar-thumb-size)] h-[90%]"
        )}
        style={isVertical ? { top: "0px" } : { left: "0px" }}
        onPointerDown={handlePointerDown}
        onPointerMoveCapture={handlePointerMove}
        onPointerUp={handlePointerUp}
      ></div>
    </div>
  );
});

export default ScrollBar;
