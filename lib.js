function getS(_s) {
    const s = _s
        .replace(/秒/g, '')
        .replace(/分/g, '_')
        .replace(/:/g, '_')
        .split('_')
        .map(n => Number(n))
        .reverse();
    const t = s.reduce((pre, cV, cI) => {
        return pre + cV * Math.pow(60, cI);
    }, 0);

    return t;
}

function logType(v) {
    switch (v) {
        case '被叫':
            return '呼入已接';
        case '主叫':
            return '呼出已接';
        default:
            throw new Error('error Type', v);
    }
}

module.exports = {
    getS,
    logType,
};
