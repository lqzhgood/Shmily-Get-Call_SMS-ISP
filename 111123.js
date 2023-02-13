const fs = require('fs');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const _ = require('lodash');
const { getS } = require('./lib.js');

const config = require('./config.js');
const LIST = config.LIST;
const txt = fs.readFileSync('./工作.txt', 'utf-8');

const line = txt.split('\r\n').filter(l => l.trim());

const m = line.map(l => {
    const x = l.split('\t');
    const msg = {
        day: x[0].trim(),
        direction: x[1].trim(),
        number: x[2].trim(),
        time: x[3].trim(),
        duration: getS(x[4].trim()),
        location: x[5].trim(),
    };
    return msg;
});

console.log('config', _.countBy(m, 'number'));

const b = m
    .filter(({ number }) => {
        return LIST.some(l => number.includes(l));
    })
    .map(o => {
        const d = dayjs(`${o.day} ${o.time}`, 'YYYY/M/D HH:mm:ss');
        const direction = o.direction == '主叫' ? 'go' : 'come';
        const send = {};
        const receive = {};

        if (direction === 'go') {
            send.sender = config.rightNum;
            send.senderName = config.rightName;

            receive.receiver = o.number;
            receive.receiverName = config.leftName;
        }

        if (direction === 'come') {
            send.sender = o.number;
            send.senderName = config.leftName;

            receive.receiver = config.rightNum;
            receive.receiverName = config.rightName;
            console.log('2', 2);
        }

        return {
            source: 'CallLog',
            device: 'Phone',
            type: logType(o.direction),
            direction,

            ...send,
            ...receive,

            day: d.format('YYYY-MM-DD'),
            time: d.format('HH:mm:ss'),
            ms: d.valueOf(),
            $CallLog: {
                data: {
                    duration: o.duration,
                    location: o.location,
                },
            },
        };
    });
console.log('m', m);
console.log('b', b);
console.log('ok');

setTimeout(() => {}, 100000000);

const tmp2 = {
    source: '',
    device: '',
    type: '',
    direction: '',
    sender: '',
    senderName: '',
    receiver: '',
    receiverName: '',
    day: '',
    time: '',
    ms: '',
    $CallLog: {
        data: { duration: 253 },
    },
};

const tmp = {
    source: '',
    device: '',
    type: '',
    direction: '',
    sender: '',
    senderName: '',
    receiver: '',
    receiverName: '',
    day: '',
    time: '',
    ms: '',
    content: '',
    html: '',
    msAccuracy: '',
    _Dev: { warn: '', isFromOtherAccount: '' },
    numberIsTrue: '',
    $CallLog: {
        data: { duration: 253 },
    },
};
