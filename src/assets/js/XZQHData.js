import { loadModules } from 'esri-loader';
const config = {
    options: {
        url: 'http://localhost:417/arcgis_js_api/library/4.17/init.js',
        css: 'http://localhost:417/arcgis_js_api/library/4.17/esri/css/main.css'
    }
};
const getProvinceData = async () => {
    console.log(this);
    const _self = this;
    //web发布的服务，的ArcGIS查询接口
    const [QueryTask, Query] = await loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query'], config.options);
    // 实例化QueryTask
    const queryTask = new QueryTask({
        // url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/ArcGIS/rest/services/Province_2020/FeatureServer/6',
        // url: 'https://services7.arcgis.com/BUin0xjr55RjybAu/ArcGIS/rest/services/Province_new/FeatureServer/6' 【online已经倒地方了】
        url: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/Province_Mercator/FeatureServer/17'
    });

    //实例化Query（不需要传参数），但是要指定以下三个属性的值
    let query = new Query();
    query.returnGeometry = false; //是否需要返回所查询信息的地理信息  ——行政区划查询面板不需要
    query.outFields = ['*']; //返回数据领域 ——返回所有
    query.where = '1=1'; //sql查询语句 ——返回所有

    //Promise then 链式调用
    // queryTask.execute()返回Promise对象
    // 这里还有另一种写法————async await 用法
    queryTask.execute(query).then(function (results) {
        let currentData = [];
        if (results.features.length > 0) {
            // 规范化传入的数据。链接element-UI 改这里！
            results.features.map((item) => {
                currentData.push({
                    value: item.attributes.ADM1_PCODE,
                    label: item.attributes.ADM1_ZH
                });
            });
            // console.log(currentData);
            _self.provinceOptions = currentData;
        } else {
            console.log('出现错误1');
        }
    });
};
