const { Sequelize, DataTypes } = require('sequelize');

const seq = require('../db/seq');

//创建模型(model一般加前缀：项目名称) model:User，对应自动生成表：Users，也可以定义表名，在第三项
const User = seq.define(
    'webgis_user',
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: '用户名，唯一'
        },
        password: {
            type: DataTypes.CHAR,
            allowNull: false,
            comment: '密码'
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0,
            comment: '是否为管理员，0：不是；1：是管理员'
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: '电话，注册时候可选项。也许可以用到token。场景：用户登录后完善用户信息（用于找回密码？）'
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: '邮箱'
        }
    }
    // { timestamps: false }
);

//强制同步数据库(创建数据表)
// User.sync({ force: true }); //如果有表，直接删除重建

module.exports = User;
