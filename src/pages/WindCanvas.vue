<template>
    <!-- <div style="overflow: hidden"> -->
    <!-- <div style="position: absolute; width: 92%; height: 91%; background: #000"> -->
    <div style="position: relative; width: 100%; height: 100%; background: #000">
        <canvas id="windycanvas"></canvas>
        <el-button @click="showCanvas()">显示粒子动画</el-button>
    </div>
    <!-- </div> -->
</template>

<script>
import { loadModules } from 'esri-loader';

// 无法识别？import { CanvasWindy, CanvasWindField, CanvasParticle } from './../utils/Windy';
import { CanvasWindy, CanvasWindField, CanvasParticle } from './../utils/Windy';
import api from './../utils/axios';

export default {
    name: 'WindCanvas',
    data() {
        return {
            windyObj: null,
            windycanvas: null
        };
    },
    mounted() {
        this.windycanvas = document.getElementById('windycanvas');
    },
    methods: {
        resizeCanvas() {
            this.windycanvas.width = window.innerWidth;
            this.windycanvas.height = window.innerHeight;
            if (this.windy) {
                this.windy._resize(this.windycanvas.width, this.windycanvas.height);
            }
        },
        showCanvas() {
            // this.windycanvas = document.getElementById("windycanvas");
            // console.log('mounted可以拿到面板吗？', this.windycanvas);
            const time = '意思一下，具体注释查看axios GetWindyData';
            api.GetWindyData({ time }).then(({ data }) => {
                // console.log('返回？', data);
                this.resizeCanvas();
                window.onresize = this.resizeCanvas;
                try {
                    var params = {
                        // extent:[73.6666,135.0416,3.86666,53.55],//中国范围
                        canvas: windycanvas,
                        canvasWidth: window.innerWidth,
                        canvasHeight: window.innerHeight,
                        speedRate: 0.15,
                        particlesNumber: 10000,
                        maxAge: 120,
                        frameRate: 10,
                        color: '#5f6f8a', //'#e0761a',
                        lineWidth: 2
                    };
                    // console.log('引入了个啥？', CanvasWindy);
                    // var testObj = new CanvasWindy();
                    // console.log('testObj', testObj);
                    this.windyObj = new CanvasWindy(data, params);
                    // console.log('this.windy这应该是个类吧', this.windy);
                } catch (err) {
                    console.log(err);
                }
            });
        }
    }
};
</script>

<style scoped></style>
