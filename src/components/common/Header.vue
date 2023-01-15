<template>
  <div class="flex-start">
    <!-- 左侧 -->
    <div class="header-left-content">
      <div class="history-content flex-between">
        <i class="iconfont icon-style">&#xe660;</i>
        <i class="iconfont icon-style">&#xe65f;</i>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="header-right-content">
      <div class="menu-right-content">
        <div class="tabs-wrap">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="(item, index) in tabsList" :key="index" :label="item" :name="item"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="w-350 flex-between">
          <el-input v-model="keyWord" class="w-50" placeholder="搜索">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search />
              </el-icon>
            </template>
          </el-input>
          <i class="iconfont icon-style-right">&#xe8b7;</i>
          <el-badge :value="100" :Max="99">
            <i class="iconfont icon-style-right">&#xe61b;</i>
          </el-badge>
          <i class="iconfont icon-style-right">&#xe666;</i>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const keyWord = ref('')
const activeName = ref('个性推荐')
const tabsList = reactive({
  rec: '个性推荐',
  songList: '歌单',
  ranking: '排行榜',
  singer: '歌手',
  LatestMusic: '最新音乐'
})
</script>
<style lang="less" scoped>
.header-left-content {
  height: 70px;
  width: 280px;
  background-color: #f5f5f5;
  border-radius: 20px 0 0 0;

  .history-content {
    width: 90px;
    float: right;
    margin-top: 20px;
    margin-right: 30px;

    .icon-style {
      width: 30px;
      height: 30px;
      font-weight: 700;
      font-size: 20px;
      cursor: pointer;
      border-radius: 50px;
      text-align: center;

      &:hover {
        background: #eeeeee;
      }
    }
  }
}

.header-right-content {
  background-color: #fafafa;
  height: 70px;
  width: calc(100% - 280px);
  border-radius: 0 20px 0 0;

  .menu-right-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tabs-wrap {
    width: 550px;
    margin-left: 20px;

    :deep(.el-tabs__nav-wrap::after) {
      background-color: transparent;
    }

    :deep(.el-tabs__active-bar) {
      background-color: transparent;
    }

    :deep(.el-tabs__item) {
      color: #808080;
      font-weight: normal;
      font-size: 19px;

      &:hover {
        color: #000;
        font-weight: 800;
      }
    }

    :deep(.el-tabs__item.is-active) {
      color: #000;
      font-weight: 800;
    }
  }

  .menu-right-content {
    .w-50 {
      width: 200px;
    }

    :deep(.el-tabs__header) {
      margin: 0;
    }

    :deep(.el-input__wrapper) {
      border-radius: 20px;
      box-shadow: none;
      background-color: #eee;
    }

    :deep(.el-input__icon) {
      font-size: 18px;
      color: #666;
    }

    .w-350 {
      width: 350px;
      height: 70px;
      margin-right: 40px;
    }

    .icon-style-right {
      width: 35px;
      height: 35px;
      border-radius: 35px;
      font-size: 25px;
      line-height: 35px;
      text-align: center;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
