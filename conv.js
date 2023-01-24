const fs = require('fs');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const _ = require('lodash');
const { getS } = require('./lib.js');
const config = require('./config.js');
const LIST = config.LIST;

const 通话 = fs.readFileSync('./通话记录.txt', 'utf-8');
const 通话_res = 通话
    .split('\r\n')
    .filter(l => l)
    .map(l => l.split('\t').map(b => b.trim()))
    .map(l => {
        const d = dayjs(`${l[0]} ${l[3]}`, 'YYYY/M/D HH:mm:ss');

        return {
            day: d.format('YYYY-MM-DD'),
            direction: l[1],
            number: l[2],
            time: d.format('HH:mm:ss'),
            duration: getS(l[4]),
            location: l[5],
            price: Number(l[6]),
            ms: d.valueOf(),
        };
    })
    .sort((a, b) => a.ms - b.ms);

console.log('通话_res', 通话_res);

const 新建 = fs.readFileSync('./新建.txt', 'utf-8');
const 新建_res = 新建
    .split('\r\n')
    .filter(l => l)
    .map(l =>
        l
            .split(' ')
            .map(b => b.trim())
            .filter(b => b),
    )
    .map(l => {
        const d = dayjs(`${l[0]} ${l[3]}`, 'YYYY-MM-DD HH:mm:ss');

        return {
            day: d.format('YYYY-MM-DD'),
            direction: l[1],
            number: l[2],
            time: d.format('HH:mm:ss'),
            duration: getS(l[4]),
            location: l[5],
            price: Number(l[6]),
            ms: d.valueOf(),
        };
    })
    .sort((a, b) => a.ms - b.ms);

console.log('新建_res', 新建_res);

const query = fs.readFileSync('./query.txt', 'utf-8');
const query_res = query
    .split('\r\n')
    .filter(l => l)
    .map(l =>
        l
            .split('\t')
            .map(b => b.trim())
            .filter(b => b),
    )
    .map(l => {
        const d = dayjs(`${l[1]}`, 'YYYY/M/D H:m');

        return {
            day: d.format('YYYY-MM-DD'),
            direction: '主叫',
            number: l[0],
            time: d.format('HH:mm:ss'),
            duration: getS(l[2]),
            // location: l[5],
            price: Number(l[4]),
            ms: d.valueOf(),
        };
    })
    .sort((a, b) => a.ms - b.ms);

console.log('query_res', query_res);

const 工作 = fs.readFileSync('./工作.txt', 'utf-8');
const 工作_res = 工作
    .split('\r\n')
    .filter(l => l)
    .map(l =>
        l
            .split('\t')
            .map(b => b.trim())
            .filter(b => b),
    )
    .map(l => {
        const d = dayjs(`${l[0]} ${l[3]}`, 'YYYY/M/D HH:mm:ss');

        return {
            day: d.format('YYYY-MM-DD'),
            direction: l[1],
            number: l[2],
            time: d.format('HH:mm:ss'),
            duration: getS(l[4]),
            location: l[5],
            // price: Number(l[4]),
            ms: d.valueOf(),
        };
    })
    .sort((a, b) => a.ms - b.ms);

console.log('工作_res', 工作_res);

const x = []
    .concat(通话_res, 新建_res, query_res, 工作_res)
    .sort((a, b) => a.ms - b.ms)
    .filter(({ number }) => {
        return LIST.some(l => number.includes(l));
    });
console.log('x', x);

const y = _.unionBy(x, eq);
console.log('y', y);

const z = x.reduce((pre, cV) => {
    if (!y.find(yv => yv == cV)) {
        pre.push(cV);
    }
    return pre;
}, []);
console.log('z', z);

const sameZ = z.map(zv => {
    return x.filter(xv => eq(xv) == eq(zv));
});

const xx = x.filter(xb => !sameZ.flat().find(sz => sz == xb));
console.log('xx.length', xx.length);

const syZ = sameZ.map(arr => {
    return arr.reduce((pre, cV) => {
        if (Object.keys(pre) - Object.keys(cV) == 0) console.log('111', 111);
        return Object.keys(pre) > Object.keys(cV) ? pre : cV;
    });
});

console.log('sameZ', sameZ);
console.log('syZ', syZ);

const res = xx.concat(syZ).sort((a, b) => a.ms - b.ms);
console.log('res', res);

fs.writeFileSync('./res.json', JSON.stringify(res, null, 4));

console.log('ok ');
setTimeout(() => {}, 100000000);

function eq(v) {
    return `${v.ms} | ${v.duration} | ${v.number} | ${v.direction}`;
}
