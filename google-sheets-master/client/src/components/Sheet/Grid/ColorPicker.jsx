import classNames from "classnames";

const colorsData = [
  [
    {
      label: "black",
      colorCode: "rgb(0, 0, 0)",
    },
    {
      label: "dark gray 4",
      colorCode: "rgb(67, 67, 67)",
    },
    {
      label: "dark gray 3",
      colorCode: "rgb(102, 102, 102)",
    },
    {
      label: "dark gray 2",
      colorCode: "rgb(153, 153, 153)",
    },
    {
      label: "dark gray 1",
      colorCode: "rgb(183, 183, 183)",
    },
    {
      label: "gray",
      colorCode: "rgb(204, 204, 204)",
    },
    {
      label: "light gray 1",
      colorCode: "rgb(217, 217, 217)",
    },
    {
      label: "light gray 2",
      colorCode: "rgb(239, 239, 239)",
    },
    {
      label: "light gray 3",
      colorCode: "rgb(243, 243, 243)",
    },
    {
      label: "white",
      colorCode: "rgb(255, 255, 255)",
    },
  ],
  [
    {
      label: "red berry",
      colorCode: "rgb(152, 0, 0)",
    },
    {
      label: "red",
      colorCode: "rgb(255, 0, 0)",
    },
    {
      label: "orange",
      colorCode: "rgb(255, 153, 0)",
    },
    {
      label: "yellow",
      colorCode: "rgb(255, 255, 0)",
    },
    {
      label: "green",
      colorCode: "rgb(0, 255, 0)",
    },
    {
      label: "cyan",
      colorCode: "rgb(0, 255, 255)",
    },
    {
      label: "cornflower blue",
      colorCode: "rgb(74, 134, 232)",
    },
    {
      label: "blue",
      colorCode: "rgb(0, 0, 255)",
    },
    {
      label: "purple",
      colorCode: "rgb(153, 0, 255)",
    },
    {
      label: "magenta",
      colorCode: "rgb(255, 0, 255)",
    },
  ],
];

const lightColors = new Set([
  "light gray 2",
  "light gray 1",
  "light gray 3",
  "white",
]);

const ColorPicker = ({ onClick }) => {
  return (
    <div className="flex gap-1 flex-col w-fit shadow-md border border-transparent rounded bg-white z-30 p-4">
      {colorsData.map((colors, index) => {
        return (
          <div key={index} className="flex gap-1">
            {colors.map(({ colorCode, label }) => {
              return (
                <button
                  key={label}
                  title={label}
                  className={classNames("w-5 h-5 rounded-full", {
                    "border border-gray-300": lightColors.has(label),
                  })}
                  style={{ backgroundColor: colorCode }}
                  onClick={() => onClick(colorCode)}
                ></button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ColorPicker;
