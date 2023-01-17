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
      <!-- <ul>
        <li v-for="(item, index) in topTagList">
          <i :class="['iconfont', item.icon]"></i>
          <span class="text-1">{{ item.name }}</span>
        </li>
        <h5>我的音乐</h5>
        <div v-for="(item, index) in musicList">
          <li v-if="!item.isLogin">
          <i :class="['iconfont', item.icon]"></i>
          <span class="text-1">{{ item.name }}</span>
          <i class="iconfont icon-xd" v-if="item.name == '我喜欢的音乐'">&#xe61a;</i>
        </li>
        </div>
        <h5 @click="hidePlayList">
          <i class="iconfont icon-ro"
            :style="hideSong ? 'transform: rotate(90deg);' : 'transform: rotate(0deg);'">&#xe600;</i>
          创建的歌单
          <i class="iconfont icon-jia" @click.stop="addSong">&#xeb78;</i>
        </h5>
      </ul> -->
      <ul v-for="(item, key) in menuList">
        <h5 v-if="item.name" @click="hidePlayList(item.fn)">
          <i class="iconfont icon-ro" v-if="item.name == '创建的歌单'"
            :style="hideSong ? 'transform: rotate(90deg);' : 'transform: rotate(0deg);'">&#xe600;</i>
          {{ item.name }}
          <i class="iconfont icon-jia" v-if="item.name == '创建的歌单'" @click.stop="addSong">&#xeb78;</i>
        </h5>
        <div v-for="(v, index) in item.children">
          <li v-if="!v.isLogin" :class="v.isActive ? 'active' : ''" @click="tabChange(item, index, key)">
            <i :class="['iconfont', v.icon]"></i>
            <span class="text-1">{{ v.name }}</span>
            <i class="iconfont icon-xd" v-if="v.name == '我喜欢的音乐'">&#xe61a;</i>
          </li>
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
const activeIndex = ref(0)
const lastActive = ref(-1)
const hideSong = ref(true)

const menuList = reactive([
  {
    index: 1,
    children: [
      {
        name: '发现音乐',
        icon: 'icon-yinle1'
      },
      {
        name: '播客',
        icon: 'icon-radioguangbo'
      },
      {
        name: '私人FM',
        icon: 'icon-luyinjishouyinjidiantai'
      },
      {
        name: '视频',
        icon: 'icon-shipin'
      },
      {
        name: '关注',
        icon: 'icon-31haoyou'
      },
    ]
  },
  {
    name: '我的音乐',
    index: 2,
    children: [
      {
        name: '我喜欢的音乐',
        icon: 'icon-xihuan'
      },
      {
        name: '最近播放',
        icon: 'icon-shizhong'
      },
      {
        name: '我的音乐云盘',
        icon: 'icon-yun_o',
        isLogin: true,
      },
      {
        name: '我的播客',
        icon: 'icon-yinle',
        isLogin: true,
      },
      {
        name: '我的收藏',
        icon: 'icon-shoucang',
        isLogin: true,
      },
    ]
  },
  {
    name: '创建的歌单',
    index: 3,
    fn: 'hidePlayList',
    children: []
  }
])

// 创建的歌单
const createPlayList = reactive([])

const tabChange = (item, index, key) => {
  menuList.forEach((dd,k) => {
    if (k == key) {
      dd.children.forEach((v,i)=>{
        if (i == index) {
          v.isActive = true
        }else {
          v.isActive = false
        }
      })
    }else {
      dd.children.forEach((v,i)=>{
        v.isActive = false
      })
    }
  })
}
// 创建新歌单
const addSong = () => {

}
const hidePlayList = (e) => {
  if (e == 'hidePlayList') hideSong.value = !hideSong.value
}
const lookPerson = () => {
  if (cookies.value === undefined) {
    visible.value = !visible.value
  }
}
if (cookies.value != undefined) {
  $api.playList({
    uid: cookie.get('userId')
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
        margin: 15px 0 15px 0;
        cursor: pointer;
        font-size: 15px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .icon-ro {
          display: inline-block;
          transform: rotate(90deg);
          margin-right: 10px;
        }

        .icon-jia {
          font-size: 21px;
          font-weight: bold;
          flex: 1;
          margin-left: 88px;
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
