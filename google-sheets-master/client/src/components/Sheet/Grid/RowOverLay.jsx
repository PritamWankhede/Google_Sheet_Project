const RowOverLay = ({ row }) => {
  let top = `calc(${row.y}px - var(--row-height))`;

  return (
    <div
      className="absolute top-[var(--col-height)] left-0 w-full border-dark-blue border-t border-b bg-light-sky-blue"
      style={{ height: row.height, top }}
    ></div>
  );
};

export default RowOverLay;
