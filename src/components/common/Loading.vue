<template>
  <div class="loading">
    <div class="wrap">
      <img src="../../assets/loading/loading.gif" alt="">
      <p>加载中...</p>
    </div>
  </div>
</template>
<script setup>
</script>
<style lang="less" scoped>
.loading {
  display: flex;
  justify-content: center;

  .wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    p{
      font-size: 13px;
      color: rgb(146, 143, 143);
    }
  }

  img {
    width: 50px;
    height: 50px;
  }
}
</style>
