<template>
  <el-dialog :model-value="addPM" width="30%" :show-close="false" align-center draggable>
    <template #header="{ close }">
      <div class="my_header">
        <el-icon class="icon" :size="18" @click="close">
          <Close />
        </el-icon>
        <h4>新建歌单</h4>
      </div>
    </template>
    <div class="body">
      <el-input v-model="songTitle" placeholder="请输入新歌单标题"></el-input>
      <el-checkbox v-model="privacy" label="设置为隐私歌单" size="large" />
      <div class="create" @click="create">创建</div>
    </div>
  </el-dialog>
</template>
<script setup>
import { nextTick, ref } from "vue"
import $api from '../../api/api'
import { ElMessage } from 'element-plus'

defineProps({
  addPM: {
    type: Boolean
  }
})
const songTitle = ref('')
const privacy = ref(false)

const emit = defineEmits(['playlist', 'close'])

const create = () => {
  $api.createPlaylist({
    name: songTitle.value,
    privacy: privacy.value ? '10' : ''
  }).then((res) => {
    // console.log(res);
    if (res.code == 200) {
      nextTick(() => {
        ElMessage({ message: '新建歌单成功', type: 'success' })
        emit('playlist')
        emit('close')
      })
    }
  })
}

</script>
<style lang="less" scoped>
.my_header {
  display: flex;

  h4 {
    text-align: center;
    flex: 1;
  }

  .icon {
    cursor: pointer;
  }
}

.body {
  margin-top: 30px;

  .create {
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

  :deep(.el-checkbox__input.is-checked+.el-checkbox__label) {
    color: #666;
  }
}
</style>
