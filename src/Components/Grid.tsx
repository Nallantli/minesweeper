import React, { useState } from "react";
import Row from "./Row";
import { SquareType } from "../Types";

interface GridProps {
  gameOver: boolean;
  gameEnd: (gameWon: boolean) => void;
}

let checkedAlreadyList: number[] = [];

function Grid({ gameOver, gameEnd }: GridProps) {
  function getInitGrid(size: number) {
    let initialSquareList: SquareType[][] = [];
    for (let i = 0; i < size; i++) {
      let tempRow: SquareType[] = [];
      for (let j = 0; j < size; j++) {
        tempRow.push({
          id: i * size + j + 1,
          xPos: i,
          yPos: j,
          adjacentBombs: 0,
          flipped: false,
          flagged: false,
          bomb: false,
          hovered: false,
        });
      }
      initialSquareList.push(tempRow);
    }
    for (let i = 0; i < 40; i++) {
      let randX = Math.floor(Math.random() * size);
      let randY = Math.floor(Math.random() * size);
      while (initialSquareList[randX][randY].bomb === true) {
        randX = Math.floor(Math.random() * size);
        randY = Math.floor(Math.random() * size);
      }
      initialSquareList[randX][randY].bomb = true;
    }
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        for (let k = -1; k <= 1; k++) {
          if (
            i - 1 >= 0 &&
            j + k >= 0 &&
            j + k <= size - 1 &&
            initialSquareList[i - 1][j + k].bomb === true
          )
            initialSquareList[i][j].adjacentBombs++;
        }
        for (let k = -1; k <= 1; k++) {
          if (
            k !== 0 &&
            j + k >= 0 &&
            j + k <= size - 1 &&
            initialSquareList[i][j + k].bomb === true
          )
            initialSquareList[i][j].adjacentBombs++;
        }
        for (let k = -1; k <= 1; k++) {
          if (
            i + 1 <= size - 1 &&
            j + k >= 0 &&
            j + k <= size - 1 &&
            initialSquareList[i + 1][j + k].bomb === true
          )
            initialSquareList[i][j].adjacentBombs++;
        }
      }
    }
    return initialSquareList;
  }

  function flipAdjacentSquares(id: number) {
    let tempList = [...squareList];
    const size = tempList.length;
    for (let i = 0; i < squareList.length; i++)
      for (let j = 0; j < squareList.length; j++)
        if (
          tempList[i][j].id === id &&
          tempList[i][j].bomb === false &&
          !checkedAlreadyList.includes(id)
        ) {
          tempList[i][j].flipped = true;
          setSquareList(tempList);
          if (tempList[i][j].adjacentBombs === 0) {
            for (let k = -1; k <= 1; k++) {
              if (i - 1 >= 0 && j + k >= 0 && j + k <= size - 1) {
                checkedAlreadyList.push(id);
                flipAdjacentSquares(tempList[i - 1][j + k].id);
              }
            }
            for (let k = -1; k <= 1; k++) {
              if (k !== 0 && j + k >= 0 && j + k <= size - 1) {
                checkedAlreadyList.push(id);
                flipAdjacentSquares(tempList[i][j + k].id);
              }
            }
            for (let k = -1; k <= 1; k++) {
              if (i + 1 <= size - 1 && j + k >= 0 && j + k <= size - 1) {
                checkedAlreadyList.push(id);
                flipAdjacentSquares(tempList[i + 1][j + k].id);
              }
            }
          }
        }
  }

  function gridLeftClickUpdate(id: number) {
    if (!gameOver) {
      let tempList = [...squareList];
      for (let i = 0; i < squareList.length; i++)
        for (let j = 0; j < squareList.length; j++)
          if (tempList[i][j].id === id) {
            tempList[i][j].flipped = true;
            if (tempList[i][j].bomb) gameEnd(false);
          }
      setSquareList(tempList);
      flipAdjacentSquares(id);
      if (getEmptySquareCount() === 0) gameEnd(true);
    }
  }

  function gridRightClickUpdate(id: number) {
    if (!gameOver) {
      let tempList = [...squareList];
      for (let i = 0; i < squareList.length; i++)
        for (let j = 0; j < squareList.length; j++)
          if (tempList[i][j].id === id)
            tempList[i][j].flagged = !tempList[i][j].flagged;
      setSquareList(tempList);
    }
  }

  function hoverUpdate(id: number) {
    let tempList = [...squareList];
    for (let i = 0; i < squareList.length; i++)
      for (let j = 0; j < squareList.length; j++)
        if (tempList[i][j].id === id)
          tempList[i][j].hovered = !tempList[i][j].hovered;
    setSquareList(tempList);
  }

  function getEmptySquareCount() {
    let count = 0;
    for (let i = 0; i < squareList.length; i++)
      for (let j = 0; j < squareList.length; j++)
        if (!squareList[i][j].bomb && !squareList[i][j].flipped) count++;
    return count;
  }

  const [squareList, setSquareList] = useState(() => getInitGrid(16));
  return (
    <div className="Grid">
      {squareList.map((row, index) => (
        <Row
          key={index}
          row={row}
          leftClick={gridLeftClickUpdate}
          rightClick={gridRightClickUpdate}
          hover={hoverUpdate}
        />
      ))}
      <br></br>
    </div>
  );
}

export default Grid;
