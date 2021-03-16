import _ from 'lodash';

const iBlock = Object.freeze([
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
]);

const lBlock = Object.freeze([
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
]);

const sBlock = Object.freeze([
    [1, 1],
    [1, 1],
]);

const zBlock = Object.freeze([
    [1, 1, 0],
    [0, 1, 1]
]);

const blocks = {
    I: {
        data: iBlock,
        states: 2,
        center: [1, 1],
    },
    L: {
        data: lBlock,
        states: 4,
        center: [1, 1],
    },
    S: {
        data: sBlock,
        states: 1,
        center: [0, 0],
    },
    Z: {
        data: zBlock,
        states: 4,
        center: [1, 1],
    }
};

// copied from - https://medium.com/front-end-weekly/matrix-rotation-%EF%B8%8F-6550397f16ab
const flipMatrix = matrix => (
    matrix[0].map((column, index) => (
        matrix.map(row => row[index])
    ))
);

const rotateMatrix = matrix => (
    flipMatrix(matrix.reverse())
);


const rotateBlock = (blockData, rotationAmount) => {
    let newBlockData = _.cloneDeep(blockData)
    while (rotationAmount) {
        rotationAmount -= 1;
        newBlockData = rotateMatrix(newBlockData);
    }
    return newBlockData;
}

const generateBlockFromData = (blockData, center, x, y) => {
    const coordinates = [];
    for (let i = 0; i < blockData.length; i++) {
        for (let j = 0; j < blockData[0].length; j++) {
            if (blockData[i][j] === 0) continue;
            const a = x + (i - center[0]);
            const b = y + (j - center[1]);
            coordinates.push([a, b]);
        }
    }
    return coordinates;
};

export const getBlock = (blockCharacter, x, y, rotation = 0) => {
    const blockInfo = blocks[blockCharacter];
    const rotationAmount = rotation % Math.max(1, blockInfo.states);
    const blockData = rotateBlock(blockInfo.data, rotationAmount);

    const { center } = blockInfo;
    return generateBlockFromData(blockData, center, x, y);
};


//To get random block component letter
export const getRandomBlock = () => {
    const blockStr = 'ILZS';
    const str = blockStr[Math.floor(Math.random() * blockStr.length)];
    return str;
}

export const blockColor = (blockStr) => {
    const color = {
        'I': '#800000',
        'L': '#008000',
        'Z': '#999900',
        'S': '#FA9900',
    }
    return color[blockStr];
}
