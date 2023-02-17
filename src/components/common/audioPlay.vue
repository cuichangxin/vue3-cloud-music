<template>
  <div class="audio_wrap">
    <div class="song" :style="JSON.stringify(songBasicData) !== '{}' ? '' :'visibility:hidden;'">
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
        <div class="prev">
          <i class="iconfont">&#xe63d;</i>
        </div>
        <div class="center-play" @click="audioPlay">
          <i v-if="!playTarget" class="iconfont play">&#xea82;</i>
          <i v-else class="iconfont pause">&#xe69d;</i>
        </div>
        <div class="next">
          <i class="iconfont">&#xe63e;</i>
        </div>
      </div>
    </div>
    <div class="right_control">
      <div class="play_mode" @click="modeChange">
        <i v-if="modeNum == 1" class="iconfont">&#xe6a2;</i>
        <i v-if="modeNum == 2" class="iconfont">&#xe604;</i>
        <i v-if="modeNum == 3" class="iconfont">&#xe605;</i>
        <i v-if="modeNum == 4" class="iconfont">&#xe6a1;</i>
      </div>
      <div class="at_play">
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
  </div>
</template>
<script setup>
import Progress from './progress.vue'
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

watch(songData, (n) => {
  clearInterval(timer.value)
  timer.value = null
  songBasicData.value = n
  $api.songUrl({ id: n.id }).then((res) => {
    // console.log(res);
    songBasicData.value.url = res.data[0].url
    nextTick(() => {
      audio.value.play()
      playTarget.value = true
      songTime() // 马上执行
      timer.value = setInterval(() => {songTime()},1000)
      setTimeout(() => {
        // 歌曲总时长
        songBasicData.value.duration = formatTime(audio.value.duration)
        progressDetail.duration = audio.value.duration
      }, 150)
    })
  })
})
const songTime = () => {
  // 歌曲当前时长
  songBasicData.value.currentTime = formatTime(audio.value.currentTime)
  progressDetail.currentTime = audio.value.currentTime
  // 当前时长等于歌曲总时长清除定时器
  if (songBasicData.value.currentTime == songBasicData.value.duration) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const progress_time = (val) => {
  // console.log(val);
  songBasicData.value.currentTime = formatTime(val)
  clearInterval(timer.value)
}
const progress_curr = (val) => {
  audio.value.currentTime = val
  songTime()
  timer.value = setInterval(() => {songTime()},1000)
}
const audioPlay = () => {
  playTarget.value = !playTarget.value
  if (playTarget.value) {
    audio.value.play()
    songTime() // 马上执行
    timer.value = setInterval(() => {
      songTime()
    },1000)
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
onMounted(() => {
  // console.log(audio.value);
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
