<template>
  <div class="user_info">
    <div class="user_top_wrap">
      <div class="dynamic">
        <span>{{ userInfo.profile.eventCount }}</span>
        <b>动态</b>
      </div>
      <div class="dynamic">
        <span>{{ userInfo.profile.follows }}</span>
        <b>关注</b>
      </div>
      <div class="dynamic">
        <span>{{ userInfo.profile.followeds }}</span>
        <b>粉丝</b>
      </div>
    </div>
    <div class="button">
      <el-button round>签到</el-button>
    </div>
    <ul class="user_bottom_wrap">
      <li>
        <i class="iconfont left_icon">&#xe64b;</i>
        <span>个人信息设置</span>
        <i class="iconfont right_icon">&#xe65f;</i>
      </li>
      <li>
        <i class="iconfont left_icon">&#xe60f;</i>
        <span>退出登录</span>
        <i class="iconfont right_icon">&#xe65f;</i>
      </li>
    </ul>
  </div>
</template>
<script setup>
let p = defineProps({
  userInfo:{
    type:Object
  }
})
</script>
<style lang="less" scoped>
.user_info {
  width: 300px;
  // height: 400px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  position: absolute;
  left: 170px;
  top: -20px;
  z-index: 99;
  padding: 18px 0 10px 0;

  .user_top_wrap {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .dynamic {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      cursor: pointer;

      span {
        font-size: 34px;
        line-height: 1;
      }

      b {
        font-size: 12px;
        font-weight: normal;
        opacity: 0.8;
      }

      &:nth-child(1)::before,
      &:nth-child(2)::before {
        content: '';
        width: 1px;
        height: 40px;
        background: #e9e7ef;
        position: absolute;
        right: -35px;
        top: 6px;
      }

      &:hover b {
        opacity: 1;
      }
    }
  }

  .button {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e9e7ef;
    .el-button {
      width: 100px;
      &:hover,&:focus,&:active{
        color: var(--el-button-text-color) !important;
        background-color: var(--el-button-bg-color) !important;
        border: var(--el-border) !important;
      }
    }
  }
  .user_bottom_wrap{
    padding-top: 10px;
    li{
      width: 100%;
      height: 35px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 13px;
      cursor: pointer;
      &:hover{
        background: #e3e3e3;
      }
      .left_icon{
        font-size: 15px;
        font-weight: bold;
        margin: 0 10px;
      }
      .right_icon{
        font-size: 12px;
        flex: 1;
        text-align: right;
        padding-right: 10px;
      }
    }
  }
}
</style>
