<template>
  <div class="audio_wrap">
    <div class="song" :style="JSON.stringify(songBasicData) !== '{}' ? '' : 'visibility:hidden;'">
      <el-avatar class="song_img" :src="songBasicData.picUrl" />
      <div class="song_data">
        <div class="song_name">
          <span class="text-1 span_name_width">{{
            songBasicData.name ? songBasicData.song.alias.length ?
            songBasicData.name + ' ' + `(${songBasicData.song.alias[0]})` : songBasicData.name : songBasicData.name
          }}</span>
          <b>{{ JSON.stringify(songBasicData) != '{}' ? '-' : '&nbsp;' }}</b>
          <span class="text-1 singer" v-if="JSON.stringify(songBasicData) != '{}'">
            {{ songBasicData.song.alterName.join('/') }}
          </span>
        </div>
        <div class="song_time">
          <span>{{
            songBasicData.currentTime ? songBasicData.currentTime.length == 2 ? '00:' + songBasicData.currentTime
            : songBasicData.currentTime : '00:00'
          }}</span>
          <b>/</b>
          <span>{{ songBasicData.duration ? songBasicData.duration : '00:00' }}</span>
        </div>
      </div>
    </div>
    <div class="center_box">
      <div class="like">
        <i class="iconfont">&#xeca1;</i>
      </div>
      <div class="control center">
        <div class="prev" @click="prev_play">
          <i class="iconfont">&#xe63d;</i>
        </div>
        <div class="center-play" @click="audioPlay">
          <i v-if="!playTarget" class="iconfont play">&#xea82;</i>
          <i v-else class="iconfont pause">&#xe69d;</i>
        </div>
        <div class="next" @click="next_play">
          <i class="iconfont">&#xe63e;</i>
        </div>
      </div>
    </div>
    <div class="right_control">
      <div class="play_mode" @click="modeChange">
        <div class="tooltip">
          {{ modeNum == 1 ? '列表循环' : modeNum == 2 ? '单曲循环' : modeNum == 3 ? '随机播放' : '顺序播放' }}
        </div>
        <i v-if="modeNum == 1" class="iconfont icon_s">&#xe6a2;</i>
        <i v-if="modeNum == 2" class="iconfont icon_s">&#xe604;</i>
        <i v-if="modeNum == 3" class="iconfont icon_s">&#xe613;</i>
        <i v-if="modeNum == 4" class="iconfont">&#xe6a1;</i>
      </div>
      <div class="at_play" :style="store.atPlayShow ? 'color:#dd2822;' : ''" @click="showAtPlay">
        <i class="iconfont">&#xe633;</i>
      </div>
      <el-popover placement="top" :width="50" trigger="hover" class="volume_popover">
        <template #reference>
          <div class="volume" @click="mute">
            <i v-show="sliderVolume != 0" class="iconfont vo">&#x10103;</i>
            <i v-show="sliderVolume == 0" class="iconfont vo">&#x10102;</i>
          </div>
        </template>
        <el-slider vertical v-model="sliderVolume" :show-tooltip="false" :max="1" :step="0.1"
          @input="changeVolume"></el-slider>
      </el-popover>
    </div>
    <Progress class="progress" @progress_time="progress_time" @progress_curr="progress_curr"
      :progressDetail="progressDetail"></Progress>
    <audio :src="songBasicData.url" ref="audio" controls style="display:none"></audio>
    <AtPlay v-if="store.atPlayShow" :playTarget="playTarget" @atPlay_show="atPlay_show" @atPlay_pause="atPlay_pause"
      @atPlay_play="atPlay_play"></AtPlay>
  </div>
</template>
<script setup>
import Progress from './progress.vue'
import AtPlay from '../page/AtPlay.vue'
import { ref, onMounted, watch, reactive, nextTick } from 'vue'
import { mainStore } from '../../stores';
import { storeToRefs } from 'pinia';
import $api from '../../api/api'
import { formatTime } from '../../config/utils'

const store = mainStore()
const { songData } = storeToRefs(store)
const audio = ref(null)
const sliderVolume = ref(1)
const modeNum = ref(1)
const songBasicData = ref({})
const timer = ref(null)
const progressDetail = reactive({})
const playTarget = ref(false)
const volume = ref(0) // 保存静音前的音量
let songList = []
const atPlayT = ref(true)

watch(songData, (n) => {
  clearInterval(timer.value)
  timer.value = null
  songBasicData.value = n
  // $api.songUrl({ id: n.id }).then((res) => {
  // console.log(res);
  songBasicData.value.url = `https://music.163.com/song/media/outer/url?id=${n.id}.mp3 `
  nextTick(() => {
    audio.value.play().then(() => {
      playTarget.value = true
      if (atPlayT.value) store.atPlayShow = false
      songTime() // 马上执行
      timer.value = setInterval(() => { songTime() }, 1000)
      // setTimeout(() => {
      // 歌曲总时长
      songBasicData.value.duration = formatTime(audio.value.duration)
      progressDetail.duration = audio.value.duration

      let l = localStorage.getItem('songlist')
      if (l != null) {
        songList = JSON.parse(l)
        songList.forEach(item => {
          if (item.songStatus == 0) {
            delete item.songStatus
          }
          if (item.id == n.id) {
            item.songStatus = 0
          }
        })
        localStorage.setItem('songlist', JSON.stringify(songList))
      }

      if (!songList.some(v => v.id === n.id)) {
        songList.push(n)
        songList.forEach(item => {
          if (item.songStatus == 0) {
            delete item.songStatus
          }
          if (item.id == n.id) {
            item.songStatus = 0
          }
        })
        localStorage.setItem('songlist', JSON.stringify(songList))
      }
      // }, 150)
    })
  })
  // })
})
const songTime = () => {
  // 歌曲当前时长
  songBasicData.value.currentTime = formatTime(audio.value.currentTime)
  progressDetail.currentTime = audio.value.currentTime
  // 当前时长等于歌曲总时长清除定时器
  if (songBasicData.value.currentTime == songBasicData.value.duration) {
    clearInterval(timer.value)
    timer.value = null
    // atPlayT.value = true
    playTarget.value = false
    setTimeout(() => {
      if (modeNum.value === 1) {
        let l = JSON.parse(localStorage.getItem('songlist'))
        l.map((v, i) => {
          if (v.id == songBasicData.value.id) {
            if (i === l.length - 1) {
              store.addSongUrl(l[0])
            } else {
              store.addSongUrl(l[i + 1])
            }
          }
        })
      }
    }, 1000)
  }
}

const progress_time = (val) => {
  // console.log(val);
  songBasicData.value.currentTime = formatTime(val)
  // 拖动进度条清除定时器，否则时间显示会跳
  clearInterval(timer.value)
}
const progress_curr = (val) => {
  audio.value.currentTime = val
  songTime()
  timer.value = setInterval(() => { songTime() }, 1000)
}
const audioPlay = () => {
  playTarget.value = !playTarget.value
  if (playTarget.value) {
    audio.value.play()
    songTime() // 马上执行
    timer.value = setInterval(() => {
      songTime()
    }, 1000)
  } else {
    audio.value.pause()
    clearInterval(timer.value)
  }
}
const changeVolume = (e) => {
  audio.value.volume = e
}
const mute = () => {
  if (audio.value.volume != 0) {
    volume.value = audio.value.volume
    audio.value.volume = 0
    sliderVolume.value = 0
  } else {
    audio.value.volume = volume.value
    sliderVolume.value = volume.value
  }
}
const modeChange = () => {
  if (modeNum.value == 4) {
    modeNum.value = 1
  } else {
    modeNum.value++
  }
}
const showAtPlay = () => {
  store.atPlayShow = !store.atPlayShow
}
const atPlay_show = () => {
  atPlayT.value = false
}
const atPlay_pause = () => {
  audio.value.pause()
  playTarget.value = !playTarget.value
}
const atPlay_play = () => {
  audio.value.play()
  playTarget.value = !playTarget.value
}
const prev_play = () => {
  let l = JSON.parse(localStorage.getItem('songlist'))
  l.map((value,index) => {
    if (value.id === songBasicData.value.id) {
      if (index === 0) {
        store.addSongUrl(l[l.length - 1])
      }else {
        store.addSongUrl(l[index - 1])
      }
    }
  })
}
const next_play = () => {
  let l = JSON.parse(localStorage.getItem('songlist'))
  l.map((value,index) => {
    if (value.id === songBasicData.value.id) {
      if (index === l.length - 1) {
        store.addSongUrl(l[0])
      }else {
        store.addSongUrl(l[index + 1])
      }
    }
  })
}
onMounted(() => {
  // console.log(audio.value);
  if (songBasicData.value.url == undefined) {
    let l = localStorage.getItem('songlist'),
      p = JSON.parse(l)
    if (l !== null) {
      p.forEach(item => {
        delete item.songStatus
      })
      localStorage.setItem('songlist', JSON.stringify(p))
    }
  }
})
</script>
<style lang="less" scoped>
.audio_wrap {
  width: calc(100% - 20px);
  height: 45px;
  background: #fefefe;
  // border-top: 2px solid #eeeded;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .progress {
    position: absolute;
    top: -2px;
    left: 0;
    width: 100%;
  }

  .song {
    display: flex;

    .song_img {
      width: 45px;
      height: 45px;
      border-radius: 5px;
      margin-right: 8px;
      cursor: pointer;
    }

    .song_data {
      .song_name {
        width: 400px;
        display: flex;
        align-items: center;

        b {
          color: #afaeae;
          margin: 0 5px;
          font-weight: normal;
        }

        .singer {
          width: 180px;
          color: #afaeae;
          font-size: 12px;
          cursor: pointer;

          .gap {
            margin: 0 2px;
          }
        }

        .span_name_width {
          display: inline-block;
          max-width: 260px;
        }
      }

      .song_time {
        color: #afaeae;
        font-size: 14px;

        b {
          margin: 0 3px;
          font-weight: normal;
        }
      }
    }
  }

  .center_box {
    display: flex;
    align-items: center;

    // position: relative;
    .like {
      position: absolute;
      left: 41%;
      cursor: pointer;

      i {
        font-size: 19px;
      }
    }

    .control {
      display: flex;
      align-items: center;

      .prev,
      .next {
        cursor: pointer;

        i {
          font-size: 26px;
          color: rgb(192, 44, 44);
        }
      }

      .center-play {
        width: 40px;
        height: 40px;
        border-radius: 40px;
        background: rgb(192, 44, 44);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 16px;
        cursor: pointer;

        i {
          font-size: 20px;
          color: #fff;
        }

        .play {
          margin-left: 2px;
        }
      }
    }
  }

  .right_control {
    display: flex;

    .play_mode,
    .at_play,
    .volume {
      i {
        font-size: 18px;
        margin: 0 13px;
        cursor: pointer;
      }

      .vo {
        margin-right: 6px;
        font-size: 20px;
      }
    }
  }

  .play_mode {
    width: 48px;
    position: relative;

    .icon_s {
      // font-weight: bold;
      font-size: 20px !important;
    }

    .tooltip {
      width: 53px;
      padding: 2px 4px;
      background: #fff;
      border-radius: 4px;
      font-size: 13px;
      box-shadow: 0px 2px 32px 4px rgba(0, 0, 0, 0.1), 0px 8px 10px rgba(0, 0, 0, 0.08);
      position: absolute;
      top: -25px;
      left: -8px;
      z-index: 99;
      display: none;
    }

    &:hover .tooltip {
      display: block;
    }
  }

}

.el-slider.is-vertical {
  width: 36px;
  // .el-slider__runway{
  //   height: 100px;
  // }
}

:deep(.el-slider.is-vertical .el-slider__runway) {
  height: 80px;
}

.el-slider.is-vertical :deep(.el-slider__button-wrapper) {
  left: -16px !important;

  .el-slider__button {
    width: 10px;
    height: 10px;
    border: none;
    background: rgb(210, 21, 21);
  }
}
</style>
