const dotenv = require('dotenv');
const path = require('path');
// console.log(path.resolve(__dirname,'../../.env'))
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// console.log(process.env.APP_PORT)
// console.log(process.env);

// process.env表示node进程运行的环境，具体在nodejs基本课程讲解中（看看该up的其他视频），当前代码来自一下地址
//https://www.bilibili.com/video/BV13A411w79h?p=3&spm_id_from=pageDriver&vd_source=769f7dd6b32e7729c33132dfe439cefd
module.exports = process.env;
