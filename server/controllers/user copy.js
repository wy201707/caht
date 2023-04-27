// controllers/user.js

const user = require('../service/user.service.js');

const getUserInfo = async (ctx) => {
    // const name = req.params.name; // 获取url里传过来的参数里的id
    // const name = this.params.name; // 获取url里传过来的参数里的id
    console.log(ctx);
    // const name = this.params.name; // 获取url里传过来的参数里的id

    /// const nameCaptures=this.captures; //这样好像也行
    // console.log(this.req)
    /*
    url:'/login/user/wy',
    query: null,
        pathname: '/login/user/wy',
        path: '/login/user/wy',
        href: '/login/user/wy',
        _raw: '/login/user/wy'
    */
    //   const name = ctx.query.name ; // 获取url里传过来的参数里的id
    const result = await user.getUserByName(name).catch((err) => {
        console.log(err);
    }); // 通过yield “同步”地返回查询结果
    if (result) {
        console.log('找到了', result.dataValues);
    }
    ///// 直接设置this.state行不行？
    /*     this.response.message='用户数据在这里！'
    this.response.body='<h2>行不行啊你</h2>' */
    this.body = '<h2>行不行啊你</h2>';
    console.log('怎么样啊？调试也没有卵用啊？？？');
    /*  if (this.response.data.state === 'success') {
        this.$message({
            message: '读取json成功',
            type: 'success',
        });
        // const blob = new Blob([JSON.stringify(response.data.JSONData)], {
        //     type: 'application/json',
        // });
    } */
    //  console.log(res)
    //  res.send(result)
    /*     console.log('this.response',this.response)
    this.response={
        status:200,
        message:'恭喜你，这是一条成功消息',
        header:{
            'content-type': 'text/plain; charset=utf-8',
            'content-length': '9'
        },
        body: {'user':result}
    } */
    //   this.response.body= result // 将请求的结果放到response的body里返回
    //   console.log(this.response)
};
/* const getUserInfo = function* (){
  const name = this.params.name; // 获取url里传过来的参数里的id
  const result = yield user.getUserByName(name);  // 通过yield “同步”地返回查询结果
  if(result){
    console.log('找到了',result.dataValues)
  }
  console.log('this 有body吗？',this)
  this.body = result // 将请求的结果放到response的body里返回
  ctx.response.body


} */

/* const getUserInfo = async (ctx,next)=>{
  const name = this.params.name; // 获取url里传过来的参数里的id
  const result = await user.getUserByName(name).catch(err=>{
    console.log(err)
  }); 
  if(result){
      console.log('找到了',result.dataValues)
  }
  this.body='<h2>行不行啊你</h2>' 
  console.log('怎么样啊？调试也没有卵用啊？？？')
} */

module.exports = {
    getUserInfo // 把获取用户信息的方法暴露出去
};
/* 
const getUserInfo = function* (){
  const id = this.params.id; // 获取url里传过来的参数里的id
  const result = yield user.getUserById(id);  // 通过yield “同步”地返回查询结果
  this.body = result // 将请求的结果放到response的body里返回
}

module.exports = {
  getUserInfo // 把获取用户信息的方法暴露出去 
} */
