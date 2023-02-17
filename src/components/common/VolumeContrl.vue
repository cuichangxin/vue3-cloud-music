<template>
  <div class="volume_wrap">
    <el-slider v-model="volume" vertical />
  </div>
</template>
<script setup>
import { ref } from 'vue'
const volume = ref(100)
</script>
<style lang="less" scoped>
.volume_wrap{
  width: 60px;
  height: 80px;
  background: #fff;
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
