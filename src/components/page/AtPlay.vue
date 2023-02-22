<template>
  <div class="song_list_wrap">
    <h4>当前播放</h4>
    <div class="top_view">
      <span class="count">总103首</span>
      <span class="collect">
        <i class="iconfont">&#xf46f;</i>
        <span>收藏全部</span>
      </span>
      <span class="clear">清空列表</span>
    </div>
    <div class="song_list">
      <ul>
        <li v-for="(item, index) in song_list" @dblclick="play(item)">
          <i v-show="item.songStatus === 0" class="iconfont play_status">&#xe69d;</i>
          <i v-show="item.songStatus === 1" class="iconfont play_status">&#xea82;</i>
          <div class="c flex-start" style="width:275px">
            <span class="song_name" :style="item.songStatus === 0 || item.songStatus === 1 ? 'color:#dd2822;' : ''">
              <span class="name text-1">{{ item.name }}</span>
              &nbsp;
              <span v-if="item.song.alias.length" class="song_sub_name text-1">({{ item.song.alias[0] }})</span>
            </span>
            <span v-if="item.song.privilege.playMaxBrLevel != 'exhigh'" class="tone">
              {{
                item.song.privilege.playMaxBrLevel
                == 'lossless' ? 'SQ' : item.song.privilege.playMaxBrLevel == 'exhigh' ? '' : 'Hi-Res' }}
            </span>
            <i v-if="item.song.mvid != 0" class="iconfont mv_icon">&#xe61e;</i>
          </div>
          <span class="singer_name text-1" :style="item.songStatus === 0 || item.songStatus === 1 ? 'color:#dd2822;' : ''">
            {{ item.song.alterName.join('/') }}
          </span>
          <span class="time">{{ item.duration }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { formatTime } from '../../config/utils'
import { onMounted, reactive, watch, ref, onBeforeUnmount } from 'vue'
import { mainStore } from '../../stores';

const emit = defineEmits(['atPlay_show', 'atPlay_pause', 'atPlay_play'])

const store = mainStore()
const song_list = ref([])
const song_status_lave = ref({})

const play = (val) => {
  if ((song_status_lave.value.id != val.id) && JSON.stringify(song_status_lave.value) != '{}') {
    song_list.value.forEach(item => {
      if (item.id === song_status_lave.value.id) {
        item.songStatus = ''
      }
    })
  }
  // 恢复播放
  if (val.songStatus === 1) {
    emit('atPlay_play')
    song_list.value.forEach(item => {
      if (item.id === val.id) {
        item.songStatus = 0
      }
    })
    return
  }
  // 暂停播放
  if (val.songStatus === 0) {
    song_list.value.forEach(item => {
      if (item.id === val.id) {
        item.songStatus = 1
      }
    })
    emit('atPlay_pause')
    return
  }
  // 第一次播放
  if (!val.hasOwnProperty(val.songStatus)) {
    song_list.value.forEach(item => {
      if (item.id === val.id) {
        item.songStatus = 0
      }else {
        item.songStatus = ''
      }
    })
    store.addSongUrl(val)
    emit('atPlay_show')
  }
  song_status_lave.value = val
}
onMounted(() => {
  let localSongList = JSON.parse(localStorage.getItem('songlist'))
  if (localSongList != null) {
    song_list.value = localSongList
    song_list.value.reverse()
  }
  window.addEventListener('setItemEvent', function (e) {
    if (e.key === 'songlist') {
      let l = JSON.parse(e.newValue)
      song_list.value = l
      song_list.value.reverse()
    }
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('setItemEvent', function () {})
})
</script>
<style lang="less" scoped>
.song_list_wrap {
  width: 500px;
  height: 555px;
  background: #fff;
  padding-top: 20px;
  position: absolute;
  top: -575px;
  right: 0;
  box-shadow: 20px 1px 32px 4px rgba(0, 0, 0, 0.02), 0px 8px 10px rgba(0, 0, 0, 0.08);

  h4 {
    font-size: 21px;
    padding-left: 20px;
  }

  .top_view {
    width: 458px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e0dcdc;
    margin: 0 auto;
    padding-bottom: 10px;
    padding-top: 1px;

    .count {
      font-size: 12px;
      color: #c9c5c5;
    }

    .collect {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      span {
        display: inline-block;
        margin-left: 5px;
      }

      i {
        font-size: 18px;
      }
    }

    .clear {
      margin-left: 18px;
      color: rgb(11, 104, 141);
    }
  }

  .song_list {
    ul {
      padding-top: 10px;

      li {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        padding: 7px 30px 7px 20px;
        cursor: default;
        position: relative;

        &:nth-child(even) {
          background-color: #f9f9f9;
        }

        &:hover {
          background-color: #eeeeee;

          .song_name {
            color: #000;

            .name {
              color: #000;
            }
          }

          .singer_name {
            color: #000;
          }

          .time {
            color: #000;
          }
        }

        .play_status {
          color: #dd2822;
          font-size: 12px;
          transform: scale(0.8);
          position: absolute;
          left: 5px;
        }

        .tone {
          padding: 0 2px;
          height: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 1;
          border: 1px solid #dd2822;
          border-radius: 3px;
          color: #dd2822;
          transform: scale(0.8);
          margin-left: 2px;
        }

        .mv_icon {
          color: #dd2822;
          font-size: 18px;
          line-height: 1;
        }

        .song_name {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          max-width: 180px;

          .name {
            display: inline-block;
          }

          .song_sub_name {
            width: 200px;
            flex: 1;
            color: #c9c5c5;
          }
        }

        .singer_name {
          width: 110px;
          color: #5e5c5c;
        }

        .time {
          margin-left: 12px;
          color: #c9c5c5;
        }
      }
    }
  }
}
</style>
