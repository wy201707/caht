const User = require('../model/user.model');
class UserService {
    async createUser({ username, password, is_admin }) {
        //todo :写入数据库
        // console.log('service', username, password, is_admin);

        // const newUser = {};
        // username && Object.assign(newUser, { username });
        // // username && Object.assign({ username }); 那种？
        // password && Object.assign(newUser, { password });
        // is_admin && Object.assign(newUser, { is_admin });
        // console.log('service2', username, password, is_admin);
        // console.log('那newUser不是没用了', newUser);
        const res = await User.create({
            username,
            password,
            is_admin
        });
        // console.log(aaa); //为了模拟测试用户注册时候发生错误
        // console.log(res);
        return res.dataValues;
    }
    async getUserInfo({ id, username, password, is_admin }) {
        const whereOpt = {};
        id && Object.assign(whereOpt, { id }); //Object.assign拷贝
        username && Object.assign(whereOpt, { username });
        password && Object.assign(whereOpt, { password });
        is_admin && Object.assign(whereOpt, { is_admin });
        const res = await User.findOne({
            attributes: ['id', 'username', 'password', 'is_admin'], //attributes跟列表，表示希望查询得到的列
            where: whereOpt
        });
        return res ? res.dataValues : null;
    }
    async updateById({ id, username, password, is_admin }) {
        const whereOpt = { id };
        const newUser = {};
        username && Object.assign(newUser, { username });
        // username && Object.assign({ username }); 那种？
        password && Object.assign(newUser, { password });
        is_admin && Object.assign(newUser, { is_admin });
        console.log(whereOpt);
        const res = await User.update(newUser, {
            where: whereOpt
        });
        // console.log(res);
        /*         const { resnum } = res;
        if (resnum > 0) {
            console.log('修改成功');
        } */
        return !res[0];
    }
}
module.exports = new UserService();
/* const { DataTypes } = require('sequelize');
const db = require('../config/db'); //引入mysql的配置文件
const webgidDB = db.webgis; // 引入数据库
const User = require('../schema/user')(webgidDB, DataTypes);
//用require替代import解决“TypeError: webgidDB.import is not a function”报错

const getUserByName = async function (name) {
    // 注意是function* 而不是function 对于需要yield操作的函数都需要这种generator函数。
    const userInfo =  await User.findOne({
        // 用yield控制异步操作，将返回的Promise对象里的数据返回出来。也就实现了“同步”的写法获取异步IO操作的数据
        where: {
            name: name
        }
    });

    return userInfo; // 返回数据
};

module.exports = {
    getUserByName // 导出getUserById的方法，将会在controller里调用
}; */
