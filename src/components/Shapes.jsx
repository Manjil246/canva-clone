import React, { useState } from "react";
import {
  Square,
  Circle,
  PlayArrow,
  Rectangle,
  CircleRounded,
  PentagonRounded,
} from "@mui/icons-material";
import {
  Rect,
  Circle as FabricCircle,
  Triangle as FabricTriangle,
  Polygon,
  Ellipse,
  Path,
} from "fabric";
import DoubleArrow from "../assets/shapes/DoubleArrow";
import CurvedArrow from "../assets/shapes/CurvedArrow";
import FourSidedArrow from "../assets/shapes/FourSidedArrow";
import ThreeSidedArrow from "../assets/shapes/ThreeSidedArrow";
import UTurnArrow from "../assets/shapes/UTurnArrow";
import FourSidedSquareArrow from "../assets/shapes/FourSidedSquareArrow";
import RightAngledTwoSidedArrow from "../assets/shapes/RightAngledTwoSidedArrow";
import RoundedArrowDownRight from "../assets/shapes/RoundedArrowDownRight";
import RoundedArrowDownLeft from "../assets/shapes/RoundedArrowDownLeft";
import TailCutArrow from "../assets/shapes/TailCutArrow";
import RoundedSquare2 from "../assets/shapes/RoundedSquare2";
import RoundedBubble from "../assets/shapes/RoundedBubble";
import SquareBubble from "../assets/shapes/SquareBubble";
import RoundedSquareBubble from "../assets/shapes/RoundedSquareBubble";

const Shapes = ({ canvas }) => {
  // Add a rectangle shape
  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 100,
        width: 100,
        height: 100,
        fill: "#af4511",
      });
      canvas.add(rect);
    }
  };

  // Add a triangle shape
  const addTriangle = () => {
    if (canvas) {
      const triangle = new FabricTriangle({
        top: 100,
        left: 100,
        width: 100,
        height: 100,
        fill: "#af6591",
      });
      canvas.add(triangle);
    }
  };

  // Add a circle shape
  const addCircle = () => {
    if (canvas) {
      const circle = new FabricCircle({
        top: 100,
        left: 100,
        radius: 50,
        fill: "#765498",
      });
      canvas.add(circle);
    }
  };

  // Add a hexagon shape
  const addRhombus = () => {
    if (canvas) {
      const hexagon = new Polygon(
        [
          { x: 0, y: 50 },
          { x: 43, y: 0 },
          { x: 86, y: 50 },
          { x: 43, y: 100 },
          { x: 0, y: 50 },
        ],
        {
          top: 100,
          left: 100,
          fill: "#67b7a1",
        }
      );
      canvas.add(hexagon);
    }
  };

  // Add a rectangle shape using a different approach
  const addAltRectangle = () => {
    if (canvas) {
      const altRect = new Rect({
        top: 150,
        left: 150,
        width: 120,
        height: 80,
        fill: "#3498db",
      });
      canvas.add(altRect);
    }
  };

  // Add an ellipse shape
  const addEllipse = () => {
    if (canvas) {
      const ellipse = new Ellipse({
        top: 100,
        left: 100,
        rx: 70,
        ry: 40,
        fill: "#9b59b6",
      });
      canvas.add(ellipse);
    }
  };

  // Add a shield shape
  const addShield = () => {
    if (canvas) {
      const shield = new Polygon(
        [
          { x: 50, y: 0 },
          { x: 100, y: 40 },
          { x: 75, y: 100 },
          { x: 25, y: 100 },
          { x: 0, y: 40 },
        ],
        {
          top: 100,
          left: 100,
          fill: "#1abc9c",
        }
      );
      canvas.add(shield);
    }
  };

  // Add a curved square shape
  const addCurvedSquare = () => {
    if (canvas) {
      const curvedSquare = new Rect({
        top: 100,
        left: 100,
        width: 100,
        height: 100,
        fill: "#e74c3c",
        rx: 20, // Horizontal corner radius
        ry: 20, // Vertical corner radius
      });
      canvas.add(curvedSquare);
    }
  };
  // Add a curved square shape
  const addRoundedSquare2 = () => {
    if (canvas) {
      const path = new Path(
        "M1537.06 822.5 2643.94 822.5C2788.95 822.5 2906.5 981.439 2906.5 1177.5 2906.5 1373.56 2788.95 1532.5 2643.94 1532.5L1537.06 1532.5C1392.05 1532.5 1274.5 1373.56 1274.5 1177.5 1274.5 981.439 1392.05 822.5 1537.06 822.5Z",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.2, // Scale down the shape
          scaleY: 0.2, // Scale down the shape
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  // Add a double arrow shape
  const addDoubleArrow = () => {
    if (canvas) {
      const doubleArrow = new Polygon(
        [
          { x: 0, y: 40 },
          { x: 40, y: 0 },
          { x: 40, y: 25 },
          { x: 120, y: 25 },
          { x: 120, y: 0 },
          { x: 160, y: 40 },
          { x: 120, y: 80 },
          { x: 120, y: 55 },
          { x: 40, y: 55 },
          { x: 40, y: 80 },
          { x: 0, y: 40 },
        ],
        {
          top: 100,
          left: 100,
          fill: "#3498db",
        }
      );
      doubleArrow.customType = "shape";
      canvas.add(doubleArrow);
    }
  };

  const addCurvedArrow = () => {
    if (canvas) {
      const path = new fabric.Path(
        "M 20,90 Q 20,20 80,20 L 100,20 L 100,10 L 130,50 L 100,90 L 100,80 L 80,80 Q 40,80 40,90 Z",
        {
          fill: "#3498db",
          top: 0,
          left: 0,
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const addFourSidedArrow = () => {
    if (canvas) {
      const path = new Path(
        "M1299.5 1254 1550.82 1002.68 1550.82 1128.34 1747.84 1128.34 1747.84 946.825 1622.18 946.825 1873.5 695.5 2124.82 946.825 1999.16 946.825 1999.16 1128.34 2196.18 1128.34 2196.18 1002.68 2447.5 1254 2196.18 1505.32 2196.18 1379.66 1999.16 1379.66 1999.16 1561.18 2124.82 1561.18 1873.5 1812.5 1622.18 1561.18 1747.84 1561.18 1747.84 1379.66 1550.82 1379.66 1550.82 1505.32Z",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.1, // Scale down the shape
          scaleY: 0.1, // Scale down the shape
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const addThreeSidedArrow = () => {
    if (canvas) {
      const path = new Path(
        "M1210.5 1148 1335 1023.5 1335 1085.75 1483.25 1085.75 1483.25 899 1421 899 1545.5 774.5 1670 899 1607.75 899 1607.75 1085.75 1756 1085.75 1756 1023.5 1880.5 1148 1756 1272.5 1756 1210.25 1335 1210.25 1335 1272.5Z",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.2, // Scale down the shape
          scaleY: 0.2, // Scale down the shape
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const addUTurnArrow = () => {
    if (canvas) {
      const path = new Path(
        "M1225.5 1833.5 1225.5 1397.13C1225.5 1210.11 1377.11 1058.5 1564.13 1058.5L1564.13 1058.5C1751.14 1058.5 1902.75 1210.11 1902.75 1397.13L1902.75 1446.25 1999.5 1446.25 1806 1639.75 1612.5 1446.25 1709.25 1446.25 1709.25 1397.13C1709.25 1316.97 1644.28 1252 1564.13 1252L1564.13 1252C1483.97 1252 1419 1316.97 1419 1397.13L1419 1833.5Z",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.2, // Scale down the shape
          scaleY: 0.2, // Scale down the shape
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const addFourSidedSquareArrow = () => {
    if (canvas) {
      const path = new Path(
        "M1351.5 1389 1499.06 1241.44 1499.06 1315.22 1567.83 1315.22 1567.83 1197.23 1694.72 1197.23 1694.72 1138.06 1620.94 1138.06 1768.5 990.5 1916.06 1138.06 1842.28 1138.06 1842.28 1197.23 1969.17 1197.23 1969.17 1315.22 2037.94 1315.22 2037.94 1241.44 2185.5 1389 2037.94 1536.56 2037.94 1462.78 1969.17 1462.78 1969.17 1580.77 1842.28 1580.77 1842.28 1639.94 1916.06 1639.94 1768.5 1787.5 1620.94 1639.94 1694.72 1639.94 1694.72 1580.77 1567.83 1580.77 1567.83 1462.78 1499.06 1462.78 1499.06 1536.56Z",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.2, // Scale down the shape
          scaleY: 0.2, // Scale down the shape,
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const addRightAngledTwoSidedArrow = () => {
    if (canvas) {
      const path = new Path(
        "M1268.5 969.25 1399.75 838 1399.75 903.625 1598.63 903.625 1598.63 706.75 1533 706.75 1664.25 575.5 1795.5 706.75 1729.88 706.75 1729.88 1034.87 1399.75 1034.87 1399.75 1100.5Z",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.2, // Scale down the shape
          scaleY: 0.2, // Scale down the shape
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const addRoundedArrowDownRight = () => {
    if (canvas) {
      const path = new Path(
        "M1366.5 1011.69C1366.5 1154.04 1563.62 1278.37 1845.75 1313.96L1845.75 1234.09 2005.5 1403.75 1845.75 1553.59 1845.75 1473.71C1563.62 1438.12 1366.5 1313.79 1366.5 1171.44Z M2005.5 859.25C1715.56 859.25 1461.95 954.624 1387.77 1091.56 1297.47 924.885 1500.84 754.005 1842.01 709.892 1895.36 702.993 1950.31 699.5 2005.5 699.5Z M1366.5 1011.69C1366.5 1154.04 1563.62 1278.37 1845.75 1313.96L1845.75 1234.09 2005.5 1403.75 1845.75 1553.59 1845.75 1473.71C1563.62 1438.12 1366.5 1313.79 1366.5 1171.44L1366.5 1011.69C1366.5 839.271 1652.59 699.5 2005.5 699.5L2005.5 859.25C1715.56 859.25 1461.95 954.624 1387.77 1091.56",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.2, // Scale down the shape
          scaleY: 0.2, // Scale down the shape
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const addRoundedArrowDownLeft = () => {
    if (canvas) {
      const path = new Path(
        "M1484.5 1446.75 1613.25 1307.33 1613.25 1371.71C1805.39 1339.35 1951.93 1237.86 1989.96 1110.81 2042.17 1285.25 1877.06 1456.03 1613.25 1500.46L1613.25 1564.83Z M1999.5 1175.19C1999.5 989.655 1768.93 839.25 1484.5 839.25L1484.5 710.5C1768.93 710.5 1999.5 860.904 1999.5 1046.44Z M1999.5 1175.19C1999.5 989.655 1768.93 839.25 1484.5 839.25L1484.5 710.5C1768.93 710.5 1999.5 860.904 1999.5 1046.44L1999.5 1175.19C1999.5 1328.37 1840.63 1462.16 1613.25 1500.46L1613.25 1564.83 1484.5 1446.75 1613.25 1307.33 1613.25 1371.71C1805.39 1339.35 1951.93 1237.86 1989.96 1110.81",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.2, // Scale down the shape
          scaleY: 0.2, // Scale down the shape
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const addTailCutArrow = () => {
    if (canvas) {
      const path = new Path(
        "M1509.5 968.5 1880.5 968.5 1880.5 886.5 2044.5 1050.5 1880.5 1214.5 1880.5 1132.5 1509.5 1132.5 1591.5 1050.5Z",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.2, // Scale down the shape
          scaleY: 0.2, // Scale down the shape
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const addRoundedBubble = () => {
    if (canvas) {
      const path = new Path(
        "M1619.92 1460.62 1579.62 1339.13C1320.36 1252.14 1228.79 1056.65 1375.08 902.496 1521.37 748.337 1850.13 693.884 2109.38 780.871 2368.64 867.857 2460.21 1063.34 2313.92 1217.5 2205.95 1331.29 1992.63 1394.71 1774.76 1377.81Z",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.2, // Scale down the shape
          scaleY: 0.2, // Scale down the shape
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const addSquareBubble = () => {
    if (canvas) {
      const path = new Path(
        "M1075.5 577.5 1244.33 577.5 1244.33 577.5 1497.58 577.5 2088.5 577.5 2088.5 997.5 2088.5 997.5 2088.5 1177.5 2088.5 1297.5 1497.58 1297.5 1370.96 1387.5 1244.33 1297.5 1075.5 1297.5 1075.5 1177.5 1075.5 997.5 1075.5 997.5Z",
        {
          fill: "#3498db",
          top: 100,
          left: 100,
          scaleX: 0.2, // Scale down the shape
          scaleY: 0.2, // Scale down the shape
        }
      );
      path.customType = "shape";
      canvas.add(path);
    }
  };

  const shapeOptions = [
    {
      label: "Rectangle",
      icon: <Square fontSize="small" />,
      action: addRectangle,
    },
    { label: "Circle", icon: <Circle fontSize="small" />, action: addCircle },
    {
      label: "Triangle",
      icon: <PlayArrow fontSize="small" className="-rotate-90" />,
      action: addTriangle,
    },
    {
      label: "Rhombus",
      icon: <Square fontSize="small" className="rotate-45" />,
      action: addRhombus,
    },
    {
      label: "Alt Rectangle",
      icon: <Rectangle fontSize="small" />,
      action: addAltRectangle,
    },
    {
      label: "Ellipse",
      icon: <CircleRounded fontSize="small" />,
      action: addEllipse,
    },
    {
      label: "Shield",
      icon: <PentagonRounded fontSize="small" />,
      action: addShield,
    },
    {
      label: "Curved Square",
      icon: (
        <div className="w-4 h-4 bg-white" style={{ borderRadius: "20%" }}></div>
      ),
      action: addCurvedSquare,
    },
    {
      label: "Rounded Square 2",
      icon: <RoundedSquare2 />,
      action: addRoundedSquare2,
    },
    { label: "Double Arrow", icon: <DoubleArrow />, action: addDoubleArrow },
    { label: "Curved Arrow", icon: <CurvedArrow />, action: addCurvedArrow },
    {
      label: "Four Sided Arrow",
      icon: <FourSidedArrow />,
      action: addFourSidedArrow,
    },
    {
      label: "Three Sided Arrow",
      icon: <ThreeSidedArrow />,
      action: addThreeSidedArrow,
    },
    { label: "U Turn Arrow", icon: <UTurnArrow />, action: addUTurnArrow },
    {
      label: "Four Sided Square Arrow",
      icon: <FourSidedSquareArrow />,
      action: addFourSidedSquareArrow,
    },
    {
      label: "Right Angled Two Sided Arrow",
      icon: <RightAngledTwoSidedArrow />,
      action: addRightAngledTwoSidedArrow,
    },
    {
      label: "Rounded Arrow Down Right",
      icon: <RoundedArrowDownRight />,
      action: addRoundedArrowDownRight,
    },
    {
      label: "Rounded Arrow Down Left",
      icon: <RoundedArrowDownLeft />,
      action: addRoundedArrowDownLeft,
    },
    {
      label: "Tail Cut Arrow",
      icon: <TailCutArrow />,
      action: addTailCutArrow,
    },
    {
      label: "Rounded Bubble",
      icon: <RoundedBubble />,
      action: addRoundedBubble,
    },
    {
      label: "Square Bubble",
      icon: <SquareBubble />,
      action: addSquareBubble,
    },
    {
      label: "Rounded Square Bubble",
      icon: <RoundedSquareBubble />,
      action: addSquareBubble,
    },
  ];

  return (
    <div className="flex flex-wrap space-x-2 text-xs w-[200px]">
      <div className="flex flex-wrap space-x-2">
        {shapeOptions.map((option, index) => (
          <button
            key={index}
            className={`px-2 py-1 bg-green-700 text-white rounded-2xl border border-white m-1
            }`}
            onClick={() => {
              option.action();
              setSelectedShape(option.label);
            }}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Shapes;
