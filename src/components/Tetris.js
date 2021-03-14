import React, { useEffect, useState, useRef } from 'react';
import _ , { debounce } from "lodash";
import '../styles/Tetris.css';

// Cell component for filled/unfilled cells
const Cell = (props) => {
    let cellclass = '';
    if (props.fill === "0") {
        cellclass = "Cell";
    } else {
        cellclass = "Cell CellFill";
    }
    return <div className={cellclass} style = {{backgroundColor: props.color}} ></div>
}

//Block Component returned with passed x, y
const getBlock = (b, myX, myY) => {
    const block = {
        'I': [
            [myX - 2, myY],
            [myX - 1, myY],
            [myX, myY],
            [myX + 1, myY]
        ],
        'L': [
            [myX, myY],
            [myX, myY + 1],
            [myX, myY + 2],
            [myX + 1, myY + 2]
        ],
        'Z': [
            [myX - 1, myY],
            [myX, myY],
            [myX, myY + 1],
            [myX + 1, myY + 1]
        ]
    };
    return block[b];
}
const blockColor = (blockStr) => {
    const color = {
        'I' : '#800000',
        'L' : '#008000',
        'Z' : '#999900'
    }
    return color[blockStr];
}

//To get random block component letter
const getRandomBlock = () => {
    const blockStr = 'ILZ';
    const str = blockStr[Math.floor(Math.random() * blockStr.length)];
    return str;
}

//main tetris component 
const Tetris = (props) => {
    const [myX, setMyX] = useState(Math.floor(props.cols / 2));
    const [myY, setMyY] = useState(0);

    let randomType = getRandomBlock();

    const [randomBlockType, setrandomBlockType] = useState(randomType);

    let block = getBlock(randomBlockType, myX, myY);
    let blockColorCode = blockColor(randomBlockType);

    //console.log(blockColorCode);
    const [stageState, setStage] = useState(() => {
        let arr = [];
        for (let i = 0; i < props.rows; i++) {
            let arrc = [];
            for (let j = 0; j < props.cols; j++) {
                arrc[j] = 0;
            }
            arr[i] = arrc;
        }
        console.log(arr);
        return arr;
    });


    let rows = [];
    for (let i = 0; i < props.rows; i++) {
        let cols = [];
        for (let j = 0; j < props.cols; j++) {
            let criteria = 0;
            if (stageState[i][j] != 0) {
                criteria = 1;
            } else {
                block.forEach(([x, y]) => {
                    if (x === j && y === i)
                        criteria = 1;
                });
            }

            if (criteria === 1) {
                cols.push(<Cell fill = "1" color = {blockColorCode}/>);
            } else {
                cols.push(<Cell fill = "0" color = "#FFF"/>);
            }
        }
        rows.push(<div className="Row">{cols}</div>);
    }
    //update states of block to initial and render a new block
    function updateBlockState() {
        block.forEach(([x, y]) => {
            stageState[y][x] = 1;
        })
        setStage(stageState);

        let randomizer = getRandomBlock();
        //console.log(block[randomizer]);
        setrandomBlockType(randomizer);

        setMyX(Math.floor(props.cols / 2))
        setMyY(0);
    }

    //function called on arrow keypressed
    let keydownHandlerMaker = (timer) => {
        let handler = function(e) {
            e = e || window.event;
            if (e.keyCode == '38') {
                // up arrow
                
            }
            else if (e.keyCode == '40') {
                // down arrow
                console.log(timer['timer']);
                window.clearTimeout(timer['timer']);
                timer['timer'] = debounce(intervalFunction, 300);
                debounce.cancel;
            }
            else if (e.keyCode == '37') {
                // left arrow
                let minX = props.cols;
                block.forEach(([x, y]) => {
                    minX = Math.min(minX, x);
                });
                let prevX = minX - 1 >= 0 ? stageState[myY][minX-1] : -1;
                if(prevX == 0)
                    setMyX(x => x-1 < 0 ? 0 : x-1);
                else if(prevX != -1)
                    updateBlockState();
            }
            else if (e.keyCode == '39') {
                // right arrow
                let maxX = 0;
                block.forEach(([x, y]) => {
                    maxX = Math.max(maxX, x);
                });
                let nextX = maxX + 1 < props.cols ? stageState[myY][maxX+1] : -1;
                if(nextX == 0)
                    setMyX(x => x+1 > props.cols ? x : x+1);
                else if(nextX != -1)
                    updateBlockState();
            }
        }
        return handler;
    }
    


    const intervalFunction = () => {
        let maxY = 0;
        block.forEach(([x, y]) => {
            maxY = Math.max(maxY, y);
        });
        let nextValue = maxY + 1 < props.rows ? stageState[maxY + 1][myX] : 1;
        if (nextValue == 0) {
            setMyY(y => y + 1);
        } else {
            updateBlockState();
        }
        console.log(myY,myX);
    }

   

    //function used for useeffect hook
    let updateState = function () {
        const timer = {timer: setTimeout(intervalFunction, 1000)};
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
