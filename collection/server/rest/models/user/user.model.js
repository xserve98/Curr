const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    openid:{type: String}, //用户ID
    username: {type: String}, // 用户名
    nickname: {type: String}, // 昵称
    enable: {type: Boolean, default: false},
    gender: {type: String, default: '0'},
    avatar: {type: String, default: ''},    // 头像
    profile: {type: String, default: ''},   // 个人简介
    balance:  {type: Number, default: 0}, //余额
    lossToday: {type: Number, default: 0}, //当日盈亏
    rebate: {type: Number, default: 0}, //反水
    password: {type: String},
    createdAt: {type: Date, default: Date.now()},

    proxy: {type: Boolean, default: false},// 是否为代理

    //
    agentId: {type: String, default: '', index: true}, //被谁推荐的
});

module.exports = mongoose.model('Users', UserSchema);