const fs = require('fs');
const dayjs = require('dayjs');

const { logType } = require('./lib.js');
const config = require('./config.js');

const res = require('./res.json');

// {
//     day: '2010-08-25',
//     direction: '主叫',
//     number: '15212341234',
//     time: '17:09:58',
//     duration: 35,
//     location: '城市',
//     ms: 1282727398000
//   },

console.log('check');
for (let i = 1; i < res.length; i++) {
    if (res[0].ms + res[0].duration * 1000 >= res[1].ms) {
        console.log(res[0], res[1]);
    }
}

const x = res.map(o => {
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
    }

    const msg = {
        source: 'CallLog',
        device: 'Phone',
        type: logType(o.direction),
        direction,

        ...send,
        ...receive,

        day: o.day,
        time: o.time,
        ms: o.ms,
        $CallLog: {
            data: { duration: o.duration },
        },

        $Dev: {
            msAccuracy: false,
        },
    };

    if ('location' in o) {
        msg.$CallLog.data.location = o.location;
    }
    if ('price' in o) {
        msg.$CallLog.data.price = o.price;
    }

    return msg;
});

console.log('x', x);

fs.writeFileSync('./logs_2010.json', JSON.stringify(x, null, 4));
console.log('ok');
setTimeout(() => {}, 10000000);
