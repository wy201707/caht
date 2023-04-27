<template>
    <div class="datetime-picker">
      <div class="datetime-picker-row">
        <div class="datetime-picker-col">
          <span class="datetime-picker-label">年</span>
          <el-select v-model="year" placeholder="请选择年份" @change="updateDate">
            <el-option v-for="year in years" :key="year" :label="year" :value="year"></el-option>
          </el-select>
        </div>
        <div class="datetime-picker-col">
          <span class="datetime-picker-label">月</span>
          <el-select v-model="month" placeholder="请选择月份" @change="updateDate">
            <el-option v-for="month in months" :key="month" :label="month" :value="month"></el-option>
          </el-select>
        </div>
        <div class="datetime-picker-col">
          <span class="datetime-picker-label">日</span>
          <div class="datetime-picker-day">
            <span v-for="day in days" :key="day" class="datetime-picker-day-item" :class="{ 'datetime-picker-day-active': day === selectedDay }" @click="selectDay(day)">{{ day }}</span>
          </div>
        </div>
      </div>
      <div class="datetime-picker-row">
        <div class="datetime-picker-col">
          <span class="datetime-picker-label">时</span>
          <el-select v-model="hour" placeholder="请选择小时" @change="updateTime">
            <el-option v-for="hour in hours" :key="hour" :label="hour" :value="hour"></el-option>
          </el-select>
        </div>
        <div class="datetime-picker-col">
          <span class="datetime-picker-label">分</span>
          <el-select v-model="minute" placeholder="请选择分钟" @change="updateTime">
            <el-option v-for="minute in minutes" :key="minute" :label="minute" :value="minute"></el-option>
          </el-select>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DatetimePicker',
    data() {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const day = now.getDate()
      const hour = now.getHours()
      const minute = Math.floor(now.getMinutes() / 10) * 10
      return {
        year,
        month,
        day,
        hour,
        minute,
        selectedDay: day,
        years: Array.from({ length: 10 }, (_, i) => year - i),
        months: Array.from({ length: 12 }, (_, i) => i + 1),
        hours: Array.from({ length: 24 }, (_, i) => i),
        minutes: Array.from({ length: 6 }, (_, i) => i * 10)
      }
    },
    methods: {
      updateDate() {}
    }
    
}
  