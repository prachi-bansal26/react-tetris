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
    function commitBoard() {
        const blockColorCode = blockColor(currentBlockType);
        currentBlock.forEach(([x, y]) => {
            committedBoard[y][x] = blockColorCode;
        })
        setCommittedBoard(committedBoard);

        setCurrentBlockType(getRandomBlock());

        setCurrentX(Math.floor(colCount / 2))
        setCurrentY(0);
    }

    //function called on arrow keypressed
    let keydownHandlerMaker = (timer) => {
        let handler = function (e) {
            e = e || window.event;
            if (Keycode.isEventKey(e, 'down')) {
                window.clearTimeout(timer['timer']);
                timer['timer'] = debounce(intervalFunction, 300);
                debounce.cancel;
            } else if (Keycode.isEventKey(e, 'left')) {
                let leftAllowed = true;
                currentBlock.forEach(([x, y]) => {
                    if (x - 1 < 0 || committedBoard[currentY][x - 1]) {
                        leftAllowed = false;
                    }
                });

                if (leftAllowed) {
                    setCurrentX(x => x - 1);
                }
            } else if (Keycode.isEventKey(e, 'right')) {
                let rightAllowed = true;
                currentBlock.forEach(([x, y]) => {
                    if (x + 1 >= colCount || committedBoard[currentY][x + 1]) {
                        rightAllowed = false;
                    }
                });

                if (rightAllowed) {
                    setCurrentX(x => x + 1);
                }
            }
        }
        return handler;
    }

    const intervalFunction = () => {
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

    //function used for useeffect hook
    let updateState = function () {
        const timer = { timer: setTimeout(intervalFunction, 1000) };
        const keydownHandler = keydownHandlerMaker(timer);
        window.addEventListener('keydown', keydownHandler);

        return () => {
            window.clearInterval(timer['timer']);
            window.removeEventListener('keydown', keydownHandler);
        };
    };

    useEffect(updateState);

    return (
        <div> <div className="Tetris">{rows}</div></div>
    )
}

export default Tetris;
