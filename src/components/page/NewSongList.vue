<template>
  <div class="p-30">
    <SubTitle>最新音乐</SubTitle>
    <ul>
      <li v-for="(item, index) in newSongList" :key="index" :class="idx == index ? 'active' : ''"
        @click="bgHover(index)">
        <div class="border">
          <div class="left-box" @click="playSong(item)">
            <img :src="item.picUrl">
            <span>{{ index< 9? '0' + (index + 1) : index + 1 }}</span>
            <div class="play_btn">
              <i class="iconfont">&#xea82;</i>
            </div>
          </div>
          <div class="right-box">
            <div class="name-box">
              <span class="name text-1">{{ item.name }}</span>
              &nbsp;&nbsp;
              <span v-if="item.song.alias.length" class="sub_name text-1">({{
                item.song.alias[0]
              }})</span>
            </div>
            <div class="song_wrap">
              <span class="tone">{{ item.song.privilege.playMaxBrLevel == 'lossless' ? 'SQ' : 'Hi-Res' }}</span>
              <div class="singer text-1" @click.stop="singer">
                {{ item.song.alterName.join('/') }}
              </div>
            </div>
          </div>
          <div class="mv" v-if="item.song.mvid !== 0">
            <i class="iconfont">&#xea82;</i>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template> 
<script setup>
import { ref } from 'vue';
import SubTitle from '../common/SubTitle.vue';
import { mainStore } from '../../stores/index'

defineProps({
  newSongList: {
    type: Array
  }
})

const store = mainStore()

const idx = ref(null)
const playSong = (data) => {
  store.addSongUrl(data)
}
const singer = () => { }
const bgHover = (index) => {
  idx.value = index
}
</script>
<style lang="less" scoped>
ul {
  height: 500px;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;

  li {
    width: 48%;
    display: flex;
    justify-content: center;
    border-radius: 3px;
    position: relative;

    &.active {
      background: #f2f0f0;
    }

    &:hover {
      background: #f2f0f0;
    }

    &:nth-child(5) .border,
    &:nth-child(10) .border {
      border-bottom: 0.001rem solid #dad6d6;
    }

    .border {
      width: 96%;
      padding: 10px 0;
      border-top: 0.01rem solid #dad6d6;
      border-bottom: 0.000000001rem solid #dad6d6;
      display: flex;
      align-items: center;

      .left-box {
        display: flex;
        align-items: center;
        position: relative;

        .play_btn {
          width: 25px;
          height: 25px;
          border-radius: 30px;
          color: rgb(217, 28, 28);
          background: rgba(255, 255, 255, .7);
          backdrop-filter: blur(6px);
          position: absolute;
          left: 20px;
          bottom: 20px;
          cursor: pointer;

          i {
            font-size: 13px;
            position: absolute;
            top: 50%;
            left: 54%;
            transform: translate(-50%, -50%);
          }
        }

        img {
          width: 65px;
          height: 65px;
          border-radius: 6px;
          margin-right: 12px;
          cursor: pointer;
        }

        span {
          font-size: 13px;
          color: #b3b0b0;
          margin-right: 15px;
        }
      }

      .right-box {
        .name-box {
          width: 240px;
          display: flex;
          justify-content: flex-start;
          .name{
            display: inline-block;
            // flex: 1;
            // width: 240px;
          }
          .sub_name {
            flex: 1;
            display: inline-block;
            width: 180px;
            color: #b3b0b0;
          }
        }

        .song_wrap {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #706e6e;

          .tone {
            padding: 0 2px;
            height: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 1;
            border: 1px solid #ffb61e;
            border-radius: 3px;
            color: #ffb61e;
            transform: scale(0.9);
            margin-right: 2px;
          }

          .singer {
            width: 168px;
            span {
              display: flex;
              justify-content: flex-start;
              p {
                &:hover {
                  color: #333;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }

      .mv {
        width: 15px;
        height: 11px;
        border: 1px solid rgb(223, 19, 19);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 40px;
        cursor: pointer;

        &:hover {
          opacity: 0.7;
        }

        i {
          color: rgb(223, 19, 19);
          font-size: 12px;
          transform: scale(0.5);
        }
      }
    }
  }
}
</style>
