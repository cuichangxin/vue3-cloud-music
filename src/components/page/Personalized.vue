<template>
  <div class="re">
    <SubTitle>推荐歌单</SubTitle>
    <div class="playlist_wrap">
      <div class="content" v-for="item in playlist" :key="item">
        <div class="box">
          <img :src="item.picUrl">
          <div class="count">
            <i class="iconfont">&#xea6d;</i>
            <p>{{item.requestUnit.num}}{{ item.requestUnit.unit }}</p>
          </div>
          <div class="play">
            <i class="iconfont">&#xea82;</i>
          </div>
        </div>
        <p class="sub_title text-2">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import SubTitle from '../common/SubTitle.vue'
import $api from '@/api/api'
import cookie from 'js-cookie'
import { requestUnit } from '@/config/utils'
import { onMounted, ref } from 'vue'
const playlist = ref([])
onMounted(() => {
  $api.personalized({
    limit: 10
  }).then((res) => {
    console.log(res);
    playlist.value = []
    res.result.forEach(item=>{
      item.requestUnit = requestUnit(item.playCount)
      playlist.value.push(item)
    })
  })
})
</script>
<style lang="less" scoped>
.re {
  padding: 0 30px;

  .playlist_wrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 20px;
    margin-bottom: 20px;
    .content {
      width: 160px;
      height: 200px;
      margin-bottom: 30px;
      cursor: pointer;
      &:hover .box>.play{
        display: block;
      }
      .box {
        position: relative;
        img {
          border-radius: 6px;
          width: 100%;
          height: 150px;
        }
        .count{
          display: flex;
          position: absolute;
          right: 10px;
          top: 2px;
          color: #fff;
          i{
            font-size: 13px;
            font-weight: bold;
          }
          p{
            font-size: 13px;
            margin-left: 3px;
          }
        }
        .play{
          width: 30px;
          height: 30px;
          border-radius: 30px;
          color: rgb(217, 28, 28);
          background: rgba(255, 255, 255, .7);
          backdrop-filter: blur(6px);
          position: absolute;
          right: 10px;
          bottom: 17px;
          display: none;
          i{
            font-size: 15px;
            position: absolute;
            top: 50%;
            left: 54%;
            transform: translate(-50%,-50%);
          }
        }
      }

      .sub_title {
        width: 100%;
        font-size: 13px;
        line-height: 17px;
      }
    }
  }
}
</style>
