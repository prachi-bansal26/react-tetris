import React from 'react';

const Blocks = (props) => {
    const block = {
        'I': [
            [props.x - 2, props.y],
            [props.x - 1, props.y],
            [props.x, props.y],
            [props.x + 1, props.y]
        ],
        'L': [
            [props.x, props.y],
            [props.x, props.y + 1],
            [props.x, props.y + 2],
            [props.x + 1, props.y + 2]
        ],
        'Z': [
            [props.x - 1, props.y],
            [props.x, props.y],
            [props.x, props.y + 1],
            [props.x + 1, props.y + 1]
        ]
    }
    const blockStr = 'ILZ';
    const random = blockStr[Math.floor(Math.random() * blockStr.length)];

    return block[random];
}
export default Blocks;