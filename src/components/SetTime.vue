<template>
    <div class="settime-pannel" v-show="this.$store.getters._getTimePanelVisible">
        <div class="settime-header">
            <!-- <div class="settime-header" v-show="true"> -->
            <span>时间参数设置</span>
            <i class="el-icon-close" @click="closeTimePanel"></i>
            <!-- <i class="el-icon-close" @click="$emit('close')"></i> -->
        </div>
        <div class="picker-pannel">
            <!-- 1、写一个CSS，要和上面header对齐？ -->
            <el-date-picker
                v-model="selectedDate"
                type="date"
                :picker-options="{ firstDayOfWeek: 1 }"
                placeholder="选择日期"
            >
            </el-date-picker>
            <el-time-picker
                v-model="selectedTime"
                :picker-options="{ start: '00:00', step: '00:10', end: '23:50' }"
                placeholder="选择时间"
            >
            </el-time-picker>
            <br />
            <span>选定时间: <br />Date:{{ selectedDate }} &nbsp; time:{{ selectedTime }}</span>
        </div>
    </div>
</template>
<!-- 选择时间后，专题图层页可以做成左边栏下拉选项（去掉面板），点击后直接出图片，大不了加一个 < > 图标 还有显示图标，如果可以还有图例图标，如果再加就是点击图例，只显示图例范围风向-->
<script>
import moment from 'moment';
export default {
    name: 'SetTime',
    /*     props: {
        visible: {
            type: Boolean,
            required: true
        }
    }, */
    data() {
        return {
            selectedDate: '',
            selectedTime: '0:00',
            DateTime: null
            // TimePanelVisible: false
        };
    },

    methods: {
        closeTimePanel() {
            // this.visible = false;
            // this.$emit('closeTimePannel');
            this.$store.commit('_setTimePanelVisible', false);
        }
    },
    components: {},
    mounted: function () {},
    updated() {
        //监视一旦日期时间变化就触发
        /*         if (!this.time) {
            // 如果time为空，则设置为'00:00'
            this.time = '00:00';
        } */
        // var dateTime;
        if (this.selectedDate) {
            this.DateTime = new Date(this.selectedDate);
            if (this.selectedTime) {
                // console.log('原来的selectedTime', this.selectedTime);
                const [hour, minute] = moment(this.selectedTime, 'HH:mm:ss').format('HH:mm:ss').split(':');
                //这库不错
                // console.log('hour, minute', hour, minute);
                this.DateTime.setHours(hour);
                this.DateTime.setMinutes(Math.round(minute / 10) * 10);
            }
            // this.$store.commit('_setTimeSelected', this.DateTime);
            // console.log('当前选择时间', this.DateTime);
            this.$store.commit('_setTimeSelected', moment(this.DateTime).format('YYYYMMDD_HHmm'));
            // this.$store.commit('_setTimeSelected', '2021');
            console.log('当前选择时间', moment(this.DateTime).format('YYYYMMDD_HHmm'));
            //2.不能是这样简单拼合 ：重新new一个data，+ setXXX()就解决了
        } else {
            this.$store.commit('_setTimeSelected', new Date('2021/08/06 0:10')); //默认时间
        }
    }
};
</script>

<style>
.settime-pannel {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 240px;
    height: 200px;
    background-color: white;
}
.settime-header {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    text-align: center;
    align-items: center;
    /*     width: 100%;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
    padding: 5 10px;
   上下内边距为0，左右内边距为5像素
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;*/
}
.settime-header > span {
    line-height: 35px;
    font-size: 16px;
    font-weight: 600;
}
.picker-pannel {
    /* position: absolute; */
    top: 20px;
    left: 15px;
    width: 220px;
    height: 90px;
    background-color: white;
    margin-left: 5px;
    margin-top: 10px;
}
.picker-pannel > span {
    margin-top: 10px;
    line-height: 35px;
    font-size: 16px;
    font-weight: 400;
}
</style>
