<template>
    <div class="TimeInfoOneComponent-pannel" v-show="this.$store.getters._getDefaultOneRadarVisible">
        <div class="TimeInfoOneComponent-header">
            <span>专题图层参数设置</span>
            <i class="el-icon-close" @click="closeTimeInfoOnePannel"></i>
        </div>

        <el-form ref="TimeSetData" :model="TimeSetData" label-width="80px" size="small">
            <el-form-item label="选择时间">
                <el-col :span="22">
                    <el-date-picker
                        v-model="TimeSetData.startDT"
                        type="datetime"
                        placeholder="选择日期时间"
                        :default-value="new Date('2021-08-05 00:10:00')"
                        style="width: 100%"
                    >
                    </el-date-picker>
                </el-col>
            </el-form-item>

            <el-form-item label="专题类型">
                <el-radio-group v-model="TimeSetData.DataType">
                    <el-radio :label="1" style="display: block">风 </el-radio>
                    <el-radio :label="2" style="display: block">浪</el-radio>
                    <el-radio :label="3" style="display: block">流</el-radio>
                </el-radio-group>
                <!-- 希望之后可以做成多选（如果他需要的话）
                <el-checkbox-group v-model="form.type">
                    <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                    <el-checkbox label="地推活动" name="type"></el-checkbox>
                    <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                    <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group> -->
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">显示</el-button>
                <!-- <el-button @click="ContinueAnimation('TimeSetData')">暂停</el-button> -->
                <el-button @click="ClearData">清除图层</el-button></el-button>
                <!-- <el-button @click="ContinueAnimation">继续</el-button> -->
            </el-form-item>
        </el-form>

        <!-- <div class="TimeInfoOneComponent-footer">
            <el-row>
                <el-col :span="9"><span class="TimeInfo-span-label">读取文件</span></el-col>
                <el-col :span="15"
                    ><span class="TimeInfo-span-label">{{ NowTime }}</span></el-col
                > 这个日期显示不完整，右边有莫名其妙的空格，与flex有关  BUG0416
            </el-row>
        </div> -->
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from './config';
export default {
    name: 'TimeInfoOne',
    components: {},
    /*     mounted: function () {
        this.getWindData();
    }, */
    data() {
        return {
            TimeSetData: {
                startDT: '',
                DataType: 1 //默认不跨天
            },
            NowTimeStr: '2021-08-05-00-10',
            FiledRatation: '',
            FiledColor: '',
            steps: [],
            stops: [],
            SaveTime: '',
            path:'',
            DataTypeStr:'Wind',
            iconAngle:0,
            fieldInfos:[]
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

        choiceType() {
            // console.log('choiceType', this.TimeSetData.DataType);
            switch (this.TimeSetData.DataType) {
                case 1:
                    this.FiledRatation = 'WindDir';
                    this.FiledColor = 'WindVelocity';
                    this.steps = [
                        // { value: -1, color: '#b0e0e6' },
                        { value: 0, color: '#87cefa', lable: '<0' },
                        { value: 2.5, color: '#2b83ba', lable: '1.6' },
                        { value: 5, color: '#abdda4', lable: '5.5' },
                        { value: 12, color: '#ffffbf', lable: '8.0' },
                        { value: 19, color: '#fdae61', lable: '13.9' },
                        { value: 26, color: '#d7191c', lable: '20.8' },
                        { value: 30, color: '#ffffff', lable: '30' }  //BUG 0418
                    ];
             
                    this.FieldSize = 35;
                    this.path= 'M14.5,29 23.5,0 14.5,9 5.5,0z',
                    this.DataTypeStr='Wind'
                    this.iconAngle=0
                    this.fieldInfos=[
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
                        ]
                    break;
                case 2:
                    this.FiledRatation = 'WaveDir';
                    this.FiledColor = 'WaveHs';
                    this.steps = [
                        // { value: -1, color: '#b0e0e6' },
                        { value: 0, color: '#87cefa', lable: '<0' },
                        { value: 0.5, color: '#2b83ba', lable: '0.4' },
                        { value: 1, color: '#abdda4', lable: '0.8' },
                        { value: 2, color: '#ffffbf', lable: '1.5' },
                        { value: 3, color: '#fdae61', lable: '2.3' },
                        { value: 4, color: '#d7191c', lable: '3.0' },
                        { value: 5.3, color: '#ffffff', lable: '>4.0' }
                    ];

                    this.FieldSize =6;
                    // this.path= 'm592.47416,377.15067l-8.69565,-40.04923l140.65731,85.97603l-130.8747,101.19343l5.43478,-31.68125c4.32155,-37.18737 -77.10763,-33.03187 -109.15668,-34.12847c-32.04906,-1.0966 -86.45711,-2.0105 -128.09332,2.83723c-41.63621,4.84773 92.7525,-21.04935 136.96869,-32.54894c28.46084,-7.84719 108.50971,-18.14373 93.75956,-51.59879z'
                    this.path='m336.6306,559.92278c30.93451,0 56.00927,-25.51988 56.00927,-56.99999c0,-31.48017 -25.07476,-57 -56.00927,-57c-30.93299,0 -56.0093,25.51983 -56.0093,57c0,31.4801 25.0763,56.99999 56.0093,56.99999zm8.99824,-95.13614l13.62737,13.87599l-23.84281,24.26314l23.84281,24.26461l-13.62737,13.87141l-37.46892,-38.13602l37.46892,-38.13914l0,0z'
                    this.DataTypeStr='Wave'
                    this.iconAngle=0//-90//0
                    this.fieldInfos=[
                            {
                                fieldName: 'WaveHs',
                                label: '浪高'
                            },
                            {
                                fieldName: 'WaveDir',
                                label: '浪向'
                            },
                            
                    ]
                    break;
                case 3:
                    this.FiledRatation = 'CurDirection';
                    this.FiledColor = 'Current';
                    this.path='m453.97684,246.46451l-8.71911,-40.04923l141.03686,85.97603l-131.22786,101.19343l5.44945,-31.68125c4.33321,-37.18737 -77.3157,-33.03187 -109.45123,-34.12847c-32.13554,-1.0966 -86.69041,-2.0105 -128.43897,2.83723c-41.74856,4.84773 93.00279,-21.04935 137.33829,-32.54894c28.53764,-7.84719 108.80251,-18.14373 94.01256,-51.59879l0.00001,-0.00001z'
                    // this.path='m336.6306,559.92278c30.93451,0 56.00927,-25.51988 56.00927,-56.99999c0,-31.48017 -25.07476,-57 -56.00927,-57c-30.93299,0 -56.0093,25.51983 -56.0093,57c0,31.4801 25.0763,56.99999 56.0093,56.99999zm8.99824,-95.13614l13.62737,13.87599l-23.84281,24.26314l23.84281,24.26461l-13.62737,13.87141l-37.46892,-38.13602l37.46892,-38.13914l0,0z'
                    this.steps = [
                        { value: 0, color: '#87cefa', lable: '<0' },
                        { value: 20, color: '#2b83ba', lable: '20' },
                        { value: 40, color: '#abdda4', lable: '40' },
                        { value: 60, color: '#ffffbf', lable: '60' },
                        { value: 80, color: '#fdae61', lable: '80' },
                        { value: 95, color: '#d7191c', lable: '95' },
                        { value: 150, color: '#ffffff', lable: '>110' }
                    ];
                    this.FieldSize = 200;
                    this.path= 'm592.47416,377.15067l-8.69565,-40.04923l140.65731,85.97603l-130.8747,101.19343l5.43478,-31.68125c4.32155,-37.18737 -77.10763,-33.03187 -109.15668,-34.12847c-32.04906,-1.0966 -86.45711,-2.0105 -128.09332,2.83723c-41.63621,4.84773 92.7525,-21.04935 136.96869,-32.54894c28.46084,-7.84719 108.50971,-18.14373 93.75956,-51.59879z'
                    this.DataTypeStr='Current'
                    //this.iconAngle=90//180//0//90//0//-90
                    this.iconAngle=85//图标本来的翻转
                    this.fieldInfos=[
                           
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
                    break;
                default:
                    console.log('单选项返回值出错');
            }
            return this.DataTypeStr
        },
        ClearData() {
            console.log(' ClearData');

            const view = this.$store.getters._getDefaultView;
            const resultLayer = view.map.findLayerById('GeoJSON');
            if (resultLayer) {
                view.map.remove(resultLayer);
            }
        },
        onSubmit() {
            console.log('on submit!');

            const view = this.$store.getters._getDefaultView;
            const resultLayer = view.map.findLayerById('GeoJSON');
            if (resultLayer) {
                view.map.remove(resultLayer);
            }
            // 先修理在格式化
            console.log(this.TimeSetData);
            if (this.TimeSetData.startDT) {
                let sDT = this.TimeSetData.startDT;
                sDT.setMinutes(Math.round(sDT.getMinutes() / 10) * 10);
                console.log('分钟取整', sDT);
                this.TimeSetData.startDT = sDT;
            } else {
                this.TimeSetData.startDT = new Date('2021/08/05 0:10:00');
            }
            this.NowTimeStr = this.getFileNameformData(new Date(this.TimeSetData.startDT));
            this.getRadarOneData(this.NowTimeStr);
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

            // await this.choiceType(); //①估计要改为promise
            const referenceScale = 9244650;
            this.DataTypeStr= await this.choiceType(this.TimeSetData.DataType);
            //GEOJSONlayer默认经纬度坐标系 WGS84



            // //取数据
            let dateDir = dateStr.slice(0, 10);
            let NameStr = dateStr.slice(0, 4)+dateStr.slice(5, 7)+dateStr.slice(8, 10)+'_'+dateStr.slice(11, 13)+dateStr.slice(14, 16);
            console.log('dateStr',dateStr,'dateDir',dateDir,'NameStr',NameStr,'this.DataTypeStr',this.DataTypeStr)
            // let dateFile=dateStr
            // let dateFile=dateStr
            // const url = 'http://localhost:80/vuegis/static/data/' +this.DataTypeStr+'/'+ dateDir + '/' +  NameStr  + '.json';
            // const url = 'http://localhost:80/vuegis/static/data/' + dateDir + '/' +  NameStr  + '.json';
            // const url = 'http://localhost:80/vuegis/statics/data/' + dateDir + '/GeoData' + dateStr + '.json';
            // const url = 'http://localhost:80/vuegis/statics/data/2021-08-05/GeoData2021-08-05-00-10.json'
// const url='http://localhost/vuegis/static/data/2021-09-12/GeoData2021-09-12-00-10.json'
            // http://localhost/vuegis/static/data/2021-08-05/GeoData2021-08-05-00-10.json
            // const url='http://localhost/vuegis/static/data/2021-08-05/GeoData2021-08-05-00-10.json'
            // const url='http://localhost/vuegis/static/data/Wind/2021-08-06/20210806_0010_wind.json'
            // const url='http://localhost/vuegis/static/data/2021-08-06/20210806_0010_wind.json'
            // const url='http://localhost/vuegis/static/data/2021-08-06/20210806_0010_wave.json'
            //^^^***
            const url='http://localhost/vuegis/static/data/2021-08-06/20210806_0010_cur.json'
            //C:\inetpub\wwwroot\vuegis\static\data\Wind\2021-08-06

             console.log('url',url)
            this.NowTimeStr = dateStr;



            const renderer = {
                type: 'simple', // autocasts as new SimpleRenderer()
                symbol: {
                    //0412 这里直接改为choice决定
                    type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                    // Arrow marker
                    path: this.path,
                    // path: 'M14.5,29 23.5,0 14.5,9 5.5,0z',
                    // path: 'M14.5,29 23.5,0 14.5,9 5.5,0z', // The SVG path of the icon.
                    // path: 'M18.081 20c0.888-1.61 1.038-4.065-2.452-3.983v1.983l-3-3 3-3v1.94c4.179-0.109 4.645 3.689 2.452 6.060z', // The SVG path of the icon.
                    // path: 'M13.7 6.3-5-5c-0.391-0.391-1.024-0.391-1.414 0l-5 5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l3.293-3.293v9.586c0 0.553 0.448 1 1 1s1-0.447 1-1v-9.586l3.293 3.293c0.195 0.195 0.451 0.293 0.707 0.293s0.512-0.098 0.707-0.293c0.391-0.391 0.391-1.024 0-1.414z',
                    //尖尖的，和原来的差不多 path: 'm305.84101,300l-57.84101,-36.00001l104,36.00001l-104,35.99999l57.84101,-35.99999z',
                    //胖胖的箭头有 path: 'm65.17751,79.00633l9.16537,-18.18092l9.16537,18.18092l-18.33074,0z',
                    //弯曲歪箭头 path: 'm244.85417,427.41667c15,-64 -16,-39 -16.85417,-39.41667c0.85417,0.41667 30.85417,-25.58333 30,-26',
                    //和原来差不多，知识胖胖变弯曲了 path: 'm402.08257,291.03952c3.73043,-8.68184 -9.41582,13.41225 -9.35626,13.41225c0.05955,0 22.27446,-0.15735 16.00736,-1.33144c-6.2671,-1.1741 -10.38153,-3.39897 -6.6511,-12.08081z',
                    //区别不大，稍微瘦了一点，和第一种更像了path: 'm400.12349,293.0289c3.12267,-5.34451 -8.20226,8.32805 -8.1566,8.32805c0.04565,0 16.21102,-2.60411 11.16558,-2.81582c-5.04544,-0.21171 -6.13165,-0.16772 -3.00898,-5.51223z',
                    //！自己花的箭头，不错：path: 'm592.47416,377.15067l-8.69565,-40.04923l140.65731,85.97603l-130.8747,101.19343l5.43478,-31.68125c4.32155,-37.18737 -77.10763,-33.03187 -109.15668,-34.12847c-32.04906,-1.0966 -86.45711,-2.0105 -128.09332,2.83723c-41.63621,4.84773 92.7525,-21.04935 136.96869,-32.54894c28.46084,-7.84719 108.50971,-18.14373 93.75956,-51.59879z',
                    //!可爱小圆片 path: 'm336.6306,559.92278c30.93451,0 56.00927,-25.51988 56.00927,-56.99999c0,-31.48017 -25.07476,-57 -56.00927,-57c-30.93299,0 -56.0093,25.51983 -56.0093,57c0,31.4801 25.0763,56.99999 56.0093,56.99999zm8.99824,-95.13614l13.62737,13.87599l-23.84281,24.26314l23.84281,24.26461l-13.62737,13.87141l-37.46892,-38.13602l37.46892,-38.13914l0,0z',
                    //弯刀，过了 path: 'm434.97113,709.86926l0,0c-83.93984,0 -152.00001,-38.27292 -152.00001,-85.49998c0,-47.22102 68.06017,-85.49999 152.00001,-85.49999l0,0c-94.88842,30.96264 -123.95809,49.98475 -127.19038,89.50141c4.23036,30.67665 31.79502,53.25942 127.19038,81.49856z',
                    // path: 'M444.59393,548.06132l20.05821,10.93965c-83.50862,-11.02098 -124.86539,-34.41495 -124.86539,-81.64201c0,-47.22102 47.34869,-74.4778 131.54726,-81.09039l-11.22618,5.56534c-47.83736,20.18313 -78.71881,44.7495 -76.91583,83.46241c4.6436,31.39925 19.00962,40.74999 61.40193,62.76501l0,-0.00001L416.52103,553.8935l6.50968,6.64513c-27.10185,-6.69453 -40.52375,-20.90486 -40.52375,-49.59223c0,-28.68371 15.36652,-45.24043 42.69228,-49.25715l-3.64334,3.38058c-15.52511,12.25994 -25.54736,27.18242 -24.96223,50.698c1.50703,19.07301 6.16938,24.75297 19.92735,38.12567z',
                    color: [250, 250, 250],
                    outline: {
                        color: [255, 255, 255, 0.5],
                        width: 0.5
                    },
                    // angle: 180,正北为0度顺时针，应该不用转呀
                    // angle: 0,
                    // angle: 90,//-90,//this.iconAngle,
                    angle:this.iconAngle,

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
                        valueExpression: `($feature.${this.FieldSize} / $view.scale) * 100`,
                        // adjust the size by scale
                        valueExpressionTitle: `Size (${this.FieldSize} / scale) * 100`

                        /* //控制大小 0412
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
                                { value: referenceScale, size: 16 },
                                { value: referenceScale * 2, size: 12 },
                                { value: referenceScale * 4, size: 8 },
                                { value: referenceScale * 8, size: 4 }
                            ]
                        }*/
                    }
                ]
            };

            let template = {
                title: '{coordinates}详细信息',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: this.fieldInfos
                    }
                ]
            };
            try {
                const geojsonLayer = new GeoJSONLayer({
                    id: 'GeoJSON',
                    url: url,
                    popupTemplate: template,
                    renderer: renderer
                });
                view.map.add(geojsonLayer);

                geojsonLayer.on('update-end', function (e) {
                    view.map.setExtent(e.target.extent.expand(1.2)); //BUG  不是BUG，就是看看咋缩放图好看的点
                });
            } catch (e) {
                console.log(e);
                this.$message({
                    message: '添加图层出错，无法显示数据',
                    type: 'warning'
                });
                return;
            }
        },
        closeTimeInfoOnePannel() {
            const currentVisible = this.$store.getters._getDefaultOneRadarVisible;
            this.$store.commit('_setDefaultOneRadarVisible', !currentVisible);
        }
    }
};
</script>

<style>
.TimeInfoOneComponent-pannel {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 290px;
    height:200px;
    background-color: #fff;
}
/* .TimeInfoOneComponent-header {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
} */
.TimeInfoOneComponent-header {
  width: 100%;
  height: 35px;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 5px;
  box-sizing: border-box;
  display: flex;
  text-align: center;
  justify-content: space-between;
  align-items: center;
}
.TimeInfoOneComponent-header > span {
    line-height: 35px;
    font-size: 16px;
    font-weight: 600;

  
}

.TimeInfoOne-span-label {
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 28px;
    /* padding: 0 12px 0 12px; */
    padding: 0 12px;
    box-sizing: border-box;
}
.TimeInfoOneComponent-footer {
    width: 100%;
    height: 20px;
    border-top: 1px solid #e4e7ed;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
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
