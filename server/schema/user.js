const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'user',
        {
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: '法二：联合主键，电话和昵称联合主键，一个电话可以注册多个不同昵称的账号'
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false,
                primaryKey: true,
                comment: '法一：以电话为主键（一个电话标识一个人，一个人一个账号）'
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            is_admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0,
                comment: '是否为管理员，0：不是；1：是管理员'
            }
        },
        {
            sequelize,
            tableName: 'user',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'phone' }]
                }
            ]
        }
    );
};
