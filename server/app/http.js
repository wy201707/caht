//等等，这好像是前端的东西，现在倒在vue前端main.js
const axios = require('axios');
const QS = require('qs'); // 引入qs模块，用来序列化post类型的数据，后面会提到
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
