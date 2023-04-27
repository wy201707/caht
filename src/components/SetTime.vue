<template>
    <div class="settime-pannel" v-show="this.$store.getters._getTimePanelVisible">
        <div class="settime-header">
            <!-- <div class="settime-header" v-show="true"> -->
            <span>时间参数设置</span>
            <i class="el-icon-close" @click="closeTimePanel"></i>
            <!-- <i class="el-icon-close" @click="$emit('close')"></i> -->
        </div>
        <el-date-picker v-model="date" type="date" :picker-options="{ firstDayOfWeek: 1 }" placeholder="选择日期">
        </el-date-picker>
        <el-time-picker
            v-model="time"
            :picker-options="{ start: '00:00', step: '00:10', end: '23:50' }"
            placeholder="选择时间"
        >
        </el-time-picker>
    </div>
</template>
<!-- 选择时间后，专题图层页可以做成左边栏下拉选项（去掉面板），点击后直接出图片，大不了加一个 < > 图标 还有显示图标，如果可以还有图例图标，如果再加就是点击图例，只显示图例范围风向-->
<script>
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
            date: '',
            time: ''
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
        this.$store.commit('_setTimeSelected', this.date + this.time);
        console.log('当前选择时间', this.date + this.time);
    }
};
</script>

<style>
.settime-pannel {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 240px;
    height: 300px;
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
}
</style>
