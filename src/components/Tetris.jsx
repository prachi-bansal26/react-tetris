import React, { useEffect, useState, useRef } from 'react';
import _, { debounce } from "lodash";
import Keycode from 'keycode';
import { getBlock, getRandomBlock, blockColor } from '../utils';

import '../styles/Tetris.css';

// Cell component for filled/unfilled cells
const Cell = (props) => {
    let cellclass = '';
    if (props.fill === "0") {
        cellclass = "Cell";
    } else {
        cellclass = "Cell CellFill";
    }
    return <div className={cellclass} style={{ backgroundColor: props.color }} ></div>
}

const buildEmptyBoard = (rowCount, colCount) => {
    let arr = [];
    for (let i = 0; i < rowCount; i++) {
        let arrc = [];
        for (let j = 0; j < colCount; j++) {
            arrc[j] = 0;
        }
        arr[i] = arrc;
    }
    return arr;
};

//main tetris component
const Tetris = (props) => {
    const {cols: colCount, rows: rowCount } = props;
    const [currentX, setCurrentX] = useState(Math.floor(colCount / 2));
    const [currentY, setCurrentY] = useState(0);
    const [currentBlockType, setCurrentBlockType] = useState(getRandomBlock());

    const currentBlock = getBlock(currentBlockType, currentX, currentY);

    const [committedBoard, setCommittedBoard] = useState(buildEmptyBoard(rowCount, colCount));

    let rows = [];
    for (let i = 0; i < rowCount; i++) {
        let cols = [];
        const blockColorCode = blockColor(currentBlockType);
        for (let j = 0; j < colCount; j++) {
            let colorStatus = 0;
            if (committedBoard[i][j] != 0) {
                colorStatus = committedBoard[i][j];
            } else {
                currentBlock.forEach(([x, y]) => {
                    if (x === j && y === i) {
                        colorStatus = blockColorCode;
                    }
                });
            }

            if (colorStatus != 0) {
                cols.push(<Cell fill="1" color={colorStatus} />);
            } else {
                cols.push(<Cell fill="0" color="#FFF" />);
            }
        }
        rows.push(<div className="Row">{cols}</div>);
    }

    //commit board state and render a new block
    const commitBoard = () => {
        const blockColorCode = blockColor(currentBlockType);
        currentBlock.forEach(([x, y]) => {
            committedBoard[y][x] = blockColorCode;
        })
        setCommittedBoard(committedBoard);

        setCurrentBlockType(getRandomBlock());

        setCurrentX(Math.floor(colCount / 2))
        setCurrentY(0);
    }

    const moveBlockDown = () => {
        let maxY = 0;
        currentBlock.forEach(([x, y]) => {
            maxY = Math.max(maxY, y);
        });
        let nextValue = maxY + 1 < rowCount ? committedBoard[maxY + 1][currentX] : 1;
        if (nextValue === 0) {
            setCurrentY(y => y + 1);
        } else {
            commitBoard();
        }
    }

    //function called on arrow keypressed
    let handleKeyEvents = (e) => {
        if (Keycode.isEventKey(e, 'down')) {
            moveBlockDown();
        } else if (Keycode.isEventKey(e, 'left')) {
            let leftAllowed = true;
            currentBlock.forEach(([x, y]) => {
                if (x - 1 < 0 || committedBoard[y][x - 1]) {
                    leftAllowed = false;
                }
            });

            if (leftAllowed) {
                setCurrentX(x => x - 1);
            }
        } else if (Keycode.isEventKey(e, 'right')) {
            let rightAllowed = true;
            currentBlock.forEach(([x, y]) => {
                if (x + 1 >= colCount || committedBoard[y][x + 1]) {
                    rightAllowed = false;
                }
            });

            if (rightAllowed) {
                setCurrentX(x => x + 1);
            }
        }
    }

    useEffect(() => {
        const timer = setTimeout(moveBlockDown, 1000);
        window.addEventListener('keydown', handleKeyEvents);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('keydown', handleKeyEvents);
        };
    });

    return (
        <div> <div className="Tetris">{rows}</div></div>
    )
}

export default Tetris;
