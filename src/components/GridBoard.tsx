// import React, { useEffect, useRef, useState } from "react";
// import {
//   AlgorithmOption,
//   CellInterface,
//   SearchingAlgoEnum,
// } from "../interfaces";
// import { getCellObjects, getPath } from "../utils/helpers";
// import Cell from "./Cell";
// import StatsSection from "./StatsSection";
// import {
//   MagnifyingGlassIcon,
//   PaperAirplaneIcon,
//   ClockIcon,
//   ArrowRightIcon,
//   RectangleGroupIcon,
//   CalendarIcon,
//   MapPinIcon,
//   ForwardIcon,
//   CubeTransparentIcon,
// } from "@heroicons/react/24/outline";

// import AlgoSelect from "./AlgoSelect";
// import {
//   dijkstra,
//   DFS,
//   BFS,
//   generateRandomMaze,
//   generateRecursiveMaze,
// } from "../app/index";

// const GridBoard = () => {
//   const gridBoardCells = useRef(getCellObjects());

//   const [startPoint, setStartPoint] = useState<CellInterface | null>(null);
//   const [endPoint, setEndPoint] = useState<CellInterface | null>(null);
//   const [foundPath, setFoundPath] = useState<CellInterface[] | null>(null);

//   const [cellsScanned, setCellsScanned] = useState(0);
//   const [cellsTraveled, setCellsTraveled] = useState(0);
//   const [timeTaken, setTimeTaken] = useState(0);

//   const [isMouseDown, setIsMouseDown] = useState(false);
//   const [renderFlag, setRenderFlag] = useState(false);

//   const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmOption | null>(
//     null
//   );

//   const [showInfoOf, setShowInfoOf] = useState<SearchingAlgoEnum | null>(null);

//   const [speed, setSpeed] = useState<"slow" | "medium" | "fast">("medium");

//   const getSpeedMultiplier = () => {
//     switch (speed) {
//       case "fast":
//         return {
//           algorithm: 3,
//           path: 15,
//         };
//       case "medium":
//         return {
//           algorithm: 10,
//           path: 20,
//         };
//       case "slow":
//         return {
//           algorithm: 100,
//           path: 125,
//         };
//     }
//   };

//   const resetBoardData = () => {
//     document.querySelectorAll(`.cell`).forEach((item) => {
//       if (item.classList.contains("cell-visited")) {
//         item.classList.remove("cell-visited");
//       }
//       if (item.classList.contains("cell-path")) {
//         item.classList.remove("cell-path");
//       }
//     });
//     setFoundPath(null);
//     setCellsScanned(0);
//     setCellsTraveled(0);
//     setTimeTaken(0);
//   };

//   const clearBoard = () => {
//     gridBoardCells.current = getCellObjects(true, true, gridBoardCells.current);
//     resetBoardData();
//   };

//   const clearPath = () => {
//     gridBoardCells.current = getCellObjects(
//       true,
//       false,
//       gridBoardCells.current
//     ); // only reset path and ignore walls
//     resetBoardData();
//   };

//   const onMouseEnter = (rowIndex: number, colIndex: number) => {
//     setRenderFlag(!renderFlag);
//     let element = gridBoardCells.current[rowIndex];
//     if (!isMouseDown) return;
//     if (element[colIndex].isStartPoint || element[colIndex].isEndPoint) return;

//     element[colIndex].isWall = !element[colIndex].isWall;
//   };

//   const onCellClick = (
//     cell: CellInterface,
//     rowIndex: number,
//     colIndex: number
//   ) => {
//     let clickedCell = gridBoardCells.current[rowIndex][colIndex];
//     if (clickedCell.isWall) {
//       clickedCell.isWall = false;
//       return;
//     }
//     if (cell.cellNumber === startPoint?.cellNumber) {
//       setStartPoint(null);
//       clickedCell.isStartPoint = false;
//       clickedCell.distanceFromStart = Infinity;
//       return;
//     }
//     if (cell.cellNumber === endPoint?.cellNumber) {
//       setEndPoint(null);
//       clickedCell.isEndPoint = false;
//       return;
//     }

//     if (startPoint && endPoint) {
//       clickedCell.isWall = true;
//       return;
//     }
//     if (!startPoint) {
//       setStartPoint({
//         ...clickedCell,
//         isStartPoint: true,
//         distanceFromStart: 0,
//       });
//       clickedCell.isStartPoint = true;
//       clickedCell.distanceFromStart = 0;
//     } else if (startPoint) {
//       setEndPoint({
//         ...clickedCell,
//         isEndPoint: true,
//       });
//       clickedCell.isEndPoint = true;
//     }
//   };

//   const animateAlgo = (
//     visitedCells: CellInterface[],
//     path: CellInterface[]
//   ) => {
//     for (let i = 0; i < visitedCells.length; i++) {
//       setTimeout(() => {
//         const cell = visitedCells[i];
//         let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
//         item!.className += " cell-visited";
//         if (cell.isTarget) {
//           setFoundPath(path);
//         }
//       }, (getSpeedMultiplier().algorithm || 10) * i);
//     }
//   };

//   const animatePath = (path: CellInterface[]) => {
//     for (let i = 0; i < path.length; i++) {
//       setTimeout(() => {
//         const cell = path[i];
//         setCellsTraveled(i + 1);
//         let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
//         item!.className += " cell-path";
//       }, (getSpeedMultiplier().path || 25) * i);
//     }
//   };

//   const visualizeAlgo = (type: SearchingAlgoEnum) => {
//     if (!startPoint || !endPoint) {
//       alert("Please mark starting and ending point");
//       return;
//     }
//     let grid = gridBoardCells.current;
//     let start = grid[startPoint.row][startPoint.col];
//     let end = grid[endPoint.row][endPoint.col];
//     let visitedCells: CellInterface[] = [];
//     switch (type) {
//       case SearchingAlgoEnum.DIJKSTRA:
//         let [dCells, DTime] = dijkstra(grid, start, end) || [];
//         visitedCells = dCells || [];
//         setTimeTaken(DTime || 0);
//         break;
//       case SearchingAlgoEnum.DFS:
//         let [DFSCells, DFSTime] = DFS(grid, start, end) || [];
//         visitedCells = DFSCells || [];
//         setTimeTaken(DFSTime || 0);
//         break;
//       case SearchingAlgoEnum.BFS:
//         let [BFSCells, BFSTime] = BFS(grid, start, end) || [];
//         visitedCells = BFSCells || [];
//         setTimeTaken(BFSTime || 0);
//         break;
//     }
//     const path = getPath(end);
//     setCellsScanned(visitedCells.length);
//     animateAlgo(visitedCells, path);
//   };

//   useEffect(() => {
//     if (foundPath && startPoint && endPoint) {
//       animatePath(foundPath);
//     }
//   }, [foundPath]);

//   return (
//     <>
      
//       <div className="bg-gray-900 pt-4">
//         <div className="mx-auto flex max-w-7xl md:flex-row flex-col items-center justify-between">
//           <div className="flex flex-1 flex-wrap md:flex-row flex-col gap-4 items-start md:items-center w-full justify-start space-x-4 mx-4">
//             <AlgoSelect
//               selectedAlgo={selectedAlgo}
//               onSelect={setSelectedAlgo}
//             />
//             <button
//               disabled={!selectedAlgo}
//               onClick={() =>
//                 selectedAlgo ? visualizeAlgo(selectedAlgo?.type) : null
//               }
//               className="items-center w-fit disabled:bg-indigo-400 disabled:cursor-not-allowed inline-flex bg-indigo-600 text-[15px] text-white px-4 py-2 rounded-md"
//             >
//               <RectangleGroupIcon className="h-5 w-5 mr-2" />{" "}
//               {selectedAlgo
//                 ? `Visualize ${selectedAlgo?.name}`
//                 : "Select an algorithm"}
//             </button>
//             <button
//               onClick={() => {
//                 clearBoard();
//                 setRenderFlag(!renderFlag);
//               }}
//               className="items-center w-fit disabled:bg-green-500 disabled:cursor-not-allowed inline-flex bg-green-600 text-[15px] text-white px-4 py-2 rounded-md"
//             >
//               <CalendarIcon className="h-5 w-5 mr-2" /> Clear board
//             </button>

//             <button
//               onClick={() => {
//                 clearPath();
//               }}
//               className="items-center w-fit disabled:bg-green-500 disabled:cursor-not-allowed inline-flex bg-green-600 text-[15px] text-white px-4 py-2 rounded-md"
//             >
//               <MapPinIcon className="h-5 w-5 mr-2" /> Clear path
//             </button>

//             <button
//               onClick={() => {
//                 setSpeed(
//                   speed === "fast"
//                     ? "medium"
//                     : speed === "medium"
//                     ? "slow"
//                     : "fast"
//                 );
//               }}
//               className="items-center w-fit disabled:bg-red-400 disabled:cursor-not-allowed inline-flex bg-red-500 text-[15px] text-white px-4 py-2 rounded-md"
//             >
//               <ForwardIcon className="h-5 w-5 mr-2" /> Speed: {speed}
//             </button>
//           </div>
//         </div>
//       </div>
   
//       <div className="w-full bg-gray-900 ">
//         <div className="flex gap-6 justify-center max-w-7xl mx-auto items-center">
//           <StatsSection
//             stats={[
//               {
//                 name: "Cells scanned",
//                 icon: MagnifyingGlassIcon,
//                 data: cellsScanned.toString(),
//               },
//               {
//                 name: "Cells traveled",
//                 icon: PaperAirplaneIcon,
//                 data: cellsTraveled.toString(),
//               },
//               {
//                 name: "Time taken",
//                 icon: ClockIcon,
//                 data: `${timeTaken?.toFixed(2)}ms`,
//               },
//             ]}
//           />
//         </div>
//       </div>
    
//       <div className="grid grid-cols-gridmap overflow-auto w-full px-4 justify-start md:justify-center items-center my-3">
//         {gridBoardCells.current.map((row, rowIndex) => {
//           return (
//             <React.Fragment key={rowIndex}>
//               {row.map((cell, colIndex) => {
//                 return (
//                   <Cell
//                     key={colIndex}
//                     id={`cell-${cell.row}-${cell.col}`}
//                     onMouseDown={() => {
//                       setIsMouseDown(true);
//                     }}
//                     onMouseEnter={() => {
//                       onMouseEnter(rowIndex, colIndex);
//                     }}
//                     onMouseUp={() => {
//                       setIsMouseDown(false);
//                     }}
//                     onClick={() => {
//                       onCellClick(cell, rowIndex, colIndex);
//                     }}
//                     {...cell}
//                   />
//                 );
//               })}
//             </React.Fragment>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// export default GridBoard;


import React, { useEffect, useRef, useState } from "react";
import {
  AlgorithmOption,
  CellInterface,
  SearchingAlgoEnum,
} from "../interfaces";
import { getCellObjects, getPath } from "../utils/helpers";
import Cell from "./Cell";
import StatsSection from "./StatsSection";
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';
import SpeedIcon from '@mui/icons-material/Speed';
import DashboardIcon from '@mui/icons-material/Dashboard';

import AlgoSelect from "./AlgoSelect";
import {
  dijkstra,
  DFS,
  BFS,
  generateRandomMaze,
  generateRecursiveMaze,
} from "../app/index";

const GridBoard = () => {
  const gridBoardCells = useRef(getCellObjects());

  const [startPoint, setStartPoint] = useState<CellInterface | null>(null);
  const [endPoint, setEndPoint] = useState<CellInterface | null>(null);
  const [foundPath, setFoundPath] = useState<CellInterface[] | null>(null);

  const [cellsScanned, setCellsScanned] = useState(0);
  const [cellsTraveled, setCellsTraveled] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [renderFlag, setRenderFlag] = useState(false);

  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmOption | null>(
    null
  );

  const [showInfoOf, setShowInfoOf] = useState<SearchingAlgoEnum | null>(null);

  const [speed, setSpeed] = useState<"slow" | "medium" | "fast">("medium");

  const getSpeedMultiplier = () => {
    switch (speed) {
      case "fast":
        return {
          algorithm: 3,
          path: 15,
        };
      case "medium":
        return {
          algorithm: 10,
          path: 20,
        };
      case "slow":
        return {
          algorithm: 100,
          path: 125,
        };
    }
  };

  const resetBoardData = () => {
    document.querySelectorAll(`.cell`).forEach((item) => {
      if (item.classList.contains("cell-visited")) {
        item.classList.remove("cell-visited");
      }
      if (item.classList.contains("cell-path")) {
        item.classList.remove("cell-path");
      }
    });
    setFoundPath(null);
    setCellsScanned(0);
    setCellsTraveled(0);
    setTimeTaken(0);
  };

  const clearBoard = () => {
    gridBoardCells.current = getCellObjects(true, true, gridBoardCells.current);
    resetBoardData();
  };

  const clearPath = () => {
    gridBoardCells.current = getCellObjects(
      true,
      false,
      gridBoardCells.current
    ); // only reset path and ignore walls
    resetBoardData();
  };

  const onMouseEnter = (rowIndex: number, colIndex: number) => {
    setRenderFlag(!renderFlag);
    let element = gridBoardCells.current[rowIndex];
    if (!isMouseDown) return;
    if (element[colIndex].isStartPoint || element[colIndex].isEndPoint) return;

    element[colIndex].isWall = !element[colIndex].isWall;
  };

  const onCellClick = (
    cell: CellInterface,
    rowIndex: number,
    colIndex: number
  ) => {
    let clickedCell = gridBoardCells.current[rowIndex][colIndex];
    if (clickedCell.isWall) {
      clickedCell.isWall = false;
      return;
    }
    if (cell.cellNumber === startPoint?.cellNumber) {
      setStartPoint(null);
      clickedCell.isStartPoint = false;
      clickedCell.distanceFromStart = Infinity;
      return;
    }
    if (cell.cellNumber === endPoint?.cellNumber) {
      setEndPoint(null);
      clickedCell.isEndPoint = false;
      return;
    }

    if (startPoint && endPoint) {
      clickedCell.isWall = true;
      return;
    }
    if (!startPoint) {
      setStartPoint({
        ...clickedCell,
        isStartPoint: true,
        distanceFromStart: 0,
      });
      clickedCell.isStartPoint = true;
      clickedCell.distanceFromStart = 0;
    } else if (startPoint) {
      setEndPoint({
        ...clickedCell,
        isEndPoint: true,
      });
      clickedCell.isEndPoint = true;
    }
  };

  const animateAlgo = (
    visitedCells: CellInterface[],
    path: CellInterface[]
  ) => {
    for (let i = 0; i < visitedCells.length; i++) {
      setTimeout(() => {
        const cell = visitedCells[i];
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item!.className += " cell-visited";
        if (cell.isTarget) {
          setFoundPath(path);
        }
      }, (getSpeedMultiplier().algorithm || 10) * i);
    }
  };

  const animatePath = (path: CellInterface[]) => {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const cell = path[i];
        setCellsTraveled(i + 1);
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item!.className += " cell-path";
      }, (getSpeedMultiplier().path || 25) * i);
    }
  };

  const visualizeAlgo = (type: SearchingAlgoEnum) => {
    if (!startPoint || !endPoint) {
      alert("Please mark starting and ending point");
      return;
    }
    let grid = gridBoardCells.current;
    let start = grid[startPoint.row][startPoint.col];
    let end = grid[endPoint.row][endPoint.col];
    let visitedCells: CellInterface[] = [];
    switch (type) {
      case SearchingAlgoEnum.DIJKSTRA:
        let [dCells, DTime] = dijkstra(grid, start, end) || [];
        visitedCells = dCells || [];
        setTimeTaken(DTime || 0);
        break;
      case SearchingAlgoEnum.DFS:
        let [DFSCells, DFSTime] = DFS(grid, start, end) || [];
        visitedCells = DFSCells || [];
        setTimeTaken(DFSTime || 0);
        break;
      case SearchingAlgoEnum.BFS:
        let [BFSCells, BFSTime] = BFS(grid, start, end) || [];
        visitedCells = BFSCells || [];
        setTimeTaken(BFSTime || 0);
        break;
    }
    const path = getPath(end);
    setCellsScanned(visitedCells.length);
    animateAlgo(visitedCells, path);
  };

  useEffect(() => {
    if (foundPath && startPoint && endPoint) {
      animatePath(foundPath);
    }
  }, [foundPath]);

  return (
    <>
      <div className="bg-gray-900 pt-4">
        <div className="mx-auto flex max-w-7xl md:flex-row flex-col items-center justify-between">
          <div className="flex flex-1 flex-wrap md:flex-row flex-col gap-4 items-start md:items-center w-full justify-start space-x-4 mx-4">
            <AlgoSelect
              selectedAlgo={selectedAlgo}
              onSelect={setSelectedAlgo}
            />
            <button
              disabled={!selectedAlgo}
              onClick={() =>
                selectedAlgo ? visualizeAlgo(selectedAlgo?.type) : null
              }
              className="items-center w-fit disabled:bg-indigo-400 disabled:cursor-not-allowed inline-flex bg-indigo-600 text-[15px] text-white px-4 py-2 rounded-md"
            >
              <DashboardIcon className="h-5 w-5 mr-2" />{" "}
              {selectedAlgo
                ? `Visualize ${selectedAlgo?.name}`
                : "Select an algorithm"}
            </button>
            <button
              onClick={() => {
                clearBoard();
                setRenderFlag(!renderFlag);
              }}
              className="items-center w-fit disabled:bg-green-500 disabled:cursor-not-allowed inline-flex bg-green-600 text-[15px] text-white px-4 py-2 rounded-md"
            >
              <CalendarTodayIcon className="h-5 w-5 mr-2" /> Clear board
            </button>

            <button
              onClick={() => {
                clearPath();
              }}
              className="items-center w-fit disabled:bg-green-500 disabled:cursor-not-allowed inline-flex bg-green-600 text-[15px] text-white px-4 py-2 rounded-md"
            >
              <PlaceIcon className="h-5 w-5 mr-2" /> Clear path
            </button>

            <button
              onClick={() => {
                setSpeed(
                  speed === "fast"
                    ? "medium"
                    : speed === "medium"
                    ? "slow"
                    : "fast"
                );
              }}
              className="items-center w-fit disabled:bg-red-400 disabled:cursor-not-allowed inline-flex bg-red-500 text-[15px] text-white px-4 py-2 rounded-md"
            >
              <SpeedIcon className="h-5 w-5 mr-2" /> Speed: {speed}
            </button>
          </div>
        </div>
      </div>
   
      <div className="w-full bg-gray-900 ">
        <div className="flex gap-6 justify-center max-w-7xl mx-auto items-center">
          <StatsSection
            stats={[
              {
                name: "Cells scanned",
                icon: SearchIcon,
                data: cellsScanned.toString(),
              },
              {
                name: "Cells traveled",
                icon: SendIcon,
                data: cellsTraveled.toString(),
              },
              {
                name: "Time taken",
                icon: AccessTimeIcon,
                data: `${timeTaken?.toFixed(2)}ms`,
              },
            ]}
          />
        </div>
      </div>
    
      <div className="grid grid-cols-gridmap overflow-auto w-full px-4 justify-start md:justify-center items-center my-3">
        {gridBoardCells.current.map((row, rowIndex) => {
          return (
            <React.Fragment key={rowIndex}>
              {row.map((cell, colIndex) => {
                return (
                  <Cell
                    key={colIndex}
                    id={`cell-${cell.row}-${cell.col}`}
                    onMouseDown={() => {
                      setIsMouseDown(true);
                    }}
                    onMouseEnter={() => {
                      onMouseEnter(rowIndex, colIndex);
                    }}
                    onMouseUp={() => {
                      setIsMouseDown(false);
                    }}
                    onClick={() => {
                      onCellClick(cell, rowIndex, colIndex);
                    }}
                    {...cell}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default GridBoard;
