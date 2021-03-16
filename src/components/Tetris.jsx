import React, { useEffect, useState } from 'react';
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

const isGameOver = (board) => {
    let over = false;
    board[0].forEach((item) => {
        if (item !== 0) {
            over = true;
        }
    });
    return over;
}

//main tetris component
const Tetris = (props) => {
    const {cols: colCount, rows: rowCount } = props;
    const [gameOver, setGameOver] = useState(false);
    const [currentX, setCurrentX] = useState(Math.floor(colCount / 2));
    const [currentY, setCurrentY] = useState(0);
    const [currentBlockType, setCurrentBlockType] = useState(getRandomBlock());
    const [currentRotation, setCurrentRotation] = useState(0);

    const currentBlock = getBlock(currentBlockType, currentX, currentY, currentRotation);

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
            // Block cells which haven't been rendered
            if (y < 0) return;

            committedBoard[y][x] = blockColorCode;
        })
        setCommittedBoard(committedBoard);

        // Remove empty rows
        for (let i = 0; i < rowCount; i++) {
            let isFullyFilled = true;
            committedBoard[i].forEach(value => {
                if (value === 0) isFullyFilled = false;
            });

            if (isFullyFilled) {
                const emptyRow = committedBoard[i].fill(0);
                committedBoard.splice(i, 1);
                committedBoard.splice(0, 0, emptyRow);
            }
        }

        // check game over
        if (isGameOver(committedBoard)) {
            setGameOver(true);
            return;
        }

        // Add new block
        setCurrentBlockType(getRandomBlock());
        setCurrentRotation(0);
        setCurrentX(Math.floor(colCount / 2))
        setCurrentY(0);
    }

    const moveBlockDown = () => {
        let downAllowed = true;
        currentBlock.forEach(([x, y]) => {
            // Block cells which haven't been rendered
            if (y < 0) return;

            if (y + 1 >= rowCount || committedBoard[y + 1][x]) {
                downAllowed = false;
            }
        });

        if (downAllowed) {
            setCurrentY(y => y + 1);
        } else {
            commitBoard();
        }
    }

    //function called on arrow keypressed
    let handleKeyEvents = (e) => {
        if (Keycode.isEventKey(e, 'up')) {
            setCurrentRotation(rotation => rotation + 1);
        } else if (Keycode.isEventKey(e, 'down')) {
            moveBlockDown();
        } else if (Keycode.isEventKey(e, 'left')) {
            let leftAllowed = true;
            currentBlock.forEach(([x, y]) => {
                // Block cells which haven't been rendered
                if (y < 0) return;

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
                // Block cells which haven't been rendered
                if (y < 0) return;

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
        if (gameOver) {
            window.removeEventListener('keydown', handleKeyEvents);
            return;
        }

        const timer = setTimeout(moveBlockDown, 1000);
        window.addEventListener('keydown', handleKeyEvents);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('keydown', handleKeyEvents);
        };
    });

    if (gameOver) {
        return "Game Over";
    }

    return (
        <div className="Tetris">{rows}</div>
    )
}

export default Tetris;
