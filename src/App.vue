<template>
  <div class="main-box">
    <Header></Header>
    <Menu></Menu>
    <RouterView />
  </div>
</template>

<script setup>
import Header from './components/common/Header.vue'
import Menu from './components/common/Menu.vue'

</script>

<style scoped>
.main-box {
  width: 1400px;
  height: 900px;
  border-radius: 20px;
  background: #666;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
