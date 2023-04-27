const fs = require('fs');

// 读取GeoJSON文件
const geojson = fs.readFileSync('./20210806_0010.json');

// 将JSON字符串解析为JavaScript对象
const geojsonData = JSON.parse(geojson);

// 过滤掉WaveHs为空的点数据
geojsonData.features = geojsonData.features.filter((feature) => feature.properties.WaveHs !== null);

// 将JavaScript对象转换为JSON字符串
const filteredGeojson = JSON.stringify(geojsonData);

// 将过滤后的GeoJSON写入文件
// fs.writeFileSync('./Wind/20210806_0010.geojson', filteredGeojson);
fs.writeFileSync('./Wave/20210806_0010.json', filteredGeojson);
