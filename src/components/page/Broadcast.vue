<template>
  <div class="wrap">
    <SubTitle>独家放送</SubTitle>
      <ul>
        <li v-for="item in sendList">
          <i class="iconfont play">&#xea6d;</i>
          <img :src="item.sPicUrl">
          <p class="text-2">{{ item.name }}</p>
        </li>
      </ul>
  </div>
</template>
<script setup>
import SubTitle from '../common/SubTitle.vue';

defineProps({
  sendList:{
    type:Array
  }
})
</script>
<style lang="less" scoped>
.wrap {
  padding: 0 30px;
    ul {
      margin-top: 20px;
      margin-bottom: 60px;
      display: flex;
      justify-content: space-between;
      li{
        display: flex;
        flex-wrap: wrap;
        width: 210px;
        height: 160px;
        position: relative;
        img{
          width: 210px;
          border-radius: 8px;
        }
        p{
          line-height: 21px;
          width: 100%;
          margin-top: 4px;
          font-size: 13px;
        }
        .play{
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          width: 25px;
          height: 25px;
          color: #fff;
          font-weight: bold;
          border: 0.01rem solid #c7c6c6;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 25px;
          position: absolute;
          top: 7px;
          left: 7px;
        }
      }
    }
}
</style>
