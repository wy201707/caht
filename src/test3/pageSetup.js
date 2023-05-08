
import { loadModules } from 'esri-loader';
var options={
    url:'https://js.arcgis.com/4.21/',
    css:'https://js.arcgis.com/4.21/esri/css/main.css'
}

// import MapView from"esri/views/MapView"
// import Map from  "esri/Map"
// import Point from  "esri/geometry/Point"
// import  SpatialReference from  "esri/geometry/SpatialReference"
// import  Basemap from "esri/Basemap"
// import animatedEnvironmentLayer_1 from "./animatedEnvironmentLayer"
    // Object.defineProperty(exports, "__esModule", { value: true });

/* const [MapView, Map, Point, SpatialReference, Basemap, on, dom, animatedEnvironmentLayer_1] = await loadModules(
        [ "esri/views/MapView", "esri/Map", "esri/geometry/Point", "esri/geometry/SpatialReference", "esri/Basemap", "dojo/on", "dojo/dom", "./animatedEnvironmentLayer"],
        options
); */
const [MapView, Map, Point, SpatialReference, Basemap,  animatedEnvironmentLayer_1] = await loadModules(
    [ "esri/views/MapView", "esri/Map", "esri/geometry/Point", "esri/geometry/SpatialReference", "esri/Basemap", "./aeLayer"],
    options
);
    var PageSetup = /** @class */ (function () {
        function PageSetup() {
            this._dataOptions = [];
        }
        PageSetup.prototype.init = function () {
            var _this = this;
            this._initDataOptions();
            // var satellite = Basemap.fromId("satellite");
            var darkgray = Basemap.fromId("dark-gray");
            this.map = new Map({
                basemap: darkgray //satellite
            });
            this.mapView = new MapView({
                container: "map-view",
                center: new Point({ x: 118.36, y: 23.4, spatialReference: new SpatialReference({ wkid: 4326 }) }),///&&&&
                // center: new Point({ x: 128, y: -24, spatialReference: new SpatialReference({ wkid: 4326 }) }),
                zoom: 9, ///&&&&
                // zoom: 4,
                map: this.map,
                ui: { components: ["compass", "zoom"] }
            });
            this.mapView.ui.move("zoom", "bottom-right");
            // this.mapView.ui.move("compass", "bottom-right");
            var ausSwell = {
                url: "./data/auswave_pop_flds_combined.json",
                id: "Australian swell",
                displayOptions: {
                    maxVelocity: 5,
                    lineWidth: 5,
                    particleAge: 90,//30
                }
            };
            this.environmentLayer = new animatedEnvironmentLayer_1.AnimatedEnvironmentLayer({
                id: "ael-layer",
                url: this._dataOptions[0].url,
                displayOptions: this._dataOptions[0].displayOptions
            });
            this._dataOptions.push(ausSwell);

            this.map.add(this.environmentLayer);
            //setup some event handlers to react to change of options       
            /* on(dom.byId("data-select"), "change", function (evt) { return _this._dataChange(evt.target.value); });
            on(dom.byId("basemap-select"), "change", function (evt) { return _this._basemapChange(evt.target.value); }); */
            // subscribe to the point-report event and display the values in UI.
            // var windLayerAny = this.environmentLayer;
           /*  windLayerAny.on("point-report", function (rpt) {
                dom.byId("direction").innerHTML = rpt.degree ? rpt.degree.toFixed(1) : "n/a";
                dom.byId("speed").innerHTML = rpt.velocity ? rpt.velocity.toFixed(2) : "n/a";
                // dom.byId("zoomI").innerHTML = rpt.zoom ? rpt.zoom.toFixed(2) : "无法显示zoom";
            }); */
            //this.listenOnDevicePixelRatio();
        };

        //①
      /*   PageSetup.prototype._dataChange = function (id) {
            var opt = undefined;
            for (var i = 0, len = this._dataOptions.length; i < len; i++) {
                if (this._dataOptions[i].id === id) {
                    opt = this._dataOptions[i];
                    break;
                }
            }
            if (!opt)
                return;
            this.environmentLayer.displayOptions = opt.displayOptions;
            this.environmentLayer.url = opt.url;
        }; */
        /**
         * Seed some options for data
         */
        //②
/*         PageSetup.prototype._initDataOptions = function () {

            var ausSwell = {
                url: "./data/auswave_pop_flds_combined.json",
                id: "Australian swell",
                displayOptions: {
                    maxVelocity: 5,
                    lineWidth: 5,
                    particleAge: 90,//30
                }
            };
            this._dataOptions.push(ausSwell);

            var select = dom.byId("data-select");
            this._dataOptions.forEach(function (opt) {
                var element = document.createElement("option");
                element.id = opt.id;
                element.innerHTML = opt.id;
                select.appendChild(element);
            });
        }; */
        //③
        PageSetup.prototype.customDrawFunction = function (context, particle, colorStyle) {
            // draw a circle and make the radius a factor of the magnitude
            var radius = particle.currentVector[2] / 40;
            // var radius = particle.currentVector[2] / 8;
          
            context.beginPath();
            // console.log('为什么没变？',context.lineWidth) //0.000几到2.几确实看不出来
            context.lineWidth = Math.ceil(context.lineWidth * (1 / 3) + particle.currentVector[2] * (2 / 3))
            context.fillStyle = colorStyle;
            context.arc(particle.x, particle.y, radius, 0, 2 * Math.PI);
            //多花了个圆形，这个圆形和痕迹不是一个颜色行不行？
/*             可以花三角形，
context.moveTo(particle.x, particle.y - radius);
context.lineTo(particle.x + radius, particle.y + radius);
context.lineTo(particle.x - radius, particle.y + radius); */
            context.fill();
        };
//④
        PageSetup.prototype.customFadeFunction = function (context, bounds) {
            //函数功能：调整透明度、轨迹叠加方式、或者清除轨迹只展示粒子
            // Fade existing particle trails
            context.globalCompositeOperation = "destination-in"; //现有痕迹留下烟雾状痕迹
            // context.globalCompositeOperation = "darken";//重叠地区颜色叠加，取更暗的像素
            // context.globalCompositeOperation = "multiply";//重叠地区颜色叠加，稍 微变暗
            context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            context.globalCompositeOperation = "lighter";
            // context.globalAlpha = 0.85;//轨迹叠加严重，亮度太高，只能降低一点轨迹重合的可能
            context.globalAlpha = 0.9;//轨迹叠加严重，亮度太高，只能降低一点轨迹重合的可能

            // perhaps you don't want a trail and just want it cleared between each frame - then just use the below line.
            // context.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);
        };
        //⑤ 底图切换就这么 容易？？那我之前是不是整复杂了  冷静，不是重点
        PageSetup.prototype._basemapChange = function (id) {
            var bm = Basemap.fromId(id);
            this.map.basemap = bm;
        };
        return PageSetup;
    }());
    // exports.PageSetup = PageSetup;

export default {PageSetup}
//# sourceMappingURL=pageSetup.js.map