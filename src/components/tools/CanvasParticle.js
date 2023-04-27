/****
*粒子对象
****/
var CanvasParticle = function (options) {
    // ！我：粒子对象是搜索得到的
    this.x = options.x||null;//粒子初始x位置(相对于棋盘网格，比如x方向有360个格，x取值就是0-360，这个是初始化时随机生成的)
    this.y = options.y||null;//粒子初始y位置(同上)
    this.tx = options.tx||null;//粒子下一步将要移动的x位置，这个需要计算得来
    this.ty = options.ty||null;//粒子下一步将要移动的y位置，这个需要计算得来
    this.age = options.age||null;//粒子生命周期计时器，每次-1
    this.speed = options.speed||null;//粒子移动速度，可以根据速度渲染不同颜色   #!不错呦~
};
export default CanvasParticle