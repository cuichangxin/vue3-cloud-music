<template>
  <div class="menu-wrap">
    <!-- 个人信息 -->
    <div class="person_data" @click="lookPerson">
      <el-avatar :src="cookies ? userInfo.profile.avatarUrl : ''" :size="45" class="cu" />
      <div class="user" @click.stop="showUserDialog">
        <span class="user_name text-1">{{
          cookies? userInfo.profile.nickname : "未登录"
        }}</span>
        <i class="iconfont" style="color: #666">&#xe600;</i>
        <UserDialog v-if="userShow" :userInfo="userInfo"></UserDialog>
      </div>
    </div>
    <div class="find-music">
      <ul v-for="(item, key) in menuList">
        <h5 v-if="item.name" @click="hidePlayList(item.fn)">
          <i class="iconfont icon-ro" v-if="item.name == '创建的歌单'" :style="
            hideSong
              ? 'transform: rotate(90deg);'
              : 'transform: rotate(0deg);'
          ">&#xe600;</i>
          {{ item.name }}
          <i class="iconfont icon-jia" v-if="item.name == '创建的歌单'" @click.stop="addSong">&#xeb78;</i>
        </h5>
        <div v-for="(v, index) in item.children">
          <li v-if="!v.isLogin" :class="v.isActive ? 'active' : ''" @click="tabChange(v, index, key)"
            @contextmenu.prevent.native="openMenu($event, v)">
            <i :class="['iconfont', v.icon]"></i>
            <span class="text-1">{{ v.name }}</span>
            <i class="iconfont icon-xd" v-if="v.name == '我喜欢的音乐'">&#xe61a;</i>
          </li>
        </div>
      </ul>
      <div class="bo"></div>
    </div>
  </div>
  <LoginDialog v-if="visible" v-model="visible"></LoginDialog>

  <AddPlayList v-model="addPM" @playlist="playlist" @close="close"></AddPlayList>

  <ContextMenu :x="menuContext.x" :y="menuContext.y" :disabled="menuContext.disabled" :data="menuContext.data"
    @playlist="playlist" ref="contextMenu"></ContextMenu>
</template>
<script setup>
import LoginDialog from "../common/loginDialog.vue";
import AddPlayList from "../page/AddPlayList.vue";
import ContextMenu from "./ContextMenu.vue";
import UserDialog from '../page/UserDialog.vue'

import { ref, reactive, onMounted,watch } from "vue";
import $api from "../../api/api.js";
import cookie from "js-cookie";
import _ from "lodash";
import { useRouter } from "vue-router";

const router = useRouter()
const cookies = ref(cookie.get("ssoToken") !== undefined ? true : false);
const visible = ref(false);
const hideSong = ref(true);
const userInfo = ref({
  profile: {},
});
const addPM = ref(false);
let clone = reactive({});
const menuContext = reactive({
  x: 0,
  y: 0,
  disabled: false,
  data: {},
});
const userShow = ref(false)
const contextMenu = ref(null);
const menuList = reactive([
  {
    children: [
      {
        name: "发现音乐",
        icon: "icon-yinle1",
        isActive: true,
        path:'/'
      },
      {
        name: "播客",
        icon: "icon-radioguangbo",
        path:'/podcast'
      },
      {
        name: "私人FM",
        icon: "icon-luyinjishouyinjidiantai",
        path:'/privateFM'
      },
      {
        name: "视频",
        icon: "icon-shipin",
        path:'/video'
      },
      {
        name: "关注",
        icon: "icon-31haoyou",
        path:'/concern'
      },
    ],
  },
  {
    name: "我的音乐",
    children: [
      {
        name: "我喜欢的音乐",
        icon: "icon-xihuan",
        isMenuShow: true,
        path:'/mylikemusic'
      },
      {
        name: "最近播放",
        icon: "icon-shizhong",
        path:'/latelyPlayed'
      },
      {
        name: "我的音乐云盘",
        icon: "icon-yun_o",
        isLogin: true,
        path:'/musicCloud'
      },
      {
        name: "我的播客",
        icon: "icon-yinle",
        isLogin: true,
        path:'/myPodcast'
      },
      {
        name: "我的收藏",
        icon: "icon-shoucang",
        isLogin: true,
        path:'/myCollect'
      },
    ],
  },
  {
    name: "创建的歌单",
    fn: "hidePlayList",
    children: [],
  },
]);

const openMenu = (e, data) => {
  let menuW = 146,
    menuH = 171;
  const { innerHeight, innerWidth } = window;
  if (data.isMenuShow) {
    contextMenu.value.startMenu();
    menuContext.x =
      e.pageX + menuW + 1 > innerWidth ? innerWidth - menuW - 5 : e.pageX;
    menuContext.y =
      e.pageY + menuH + 1 > innerHeight ? innerHeight - menuH - 5 : e.pageY;
    menuContext.disabled = data.trackCount > 0 ? false : true;
    menuContext.data = data;
  }
};

const tabChange = (item, index, key) => {
  menuList.forEach((dd, k) => {
    if (k == key) {
      dd.children.forEach((v, i) => {
        if (i == index) {
          v.isActive = true;
        } else {
          v.isActive = false;
        }
      });
    } else {
      dd.children.forEach((v, i) => {
        v.isActive = false;
      });
    }
  });
  router.push(item.path)
};
// 创建新歌单
const addSong = () => {
  if (!cookies.value) {
    visible.value = true;
  } else {
    addPM.value = true;
  }
};
const hidePlayList = (e) => {
  if (e == "hidePlayList") hideSong.value = !hideSong.value;
  menuList.forEach((item, index) => {
    if (index == 2 && !hideSong.value) {
      item.children = [];
    }
    if (index == 2 && hideSong.value) {
      item.children = clone;
    }
  });
};
const lookPerson = () => {
  if (cookies.value == false) {
    visible.value = !visible.value;
  } else {
    // ToDo 个人资料页
  }
};
const showUserDialog = () => {
  if (cookies.value) {
    userShow.value = !userShow.value
  }
};
const close_user_dialog = () => {
  userShow.value = false
}

function playlist() {
  if (cookies.value) {
    // 歌单列表
    $api
      .playList({
        uid: cookie.get("userId"),
      })
      .then((res) => {
        menuList[2].children = [];
        res.playlist.forEach((item) => {
          menuList.forEach((v, index) => {
            if (index == 1) {
              v.children.forEach((d) => {
                d.isLogin = false;
                if (item.name.indexOf("喜欢的音乐") !== -1) {
                  d.id = item.id;
                  d.trackCount = item.trackCount;
                }
              });
            }
          });
          if (item.name.indexOf("喜欢的音乐") == -1) {
            item.icon = "icon-gedan";
            item.isMenuShow = true;
            menuList[2].children.push(item);
          }
          clone = _.cloneDeep(menuList[2].children);
        });
      });
    // 用户信息
    $api
      .userDetail({
        uid: cookie.get("userId"),
      })
      .then((res) => {
        userInfo.value = res;
        console.log(userInfo.value);
      });
  }
}
function close() {
  addPM.value = false;
}

watch(userShow,(n,o)=>{
  if (n){
    document.addEventListener('click',close_user_dialog)
  }else {
    document.removeEventListener('click',close_user_dialog)
  }
})
onMounted(() => {
  playlist();
});
</script>
<style lang="less" scoped>
.menu-wrap {
  width: 250px;
  background: #eee;
  height: calc(700px - 60px);
  border-radius: 0 0 0 20px;
  position: absolute;
  left: 0;
  top: 60px;

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
      display: flex;
      position: relative;

      .user_name {
        display: inline-block;
        max-width: 140px;
        font-size: 16px;
        margin-right: 4px;
        color: #333;
      }
    }
  }

  .find-music {
    width: 250px;
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
        font-size: 14px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .icon-ro {
          display: inline-block;
          transform: rotate(90deg);
          margin-right: 10px;
        }

        .icon-jia {
          font-size: 18px;
          font-weight: bold;
          flex: 1;
          margin-left: 80px;
        }
      }

      li {
        height: 42px;
        font-size: 15px;
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
          font-size: 20px;
          margin-right: 7px;
        }

        .icon-xd {
          position: absolute;
          right: 18px;
        }
      }

      .active {
        background: #e3e3e3;
        color: #d72323;
      }
    }

    .bo {
      height: 90px;
      width: 100%;
    }
  }
}
</style>
