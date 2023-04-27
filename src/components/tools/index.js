const config = {
/*     options: {
        url: 'https://js.arcgis.com/4.18/init.js',
        css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
    }, */
     options : {
        url: 'https://js.arcgis.com/4.18/',
        css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
    },
    centerPoints:[
        {
           'LongHai': [117.81813,24.44658]
        },
        {
            'Wuhan':[114.02919,30.58203]
            /* {
                Longitude:114.02919,
                latitude:30.58203
            } */
        },
        {
            'HanZhong':[107.03194, 33.06784]
        }
    ],
    TimeRangeConfig:{
         west : 116.7,
         east :  120,
         south : 25 ,
         north : 22.4,
         rows : 53,  
         cols : 57,//经度有57行
         dx : 0.05,
         dy : 0.05,
    },
       
    devtool: 'source-map',
       
        
    

};

export default config;