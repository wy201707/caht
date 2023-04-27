const { Sequelize } = require('sequelize');
const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = require('../config/config.default');

/* const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = require('../../.env');
console.log('原视频有出错', MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PWD, MYSQL_DB); */
const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
    host: MYSQL_HOST,
    dialect: 'mysql',
    timezone: '+08:00'
});
/* const seq = new Sequelize('webgis', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+08:00'
}); */

//测试一下连接是否成功
seq.authenticate()
    .then(() => {
        console.log('数据库链接成功.');
    })
    .catch((err) => {
        console.log('链接失败', err);
    });
module.exports = seq;
