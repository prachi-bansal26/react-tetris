export const getBlock = (blockCharacter, x, y) => {
    const block = {
        'I': [
            [x - 2, y],
            [x - 1, y],
            [x, y],
            [x + 1, y]
        ],
        'L': [
            [x, y],
            [x, y + 1],
            [x, y + 2],
            [x + 1, y + 2]
        ],
        'Z': [
            [x - 1, y],
            [x, y],
            [x, y + 1],
            [x + 1, y + 1]
        ]
    };

    return block[blockCharacter];
}

//To get random block component letter
export const getRandomBlock = () => {
    const blockStr = 'ILZ';
    const str = blockStr[Math.floor(Math.random() * blockStr.length)];
    return str;
}

export const blockColor = (blockStr) => {
    const color = {
        'I': '#800000',
        'L': '#008000',
        'Z': '#999900'
    }
    return color[blockStr];
}
