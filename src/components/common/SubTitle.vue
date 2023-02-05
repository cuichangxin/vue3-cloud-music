<template>
  <div class="title">
    <h4>
      <slot></slot>
    </h4>
    <i class="iconfont">&#xe65f;</i>
  </div>
</template>
<script setup>
</script>
<style lang="less" scoped>
.title {
  display: flex;
  cursor: pointer;

  h4 {
    font-size: 16px;
    margin-right: 4px;
  }
}
</style>
