<template>
  <div>
    <el-slider v-model="progress" :show-tooltip="false" :min="0" :max="progressDetail.duration" @mouseenter.native="slider_enter"
      @mouseleave.native="slider_leave" @change="slider_change" @input="slider_input" />
  </div>
</template>
<script setup>
import { ref, onMounted,watch } from 'vue';

const p = defineProps({
  progressDetail:{
    type:Object
  }
})
const emit = defineEmits(['progress_time','progress_curr'])

const progress = ref(0)
const slider = ref(null)
watch(p.progressDetail,(n)=>{
  // console.log(n);
  progress.value = n.currentTime
})

const slider_enter = () => {
  slider.value.style.display = 'block'
}
const slider_leave = () => {
  slider.value.style.display = 'none'
}
const slider_change = (val)=> {
  emit('progress_curr',val)
}
const slider_input = (val) => {
  // console.log(val);
  emit('progress_time',val)
}
onMounted(() => {
  slider.value = document.getElementsByClassName('el-slider__button-wrapper')[0]
})
</script>
<style lang="less" scoped>
.el-slider {
  height: 6px;
}

:deep(.el-slider__runway) {
  height: 2px;

  .el-slider__bar {
    height: 2px;
    background: rgb(210, 21, 21);
  }

  .el-slider__button-wrapper {
    display: none;
    top: -17px;

    .el-slider__button {
      width: 12px;
      height: 12px;
      border: none;
      background: rgb(210, 21, 21);
    }
  }
}
</style>
