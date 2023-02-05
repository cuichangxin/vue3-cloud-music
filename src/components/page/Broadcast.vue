<template>
  <div class="wrap">
    <SubTitle>独家放送</SubTitle>
  </div>
</template>
<script setup>
import SubTitle from '../common/SubTitle.vue';
import $api from '../../api/api'
import { onMounted } from 'vue'

const getPlist = () => {
  $api.privatecontent({
    limit: 4
  }).then((res) => {
    console.log(res);
  })
}
onMounted(() => {
  getPlist()
})
</script>
<style lang="less" scoped>
.wrap {
  padding: 0 30px;
}
</style>
