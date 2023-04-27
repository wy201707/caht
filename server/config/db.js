const Sequelize = require('sequelize'); // 引入sequelize

// 使用url连接的形式进行连接，注意将root: 后面的XXXX改成自己数据库的密码
const webgis = new Sequelize('mysql://root:123456@localhost/webgis',{
  define: {
    timestamps: false // 取消Sequelzie自动给数据表加入时间戳（createdAt以及updatedAt）
  }
}) 

module.exports = {
  webgis// 将webgis暴露出接口方便Model调用
}

/* 这个好像更详细  来自：https://www.cnblogs.com/zjknb/p/12149420.html
const Sequelize = require('sequelize');
const sequelize = new Sequelize('test','root','123456',{
    host:'182.61.15.43',
    dialect:'mysql',
    operatorsAliases:false,
    dialectOptions:{
        //字符集
        charset:'utf8mb4',
        collate:'utf8mb4_unicode_ci',
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: '+08:00'  //东八时区
});
 
module.exports = {
    sequelize
}; */