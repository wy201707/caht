<template>
    <div id="sceneview"></div>
</template>

<script>
import { loadModules } from 'esri-loader';
// import {loadScript, loadCss, loadModules} from 'esri-loader'
// import * as esriLoader from "esri-loader";

export default {
    name: 'App',
    components: {},
    methods: {
        //创建三维场景
        __createSceneView: function () {
            let options = {
                url: 'https://js.arcgis.com/4.14/',
                css: 'https://js.arcgis.com/4.14/esri/themes/light/main.css',
            };
            loadModules(['esri/Map', 'esri/views/SceneView'], options).then(([Map, SceneView]) => {
                const map = new Map({
                    basemap: 'streets',
                    ground: 'world-elevation',
                });
                const view = new SceneView({
                    container: 'sceneview', // Reference to the DOM node that will contain the view
                    map: map, // References the map object created in step 3
                });

                console.log(view);
            });
        },
    },
    mounted: function () {
        /*  if(!esriLoader.isLoaded()){
      
      esriLoader.bootstrap(
          err => {
            if (err) {
              console.error(err);
            } else {
              this.importEsri();
            }
          },
          {
            url: "/static/arcgis_js_v49_api/arcgis_js_api/library/4.9/init.js"
          }
        );
      } else {
        this.importEsri();
      }

     */
        // loadScript({ url: 'https://js.arcgis.com/4.23/' })
        // loadCss('https://js.arcgis.com/4.23/esri/themes/light/main.css')

        this.__createSceneView();
    },
};
</script>

<style>
html,
body,
#sceneview {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
}
</style>
