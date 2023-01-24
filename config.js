const config = {
    // 本人发出信息的号码 拿不到
    rightNum: '110',
    // 本人在对方手机里的昵称也不知道
    rightName: '_name',

    // 号码里面能拿到 后面会被覆写
    leftNum: '_119',
    // 对方号码在本人通讯录的名称
    leftName: '_name',

    // 要过滤出来的号码
    list: [110, 119],
};

module.exports = config;
