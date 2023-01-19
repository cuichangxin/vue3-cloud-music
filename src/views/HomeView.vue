<template>
  <div class="home_page">
    <Swiper :banners="banners"></Swiper>
    <!-- <div @click="ger">123333333333331231231312312</div> -->
  </div>
</template>

<script setup>
import Swiper from '../components/page/Swiper.vue'
import $api from '../api/api'
import { reactive, inject } from 'vue';
// let ss = inject('reload')

let banners = reactive([])
$api.homePage().then((res) => {
  res.data.blocks.forEach(item => {
    if (item.blockCode == 'HOMEPAGE_BANNER') {
      item.extInfo.banners.forEach(v=>{
        banners.push(v)
      })
    }
  })
})
// function ger(){
//   ss.reload()
// }
</script>

<style lang="less" scoped>
.home_page {
  // position: absolute;
  // left: 0;
  // top: 0;
}
</style>