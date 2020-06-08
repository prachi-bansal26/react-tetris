import React, { useEffect, useState } from 'react';
import '../styles/Tetris.css';

const Cell = (props) => {
    let cellclass = '';
    if(props.fill === "0" ) {
        cellclass = "Cell";
    } else {
        cellclass = "Cell CellFill";
    }
    return <div className={cellclass}></div>
}

const Tetris = (props) => {
    const [myX, setMyX] = useState(Math.floor(props.cols/2));
    const [myY, setMyY] = useState(0);

    const block = {
        'I' : [
                [myX-2, myY], 
                [myX-1, myY], 
                [myX, myY], 
                [myX+1, myY]
            ],
        'L' : [
                [myX, myY],
                [myX, myY+1],
                [myX, myY+2],
                [myX+1, myY+2]
        ],
        'Z' : [
                [myX-1, myY],
                [myX, myY],
                [myX, myY+1],
                [myX+1, myY+1]
        ]
    } 
    const blockStr = 'ILZ';              
    let random = blockStr[Math.floor(Math.random() * blockStr.length)];
    
    const [randomBlock, setrandomBlock] = useState(block[random]);
    //console.log(randomBlock);

    let Stage = function() {
        let rows = [];
        for(let i=0; i<props.rows; i++) {
            let cols = [];
            for(let j=0; j<props.cols; j++) {
                let criteria = 0;
                randomBlock.forEach(([ x, y ]) => {
                        if(x === j && y === i)
                            criteria = 1;
                });
                if( criteria === 1) {
                    cols.push(<Cell fill="1" />);
                } else {
                    cols.push(<Cell fill="0" />);
                }
            }
            rows.push(<div className="Row">{cols}</div>);
        }
        return <div className="Tetris">{rows}</div>;
    }

    useEffect(() => {
        const timer = window.setInterval(() => {
            if(myY < props.rows) {
                setMyY(y => y+1);
                setrandomBlock( b => {
                    b.forEach(([ x, y ], i) => {
                            y++;
                            b[i] = [x, y];
                        })
                    return b;
                    }
                );
            } else {
                setMyY(y => 0);
               
            }
            
            //console.log(myY,props.rows);
        }, 1000);
        return () => {
            window.clearInterval(timer);
            if(myY == 0) {
                let randomizer = blockStr[Math.floor(Math.random() * blockStr.length)];
                //console.log(block[randomizer]);
                setrandomBlock(b => block[randomizer]);
            }
          };
      }, [myY]);

    return (
        <div>{Stage()}</div>
    )
}

export default Tetris;