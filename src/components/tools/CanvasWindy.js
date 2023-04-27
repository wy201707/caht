/****
*风场类
****/
import CanvasParticle from "./CanvasParticle";
import CanvasWindField from "./CanvasWindField好像用不到";
var CanvasWindy = function (json,params) {
    //风场json数据
    this.windData = json;
    //可配置参数
    /**
    * extent 风场绘制时的地图范围，范围不应该大于风场源数据的范围，顺序：west/east/south/north，有正负区分，如：[110,120,30,36]
    * extent参数可以结合使用的地图框架（arcgisjs、leaflet、ol等）动态调整，达到地图缩放时风场同步更新，extent参数改变后需要重新生成风场（redraw函数）
    */
    this.extent = params.extent || [];
    this.canvasContext = params.canvas.getContext("2d");//canvas上下文
    this.canvasWidth = params.canvasWidth || 300;//画板宽度
    this.canvasHeight = params.canvasHeight || 180;//画板高度
    this.speedRate = params.speedRate || 0.15;//风前进速率，可以用该数值控制线流动的快慢，值越大，越快  #我的数据应该是读出的每个点不一样
    this.particlesNumber = params.particlesNumber || 2000;//初始粒子总数，根据实际需要进行调节
    this.maxAge = params.maxAge || 120;//每个粒子的最大生存周期
    this.frameTime = 1000/(params.frameRate || 10);//每秒刷新次数，因为requestAnimationFrame固定每秒60次的渲染，所以如果不想这么快，就把该数值调小一些
    this.color = params.color || '#ffffff';//线颜色，提供几个示例颜色['#14208e','#3ac32b','#e0761a']
    this.lineWidth = params.lineWidth || 1;//线宽度
    //内置参数
    this.generateParticleExtent = [];//根据风场绘制时的extent，计算粒子随机生成时的范围（指的是棋盘网格的行列范围）
    this.windField = null;
    this.particles = [];
    this.animateFrame = null;//requestAnimationFrame事件句柄，用来清除操作
    this._init();
};
CanvasWindy.prototype = {
    constructor: CanvasWindy,
    _init: function () {
        var self = this;
        // 创建风场网格
        this.windField = this.createField();
        //如果风场创建时，传入的参数有extent，就根据给定的extent，让随机生成的粒子落在extent范围内
        if(this.extent.length!=0){
            this.extent = [
                Math.max(this.windField.west-180,this.extent[0]),
                Math.min(this.windField.east-180,this.extent[1]),
                Math.max(this.windField.south,this.extent[2]),
                Math.min(this.windField.north,this.extent[3])
            ];

            var resHeader = this.windData[0]['header'];
            var nx=resHeader.nx,
                ny=resHeader.ny,
                west = resHeader['lo1'],
                east = resHeader['lo2'],
                south = resHeader['la2'],
                north = resHeader['la1'];
            //计算extent左上角，右下角所在棋盘格的xy位置，加180是因为原始风向数据东西纬度是0-360表示的，根据实际数据可动态调整
            this.generateParticleExtent.push(((this.extent[0]+180)-west)/(east-west)*(nx-2));//左
            this.generateParticleExtent.push(((this.extent[1]+180)-west)/(east-west)*(nx-2));//右
            this.generateParticleExtent.push((north-(this.extent[2]))/(north-south)*(ny-2));//下
            this.generateParticleExtent.push((north-(this.extent[3]))/(north-south)*(ny-2));//上
        }
        // 创建风场粒子
        for (var i = 0; i < this.particlesNumber; i++) {
            this.particles.push(this.randomParticle(new CanvasParticle()));  //看这个randomParticle
        }
        this.canvasContext.fillStyle = "rgba(0, 0, 0, 0.97)";
        this.canvasContext.globalAlpha = 0.6;
        this.animate();

        var then = Date.now();
        (function frame() {
            self.animateFrame = requestAnimationFrame(frame);
            var now = Date.now();
            var delta = now - then;
            if (delta > self.frameTime) {
                then = now - delta % self.frameTime;
                self.animate();
            }
        })();
    },
    //根据现有参数重新生成风场
    redraw:function(){
        window.cancelAnimationFrame(this.animateFrame);
        this.particles = [];
        this.generateParticleExtent = [];
        this._init();
    },
    // _reGenerateGrid:function(){
    //     var resHeader = this.windData[0]['header'];
    //     var nx=resHeader.nx,
    //         ny=resHeader.ny,
    //         west = resHeader['lo1'];
    //         east = resHeader['lo2'];
    //         south = resHeader['la2'];
    //         north = resHeader['la1'];
    //         field=this.windField;
    //     //计算extent左上角，右下角所在棋盘格的xy位置，加180是因为原始方向数据东西纬度是0-360表示的
    //     var west_northuv = field.getIn((this.extent[0]+180-west)/(east-west)*nx,(north-this.extent[3])/(north-south)*ny);
    //     var east_southuv = field.getIn((this.extent[1]+180-west)/(east-west)*nx,(north-this.extent[2])/(north-south)*ny);
    //     var uComponent=[],vComponent=[];
    //     for()
    //     this.windData.lo1 = this.extent[0]+180;
    //     this.windData.lo2 = this.extent[1]+180;
    //     this.windData.la1 = this.extent[3];
    //     this.windData.la2 = this.extent[2];
    //     this.windData[0].data = [];
    //     this.windData[1].data = [];
    //     this.windField = this.createField();
    // },
    createField: function () {
        var data = this._parseWindJson();
        return new CanvasWindField(data);
    },
    animate: function () {
        var self = this,
            field = self.windField;
        var nextX = null,
            nextY = null,
            xy = null,
            uv = null;
        self.particles.forEach(function (particle) {
            if (particle.age <= 0) {
                self.randomParticle(particle);
            }
            if (particle.age > 0) {
                var x = particle.x,
                    y = particle.y,
                    tx = particle.tx,
                    ty = particle.ty;
                // 这里！！！
                if (!field.isInBound(tx, ty)) {
                    particle.age = 0;
                } else {
                    // 跳到下一次风到的格子
                    uv = field.getIn(tx, ty);
                    nextX = tx +  self.speedRate * uv[0];  //这里有问题吧，不是应该是x+  self.speedRate * uv[0];吗？
                    nextY = ty +  self.speedRate * uv[1];
                    particle.x = tx;
                    particle.y = ty;
                    particle.tx = nextX;
                    particle.ty = nextY;
                    particle.age--;
                }
            }
        });
        if (self.particles.length <= 0) this.removeLines();
        self._drawLines();
    },
    _resize:function(width,height){
        this.canvasWidth = width;
        this.canvasHeight = height;
    },
    _parseWindJson: function () {
        // ！这里要么改解析，要么换json格式。不过，这是说，某一时刻不同点的风速吗？
        // "gribLength": 251674,      "numberPoints": 259920,
        // "gribLength": 245626,       "numberPoints": 259920,
        var uComponent = null,
            vComponent = null,
            header = null;
        this.windData.forEach(function (record) {
            var type = record.header.parameterCategory + "," + record.header.parameterNumber;
            switch (type) {
                case "2,2":
                    uComponent = record['data'];
                    header = record['header'];
                    break;
                case "2,3":
                    vComponent = record['data'];
                    break;
                default:
                    break;
            }
        });
        return {
            header: header,
            uComponent: uComponent,
            vComponent: vComponent
        };
    },
    removeLines: function () {
        window.cancelAnimationFrame(this.animateFrame);
    },
    //根据粒子当前所处的位置(棋盘网格位置)，得到canvas画板中的位置，以便画图
    _map: function (x,y) {
        var field = this.windField,
            fieldWidth = field.cols,
            fieldHeight = field.rows,
            newArr = [0,0];

        var noextent = this.generateParticleExtent.length==0;
        newArr[0] = Math.floor((x/fieldWidth)*this.canvasWidth);
        newArr[1] = Math.floor((y/fieldHeight)*this.canvasHeight);

        newArr[0] = Math.floor(((noextent?x:(x-this.generateParticleExtent[0]))/(noextent?fieldWidth:(this.generateParticleExtent[1]-this.generateParticleExtent[0])))*this.canvasWidth);
        newArr[1] = Math.floor(((noextent?y:(y-this.generateParticleExtent[3]))/(noextent?fieldHeight:(this.generateParticleExtent[2]-this.generateParticleExtent[3])))*this.canvasHeight);
        // console.log(newArr);
        return newArr;
    },
    _drawLines: function () {
        var self = this;
        var particles = this.particles;
        this.canvasContext.lineWidth = self.lineWidth;
        //后绘制的图形和前绘制的图形如果发生遮挡的话，只显示后绘制的图形跟前一个绘制的图形重合的前绘制的图形部分，示例：https://www.w3school.com.cn/tiy/t.asp?f=html5_canvas_globalcompop_all
        this.canvasContext.globalCompositeOperation = "destination-in";
        this.canvasContext.fillRect(0,0,this.canvasWidth,this.canvasHeight);
        this.canvasContext.globalCompositeOperation = "lighter";//重叠部分的颜色会被重新计算
        this.canvasContext.globalAlpha = 0.9;

        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = this.color;
        particles.forEach(function (particle) {
            var movetopos = self._map(particle.x, particle.y);
            var linetopos = self._map(particle.tx, particle.ty);
            self.canvasContext.moveTo(movetopos[0],movetopos[1]);
            self.canvasContext.lineTo(linetopos[0],linetopos[1]);
        });
        this.canvasContext.stroke();
    },
    //随机数生成器（小数）
    fRandomByfloat:function(under, over){ 
       return under+Math.random()*(over-under);
    },
    //根据当前风场网格行列数随机生成粒子  ！需要搜索找到新的粒子
    randomParticle: function (particle) {
        var safe = 30,x, y;

        do {
            x = this.generateParticleExtent.length==0?this.fRandomByfloat(0,this.windField.cols - 2):this.fRandomByfloat(this.generateParticleExtent[0],this.generateParticleExtent[1]);
            y = this.generateParticleExtent.length==0?this.fRandomByfloat(0,this.windField.rows - 2):this.fRandomByfloat(this.generateParticleExtent[3],this.generateParticleExtent[2]);
        } while (this.windField.getIn(x, y)[2] <= 0 && safe++ < 30);
        var field = this.windField;
        var uv = field.getIn(x, y);
        var nextX = x +  this.speedRate * uv[0];
        var nextY = y +  this.speedRate * uv[1];
        particle.x = x;
        particle.y = y;
        particle.tx = nextX;
        particle.ty = nextY;
        particle.speed = uv[2];
        particle.age = Math.round(Math.random() * this.maxAge);//每一次生成都不一样   #！我的生成时间应该怎么办呢？
        return particle;
    }
};
export default CanvasWindy
