<template>
  <div class="menu-wrap">
    <!-- 个人信息 -->
    <div class="person_data" @click="lookPerson">
      <el-avatar :size="45" class="cu" />
      <div class="user">
        <span class="user_name">{{ cookies == undefined ? '未登录' : '' }}</span>
        <i class="iconfont" style="color:#666">&#xe600;</i>
      </div>
    </div>
    <div class="find-music">
      <!-- 顶部板块 -->
      <ul>
        <div v-for="(item, index) in musicList" :key="index">
          <h5 v-if="index == 5">{{ index == 5 ? '我的音乐' : '' }}</h5>
          <h5 v-if="item.target" style="padding-left:10px" @click="hidePlayList">
            <i class="iconfont icon-ro"
              :style="hideSong ? 'transform: rotate(90deg);' : 'transform: rotate(0deg);'">&#xe600;</i>
            {{ item.target ? '创建的歌单' : '' }}
            <i class="iconfont icon-jia" @click.stop="addSong">&#xeb78;</i>
          </h5>
          <li :class="active == index ? 'active' : ''" v-show="item.hideTarget" @click="tabChange(index)">
            <i :class="['iconfont', item.icon]"></i>
            <span class="text-1">{{ item.name }}</span>
            <i class="iconfont icon-xd" v-if="item.id == 5">&#xe61a;</i>
          </li>
          <li v-if="index + 1 == musicList.length" style="width:100%; height:40px"></li>
        </div>
      </ul>
    </div>
  </div>
  <LoginDialog v-model="visible"></LoginDialog>
</template>
<script setup>
import LoginDialog from '../common/loginDialog.vue'
import { ref, reactive } from 'vue'
import $api from '../../api/api.js'
import cookie from 'js-cookie'



const cookies = ref(cookie.get('ssoToken'))
const visible = ref(false)
const active = ref(0)
const lastActive = ref(-1)
const hideSong = ref(true)
// const dialog = ref(null)

const musicList = reactive([
  {
    hideTarget: true,
    id: 0,
    name: '发现音乐',
    icon: 'icon-yinle1'
  },
  {
    hideTarget: true,
    id: 1,
    name: '播客',
    icon: 'icon-radioguangbo'
  },
  {
    hideTarget: true,
    id: 2,
    name: '私人FM',
    icon: 'icon-luyinjishouyinjidiantai'
  },
  {
    hideTarget: true,
    id: 3,
    name: '视频',
    icon: 'icon-shipin'
  },
  {
    hideTarget: true,
    id: 4,
    name: '关注',
    icon: 'icon-31haoyou'
  },
  {
    hideTarget: true,
    id: 5,
    name: '我喜欢的音乐',
    icon: 'icon-xihuan'
  },
  {
    hideTarget: true,
    id: 6,
    name: '最近播放',
    icon: 'icon-shizhong'
  },
  {
    hideTarget: true,
    id: 7,
    name: '我的音乐云盘',
    icon: 'icon-yun_o'
  },
  {
    hideTarget: true,
    id: 8,
    name: '我的播客',
    icon: 'icon-yinle'
  },
  {
    hideTarget: true,
    id: 9,
    name: '我的收藏',
    icon: 'icon-shoucang'
  },
])

const tabChange = (index) => {
  lastActive.value = active
  active.value = index

}
const addSong = () => {

}
const hidePlayList = () => {
  hideSong.value = !hideSong.value
  musicList.forEach(item => {
    if (hideSong.value == false) {
      if (item.coverImgUrl) {
        item.hideTarget = false
      }
    } else {
      if (item.coverImgUrl) {
        item.hideTarget = true
      }
    }
  })
}
const lookPerson = () =>{
  // console.log(dialog.value.visible);
  if (cookies.value === undefined) {
    visible.value = !visible.value
  }
}
if (cookies.value != undefined) {
  $api.playList({
    uid: '316464708'
  }).then((res) => {
    res.playlist.forEach((item, index) => {
      if (item.name.indexOf('喜欢的音乐') == -1) {
        if (index == 1) {
          item.target = 'target'
        }
        item.icon = 'icon-gedan'
        item.hideTarget = true
        musicList.push(item)
      }
    })
  })
}
</script>
<style lang="less" scoped>
.menu-wrap {
  width: 280px;
  background: #eee;
  height: calc(100% - 70px);
  border-radius: 0 0 0 20px;
  overflow: hidden;

  .person_data {
    padding: 15px 0 15px 15px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .cu {
      cursor: pointer;
    }

    .user {
      margin-left: 12px;
      cursor: default;

      .user_name {
        font-size: 19px;
        margin-right: 4px;
        color: #333;
      }
    }
  }

  .find-music {
    width: 280px;
    height: calc(100% - 67px);
    overflow: hidden;
    overflow-y: auto;

    ul {
      h5 {
        padding-left: 30px;
        color: #696767;
        font-weight: normal;
        margin: 15px 0 0 0;
        cursor: default;

        .icon-ro {
          display: inline-block;
          transform: rotate(90deg);
        }

        .icon-jia {
          font-size: 21px;
          font-weight: bold;
          margin-left: 105px;
        }
      }

      li {
        height: 50px;
        font-size: 18px;
        display: flex;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
        cursor: default;
        color: #333;
        position: relative;

        &:hover {
          background: #e3e3e3;
        }

        i {
          font-size: 24px;
          margin-right: 7px;
        }

        .icon-xd {
          position: absolute;
          right: 30px;
        }
      }

      .active {
        background: #e3e3e3;
        color: #d72323;
      }
    }
  }
}
</style>
