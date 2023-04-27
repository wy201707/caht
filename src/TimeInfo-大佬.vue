<template>
    <div class="TimeInfoComponent-pannel" v-show="this.$store.getters._getDefaultTimeInfoVisible">
        <div class="TimeInfoComponent-header">
            <span>动画参数设置</span>
            <i class="el-icon-close" @click="closeTimeInfoPannel"></i>
        </div>
        <el-form ref="TimeSetData" :model="TimeSetData" label-width="80px" size="small">
            <el-form-item label="开始时间">
                <el-col :span="24">
                    <el-date-picker
                        v-model="TimeSetData.startDT"
                        type="datetime"
                        placeholder="选择日期时间"
                        style="width: 100%"
                    >
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-col :span="24">
                    <el-date-picker
                        v-model="TimeSetData.endDT"
                        type="datetime"
                        placeholder="选择日期时间"
                        style="width: 100%"
                        default-time="23:50:00"
                        :picker-options="pickerOptions"
                    >
                        <!-- value-format="yyyy-MM-dd-HH-mm" -->
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="时间跨天">
                <el-switch v-model="TimeSetData.OneMoreDay"></el-switch>
                <!-- 这里不如这样：“时间跨天”选项放在最上面，时间跨天：时间条变为选择日期（开始时间：0：00，结束时间：24：00）
                时间不跨天：时间条变为选择时间的（提供默认时间、可选时间间隔0:00,0:10,23:59） -->
            </el-form-item>
            <el-form-item label="参数类型">
                <el-radio-group v-model="TimeSetData.DataType">
                    <el-radio :label="1">风 风速、风向</el-radio>
                    <el-radio :label="2">浪 浪高、浪向</el-radio>
                    <el-radio :label="3">流 流速、流向</el-radio>
                </el-radio-group>
                <!-- 希望之后可以做成多选（如果他需要的话）
                    <el-checkbox-group v-model="form.type">
                    <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                    <el-checkbox label="地推活动" name="type"></el-checkbox>
                    <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                    <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group> -->
            </el-form-item>
            <el-form-item label="刷新秒数" size="mini">
                <el-input-number v-model="TimeSetData.interval" :min="2" :max="30" :step="1"></el-input-number>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">播放</el-button>
                <!-- <el-button @click="ContinueAnimation('TimeSetData')">暂停</el-button> -->
                <el-button @click="StopAnimation">暂停</el-button>
                <!-- <el-button @click="ContinueAnimation">继续</el-button> -->
            </el-form-item>
        </el-form>

        <div class="TimeInfoComponent-footer">
            <el-row>
                <el-col :span="8"><span class="TimeInfo-span-label">当前进度</span></el-col>
                <el-col :span="16"
                    ><span class="TimeInfo-span-label">{{ NowTime }}</span></el-col
                >
            </el-row>
        </div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from './components/config';
// import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";
export default {
    name: 'TimeInfo',
    components: {},
    /*     mounted: function () {
        this.getWindData();
    }, */
    data() {
        return {
            TimeSetData: {
                startDT: '',
                endDT: '',
                OneMoreDay: false,
                DataType: 1, //默认不跨天
                interval: 2
            },
            NowTimeStr: '2021-09-12-00-10',
            // '2021-09-12-00-10',
            FiledRatation: '',
            FiledColor: '',
            steps: [],
            stops: [],
            animation: null,
            animating: false,
            pickerOptions: {
                // 设置禁用日期
                disabledDate: (endtime) => {
                    // 声明date变量等于开始日期
                    let startdate = this.TimeSetData.startDT;
                    // 当小于开始日期 或 大于等于今日时禁用
                    if (startdate) {
                        return (
                            endtime.getTime() <= this.TimeSetData.startDT - 1000 * 60 * 60 * 24 ||
                            endtime.getTime() >= new Date()
                        );
                    }
                }
            },
            SaveTime: '',
            animateStop: false,
            geojsonLayerInstance: undefined
            // Data: [],
            // windData: [],
            // waveData: [],
            // currentData: [],
        };
    },
    computed: {
        NowTime() {
            this.NowTimeStr = this.NowTimeStr.replace('-', '/').replace('-', '/').replace('-', '  ').replace('-', ':');
            return this.NowTimeStr;
        }
    },
    mounted() {
        // const sliderValue = document.getElementById('sliderValue');
    },
    methods: {
        getFileNameformData(date) {
            let dateStr =
                date.getFullYear() +
                '-' +
                ('0' + (date.getMonth() + 1)).slice(-2) +
                '-' +
                ('0' + date.getDate()).slice(-2) +
                '-' +
                ('0' + date.getHours()).slice(-2) +
                '-' +
                ('0' + date.getMinutes()).slice(-2);
            // con-sole.log(dateStr);
            return dateStr;
        },
        // ContinueAnimation() {
        //     console.log('continue animation', this.TimeSetData);
        //     console.log('this.SaveTime', this.SaveTime);
        //     if (this.animation) {
        //         this.animation.remove();
        //         this.animation = null;
        //     }

        //     this.animation = this.animate(this.SaveTime, this.TimeSetData.endDT);
        // },
        StopAnimation() {
            if (!this.animation) {
                return;
            }
            this.animation.remove();
            this.animation = null;
            this.animateStop = true;
        },
        setYear(value, _this) {
            //!显示当前数据  √用计算属性NowTime实现
            _this.NowTimeStr = _this.getFileNameformData(new Date(value));
            _this.getRadarOneData(_this.NowTimeStr);
            // con-sole.log(_this.NowTimeStr, 'NoewTimeStr--value:', value);
        },
        animate(sDT, eDT) {
            var _this = this;
            _this.animating = true;
            let timeValue = sDT;
            var then = Date.now();

            const frame = (timestamp) => {
                if (!_this.animating) {
                    return; //重新定义终止条件
                }

                timeValue = new Date(Number(timeValue) + 1000 * 60 * 10); //每次加10分钟
                // con-sole.log(timeValue);
                //如何遍历文件
                // !步长，每次加时间访问对应于的gson文件
                // con-sole.log(new Date(timeValue), ':', new Date(timeValue) > new Date(eDT));
                if (timeValue > new Date(eDT)) {
                    _this.animating = false;
                    return;
                    // ！超过弹回，我：超过停止，stop  ！！！选好终止条件
                }
                _this.SaveTime = timeValue;
                //！1.应该是这里，可以提供下一个文件名字/遍历文件夹，访问json，this.FiledRatation已经更新
                this.setYear(timeValue, _this); //！每次更新当先时间  //!2.这里提供新的样式+新的数据
                //settimeout函数会改变this指针指向，使其指向windows

                // Update at 30fps  ！30帧每秒，这个跟新速率不错【跟新时间】那里改成【帧频率】
                setTimeout(() => {
                    var now = Date.now();
                    console.log('时间间隔：', now - then);
                    frame();
                    // console.log('set time out ', timeValue);
                    /*与setTimeout相比，requestAnimationFrame最大的优势是由系统来决定回调函数的执行时机。
                            具体一点讲，如果屏幕刷新率是60Hz,那么回调函数就每16.7ms被执行一次，如果刷新率是75Hz，
                            那么这个时间间隔就变成了1000/75=13.3ms，换句话说就是，requestAnimationFrame的步伐跟
                            着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引
                            起丢帧现象，也不会导致动画出现卡顿的问题。
                            迷惑了setTimeout叠加requestAnimationFrame是什么原理？？？？
                    */
                    // setTimeout也叠加过 setTimeout

                    // 代码：理了但没完全理
                    // https://blog.csdn.net/VhWfR2u02Q/article/details/79492303
                    // https://juejin.cn/post/6844904083204079630
                }, _this.TimeSetData.interval * 1000); //1000/30
            };

            frame(); //这是哪来的？？？上面定义的呀， //!4.循环，直到跳出循环，这样这里可以改成循环+新的终止条件（判断文件夹、判断文件名）

            return {
                remove: () => {
                    _this.animating = false;
                }
            };
        },
        choiceType() {
            // console.log('choiceType', this.TimeSetData.DataType);
            switch (this.TimeSetData.DataType) {
                case 1:
                    this.FiledRatation = 'WindDir';
                    this.FiledColor = 'WindVelocity';
                    this.steps = [
                        // { value: -1, color: '#b0e0e6' },
                        { value: 0, color: '#87cefa', lable: '<0' },
                        { value: 1.6, color: '#2b83ba', lable: '1.6' },
                        { value: 5.5, color: '#abdda4', lable: '5.5' },
                        { value: 8.0, color: '#ffffbf', lable: '8.0' },
                        { value: 13.9, color: '#fdae61', lable: '13.9' },
                        { value: 20.8, color: '#d7191c', lable: '20.8' },
                        { value: 30, color: '#ffffff', lable: '30' }
                    ];
                    this.FieldSize = 30;

                    // this.stops = [
                    //     { value: -1, size: '0' },
                    //     { value: 1.6, size: '2' },
                    //     { value: 5.5, size: '4' },
                    //     { value: 8.0, size: '8' },
                    // ];
                    break;
                case 2:
                    this.FiledRatation = 'WaveDir';
                    this.FiledColor = 'WaveHs';
                    this.steps = [
                        // { value: -1, color: '#b0e0e6' },
                        { value: 0, color: '#87cefa', lable: '<0' },
                        { value: 0.4, color: '#2b83ba', lable: '0.4' },
                        { value: 0.8, color: '#abdda4', lable: '0.8' },
                        { value: 1.5, color: '#ffffbf', lable: '1.5' },
                        { value: 2.3, color: '#fdae61', lable: '2.3' },
                        { value: 3.0, color: '#d7191c', lable: '3.0' },
                        { value: 4.0, color: '#ffffff', lable: '>4.0' }
                    ];

                    this.FieldSize = 4.0;

                    // this.stops = [
                    //     { value: -1, size: '0' },
                    //     { value: 0, size: '2' },
                    //     { value: 1, size: '8' },
                    // ];
                    break;
                case 3:
                    this.FiledRatation = 'CurDirection';
                    this.FiledColor = 'Current';
                    this.steps = [
                        { value: 0, color: '#87cefa', lable: '<0' },
                        { value: 20, color: '#2b83ba', lable: '20' },
                        { value: 40, color: '#abdda4', lable: '40' },
                        { value: 60, color: '#ffffbf', lable: '60' },
                        { value: 80, color: '#fdae61', lable: '80' },
                        { value: 95, color: '#d7191c', lable: '95' },
                        { value: 130, color: '#ffffff', lable: '>130' }
                    ];
                    this.FieldSize = 110;

                    // this.stops = [
                    //     { value: -1, size: '0' },
                    //     { value: 0, size: '2' },
                    //     { value: 60, size: '8' },
                    // ];
                    break;
                default:
                    console.log('单选项返回值出错');
            }
        },
        onSubmit() {
            console.log('on submit!');
            if (this.animateStop) {
                console.log('this.SaveTime', this.SaveTime);
                if (this.animation) {
                    this.animation.remove();
                    this.animation = null;
                }

                this.animation = this.animate(this.SaveTime, this.TimeSetData.endDT);
                console.log('continue animation', this.animation);
                this.animateStop = false;
                return;
            }

            const view = this.$store.getters._getDefaultView;
            const resultLayer = view.map.findLayerById('GeoJSON');
            if (resultLayer) {
                view.map.remove(resultLayer);
            }
            // 先修理在格式化
            if (this.TimeSetData.startDT) {
                let sDT = this.TimeSetData.startDT;
                sDT.setMinutes(Math.round(sDT.getMinutes() / 10) * 10);
                this.TimeSetData.startDT = sDT;
                // if (this.SaveTime != '' && this.SaveTime!=sDT) {
                //     this.TimeSetData.startDT = this.SaveTime;
                // }
            } else {
                this.TimeSetData.startDT = new Date('2021/09/12 0:00:00');
            }

            if (this.TimeSetData.endDT) {
                let eDT = this.TimeSetData.endDT;
                eDT.setMinutes(Math.round(eDT.getMinutes() / 10) * 10);
                this.TimeSetData.endDT = eDT;
                // let endStr = this.getFileNameformData(eDT);
            } else {
                this.TimeSetData.endDT = new Date(Number(this.TimeSetData.startDT) + 1000 * 60 * 10);
            }

            // !!!!!!!!!!!!!!!!!!!!!!this.getRadarOneData(startStr);
            // this.StopAnimation();

            this.animation = this.animate(this.TimeSetData.startDT, this.TimeSetData.endDT);
            console.log(this.animation);
        },

        async getRadarOneData(dateStr) {
            const _self = this;
            const view = this.$store.getters._getDefaultView;
            const [GeoJSONLayer] = await loadModules(['esri/layers/GeoJSONLayer'], config.options);

            const resultLayer = view.map.findLayerById('GeoJSON');
            if (resultLayer) {
                view.map.remove(resultLayer);
            }
            // ！图例是要加，但是估计的自己设计样式并且初始化
            // view.ui.add(
            //     new Legend({
            //         view: view,
            //     }),
            //     'bottom-left',
            // );
            // ~这legend加的是什么？ 好像是图例
            // 官网翻译：“图例”微件描述用于表示地图中图层的符号。此微件中使用的所有符号和文本均在图层的渲染器中进行配置。图例将仅显示在视图中可见的图层和子图层

            // //取数据
            let dateDir = dateStr.slice(0, 10);
            // let dateFile=dateStr
            // const url = 'http://localhost:80/vuegis/static/data/' + dateDir + '/GeoData' + dateStr + '.json';

            // JSON 数据转 url 的方法
            const json = require(`../../Mock/GeoData${dateStr}.json`);
            const blob = new Blob([JSON.stringify(json)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);

            console.log({ json, url });
            this.NowTimeStr = dateStr;

            // await this.choiceType(); //①估计要改为promise
            const referenceScale = 9244650;
            await this.choiceType(this.TimeSetData.DataType);
            //GEOJSONlayer默认经纬度坐标系 WGS84

            const renderer = {
                type: 'simple', // autocasts as new SimpleRenderer()
                symbol: {
                    type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                    // Arrow marker
                    path: 'M14.5,29 23.5,0 14.5,9 5.5,0z', // The SVG path of the icon.
                    color: [250, 250, 250],
                    outline: {
                        color: [255, 255, 255, 0.5],
                        width: 0.5
                    },
                    angle: 180,
                    size: 15
                },
                visualVariables: [
                    {
                        type: 'rotation',
                        field: this.FiledRatation,
                        rotationType: 'geographic' //这估计要改  不用，这是正北方向开始计算角度
                    },
                    {
                        type: 'color',
                        field: this.FiledColor,
                        stops: this.steps
                    },
                    {
                        type: 'size',
                        field: this.FiledColor,
                        minDataValue: 0,
                        maxDataValue: this.FieldSize,
                        minSize: {
                            type: 'size',
                            valueExpression: view.scale,
                            // adjust the min size by scale
                            stops: [
                                { value: referenceScale, size: 8 },
                                { value: referenceScale * 2, size: 6 },
                                { value: referenceScale * 4, size: 4 },
                                { value: referenceScale * 8, size: 2 }
                            ]
                        },
                        maxSize: {
                            type: 'size',
                            valueExpression: view.scale,
                            // adjust the max size by scale
                            stops: [
                                { value: referenceScale, size: 20 },
                                { value: referenceScale * 2, size: 15 }
                                // { value: referenceScale * 4, size: 12 },
                                // { value: referenceScale * 8, size: 10 },
                            ]
                        }
                    }
                ]
            };

            let template = {
                title: '{coordinates}详细信息',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: [
                            {
                                fieldName: 'WaveHs',
                                label: '浪高'
                            },
                            {
                                fieldName: 'WaveDir',
                                label: '浪向'
                            },
                            {
                                fieldName: 'WaveCredit',
                                label: '置信度'
                            },
                            {
                                fieldName: 'WindVelocity',
                                label: '风速'
                            },
                            {
                                fieldName: 'WindDir',
                                label: '风向'
                            },
                            {
                                fieldName: 'WindFetch',
                                label: '风区'
                            },
                            {
                                fieldName: 'Current',
                                label: '流速'
                            },
                            {
                                fieldName: 'CurDirection',
                                label: '流向'
                            },
                            {
                                fieldName: 'CurCredit',
                                label: '置信度（流）'
                            }
                        ]
                    }
                ]
            };

            const geojsonLayer = new GeoJSONLayer({
                id: 'GeoJSON',
                url: url,
                popupTemplate: template,
                renderer: renderer
            });
            view.map.add(geojsonLayer);

            geojsonLayer.on('update-end', function (e) {
                view.map.setExtent(e.target.extent.expand(1.2));
            });
        },
        // ！图例是要加，但是估计的自己设计样式并且初始化 0412

        ChangeInterval() {},

        closeTimeInfoPannel() {
            const currentVisible = this.$store.getters._getDefaultTimeInfoVisible;
            this.$store.commit('_setDefaultTimeInfoVisible', !currentVisible);
        }
    }
};
</script>

<style>
.TimeInfoComponent-pannel {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 280px;
    height: 380px;
    background-color: #fff;
}
.TimeInfoComponent-header {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.TimeInfoComponent-header > span {
    line-height: 35px;
    font-size: 16px;
    font-weight: 600;
}

/* .TimeInfo-select-pannel {
    width: 100%;
    height: 30px;
    padding: 0 5px;
    box-sizing: border-box;
    margin: 5px 0;
    font-size: 13px;
} */
.TimeInfo-span-label {
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 28px;
    padding: 0 12px 0 12px;
    box-sizing: border-box;
}
.city-item {
    font-size: 12px;
    color: #5f6477;
    font-weight: 600;
    cursor: pointer;
}
.county-item {
    font-size: 12px;
    color: #999;
    margin: 0 10px 5px 0;
    cursor: pointer;
}
.county-item:hover {
    color: #409eff;
}
</style>
