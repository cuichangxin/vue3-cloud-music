<template>
  <div class="home_page">
    <Loading v-if="loading"></Loading>
    <div v-else>
      <!-- banners -->
      <Swiper :banners="banners"></Swiper>
      <!-- 推荐歌单 -->
      <Personalized :playlist="playlist"></Personalized>
      <!-- 独家放送 -->
      <Broadcast :sendList="sendList"></Broadcast>
      <!-- 最新音乐 -->
      <NewSongList :newSongList="newSongList"></NewSongList>
    </div>
  </div>
</template>

<script setup>
import Swiper from '../components/page/Swiper.vue'
import Personalized from '@/components/page/Personalized.vue'
import Broadcast from '../components/page/Broadcast.vue';
import NewSongList from '@/components/page/NewSongList.vue'
import Loading from '@/components/common/Loading.vue'
import $api from '../api/api'
import { requestUnit } from '@/config/utils'
import { reactive, ref, onMounted, watch } from 'vue';

const portNum = ref(0)
const loading = ref(true)
const banners = reactive([])
const playlist = reactive([])
const sendList = reactive([])
const newSongList = reactive([])

watch(portNum, (n) => {
  if (n == 4) {
    loading.value = false
  }
})

onMounted(() => {
  // banners
  $api.homeBanner().then((res) => {
    // console.log(res);
    portNum.value++
    res.banners.forEach(item => {
      banners.push(item)
    })
  })
  // 推荐歌单
  $api.personalized({
    limit: 10
  }).then((res) => {
    // console.log(res);
    portNum.value++
    res.result.forEach(item => {
      item.requestUnit = requestUnit(item.playCount)
      playlist.push(item)
    })
  })
  // 独家放送
  $api.privatecontent({
    limit: 4
  }).then((res) => {
    // console.log(res, 'res');
    portNum.value++
    res.result.forEach(item => {
      sendList.push(item)
    })
  })
  // 最新音乐
  $api.homeNewMusic({}).then(res=>{
    // console.log(res);
    portNum.value++
    res.result.forEach(item=>{
      let ary = []
      item.song.artists.map(v=>{
        ary.push(v.name)
      })
      item.song.alterName = ary
      newSongList.push(item)
    })
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