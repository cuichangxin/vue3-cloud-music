<template>
  <ul v-show="visible" class="ul" :style="{left:x + 'px', top: y + 'px'}">
    <li @click="play" :class="disabled ? 'disabled' : ''">播放</li>
    <li @click="nextPlay" :class="disabled ? 'disabled' : ''">下一首播放</li>
    <hr>
    <li @click="copyUrl">复制链接</li>
    <hr v-if="p.data.name !== '我喜欢的音乐'">
    <li v-if="p.data.name !== '我喜欢的音乐'" @click="editPlay">编辑歌单信息</li>
    <li v-if="p.data.name !== '我喜欢的音乐'" @click="removeDialog = true">删除歌单</li>
  </ul>

  <el-dialog v-model="removeDialog" width="30%" :show-close="false" align-center draggable>
    <template #header="{ close }">
      <div class="my_header">
        <el-icon class="icon" :size="18" @click="close">
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="body">
      确认删除该歌单？
      <div class="create" @click="enter">确定</div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import $api from '../../api/api'

let p = defineProps({
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object
  }
})
let emit = defineEmits(['playlist'])

const visible = ref(false)
const removeDialog = ref(false)

const play = () => { }
const nextPlay = () => { }
const copyUrl = () => { }
const editPlay = () => { }

const startMenu = () => {
  visible.value = true
}
const closeMenu = () => {
  visible.value = false
}

const enter = () => {
  $api.removePlaylist({
    id: p.data.id
  }).then((res) => {
    removeDialog.value = false
    emit('playlist')
  })
}

watch(visible, (n, o) => {
  if (n) {
    document.addEventListener('click', closeMenu)
  } else {
    document.removeEventListener('click', closeMenu)
  }
})
defineExpose({
  startMenu
})
</script>
<style lang="less" scoped>
ul {
  min-width: 120px;
  // min-height: 90px;
  background: rgba(225, 225, 229, 0.9);
  border-radius: 10px;
  border: 1px solid #cccaca;
  position: fixed;
  left: 0;
  top: 0;
  font-size: 13px;
  padding: 8px 16px 8px 8px;
  z-index: 999;
  backdrop-filter: blur(3px);

  li {
    width: 100%;
    height: 25px;
    border-radius: 4px;
    line-height: 25px;
    padding-left: 8px;
    cursor: pointer;

    &:hover {
      background: #4c8dae;
      color: #fff;
    }

    &.disabled {
      pointer-events: none;
    }
  }

  hr {
    border: none;
    height: 1px;
    background: #cccaca;
  }
}

.icon {
  cursor: pointer;
}

.body {
  text-align: center;

  .create {
    margin-top: 30px;
    width: 100px;
    height: 35px;
    // background: rgb(236, 37, 37);
    border-radius: 20px;
    color: #fff;
    text-align: center;
    line-height: 35px;
    font-size: 14px;
    letter-spacing: 4px;
    margin: 20px 50% 0 50%;
    transform: translateX(-50%);
    cursor: pointer;
    background: #ed213a;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, rgb(237, 33, 58), rgb(196, 54, 38));
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, rgb(237, 33, 58), rgb(196, 54, 38));
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
}
</style>
