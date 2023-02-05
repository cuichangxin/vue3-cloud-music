<template>
  <div class="home_page">
    <!-- banners -->
    <Swiper :banners="banners"></Swiper>
    <!-- 推荐歌单 -->
    <Personalized></Personalized>
    <!-- 独家放送 -->
    <Broadcast></Broadcast>
  </div>
</template>

<script setup>
import Swiper from '../components/page/Swiper.vue'
import Personalized from '@/components/page/Personalized.vue'
import Broadcast from '../components/page/Broadcast.vue';
import $api from '../api/api'
import { reactive } from 'vue';

let banners = reactive([])
$api.homePage().then((res) => {
  console.log(res);
  res.data.blocks.forEach(item => {
    if (item.blockCode == 'HOMEPAGE_BANNER') {
      item.extInfo.banners.forEach(v=>{
        banners.push(v)
      })
    }
  })
})
</script>

<style lang="less" scoped>
.home_page {
  overflow-y: scroll;
  height: 640px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 60px;
}
</style>