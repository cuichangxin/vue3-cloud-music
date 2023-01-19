<template>
  <div class="main-box">
    <Header></Header>
    <div class="page_flex">
      <Menu></Menu>
      <RouterView class="right-width" v-if="isRouteView" />
    </div>
  </div>
</template>

<script setup>
import { nextTick, provide, ref } from 'vue'
import Header from './components/common/Header.vue'
import Menu from './components/common/Menu.vue'

provide('reload', {
  reload
})
const isRouteView = ref(true)
async function reload() {
  isRouteView.value = false
  await nextTick()
  isRouteView.value = true
  console.log('替换了');
}
</script>

<style lang="less" scoped>
.main-box {
  width: 1200px;
  height: 700px;
  border-radius: 20px;
  background: #666;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .page_flex {
    display: flex;

    .right-width {
      width: calc(1200px - 260px);
    }
  }
}
</style>
