// controllers/user.js

const user = require('../service/user.service.js');

const getUserInfo = async function (ctx) {
    const name = this.params.name; // 获取url里传过来的参数里的id
    console.log('this.params', this.params); //1
    // this.params { name: 'wy' }
    /* 1.console.log('ctx',ctx) 没用，一整个对象   //ctx Promise { <pending> }
   2.
    const nameCaptures=this.captures; //这样好像也行，但看起来不严谨
    console.log('nameCaptures',nameCaptures)  
    // nameCaptures [ 'wy' ] 
    3. console.log('this.req',this.req) 
    //这个勉强，有好多内容，有用的： 
    url:'/login/user/wy',
    query: null,
        pathname: '/login/user/wy',
        path: '/login/user/wy',
        href: '/login/user/wy',
        _raw: '/login/user/wy' 
   4. console.log('ctx.query',ctx.query)  //这个不行
   5.console.log('req.params.name',req.params.name) 不行
   6.const name = ctx.query.name ; // 获取url里传过来的参数里的id 不行
  */
    const result = await user.getUserByName(name).catch((err) => {
        console.log(err);
    });
    if (result) {
        console.log('找到了', result.dataValues);
    }

    this.body = '<h2>行不行啊你</h2>';
    console.log('怎么样啊？调试也没有卵用啊？？？无法显示到页面');
    /*  if (this.response.data.state === 'success') {
        this.$message({
            message: '读取json成功',
            type: 'success',
        });
        // const blob = new Blob([JSON.stringify(response.data.JSONData)], {
        //     type: 'application/json',
        // });
    } */

    //   this.response.body= result // 将请求的结果放到response的body里返回
    //   console.log(this.response)
};

module.exports = {
    getUserInfo // 把获取用户信息的方法暴露出去
};
