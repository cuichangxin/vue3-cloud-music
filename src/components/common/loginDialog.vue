<template>
  <el-dialog v-model="visible" width="25%" :show-close="false" align-center style="height:300px">
    <template #header="{ close }">
      <div class="my_header">
        <el-icon :size="18" @click="close">
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="body">
      <div class="logo-wrap">
        <img class="logo" src="../../assets/img/logo.png" alt="" />
      </div>
      <el-form :model="form">
        <div class="flexs">
          <el-form-item class="dis-flex">
            <el-dropdown trigger="click">
              <el-input v-model="areaCode" :readonly="true" class="w-50">
                <template #prefix>
                  <el-icon class="el-icon-suf">
                    <Iphone />
                  </el-icon>
                </template>
                <template #suffix>
                  <el-icon class="el-icon-suf">
                    <CaretBottom />
                  </el-icon>
                </template>
              </el-input>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(item, index) in countriesList">
                    {{ item.zh }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-form-item>
          <el-form-item class="dis-flex">
            <el-input v-model="phone" class="phone-input" />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>
<script setup>
import { toRefs, reactive, ref } from 'vue';

import $api from '../../api/api'
const props = defineProps({
  visible: Boolean
})
const { visible } = toRefs(props)
const areaCode = ref('+868')
const phone = ref()

var countriesList = reactive([])
$api.getCountries().then(res => {
  // console.log(res);
  let countryList = []
  res.data.map(item => {
    item.countryList.map(vv => {
      countryList.push(vv)
    })
  })
  countriesList = countryList
  console.log(countriesList);
})
</script>
<style lang="less" scoped>
:deep(.el-icon) {
  cursor: pointer;
}

.body {
  .logo-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 60px;

    .logo {
      width: 90px;
      height: 90px;
      margin: 0 auto;
    }
  }

  .el-form {
    display: flex;
    justify-content: center;

    .flexs {
      display: flex;
      align-content: center;
    }

    .w-50 {
      width: 110px;
      height: 40px;
      cursor: pointer;

      :deep(.el-input__wrapper) {
        border-radius: 6px 0 0 6px;
        border-left: 2px solid #dcdfe6;
        border-top: 2px solid #dcdfe6;
        border-right:2px solid #dcdfe6;
        border-bottom: 2px solid #dcdfe6;
        box-shadow: none;
      }
    }

    .el-icon-suf {
      font-size: 18px;
    }

    :deep(.el-input__inner) {
      cursor: pointer;
    }

    .phone-input {
      width: 300px;
      height: 40px;
      :deep(.el-input__wrapper){
        border-radius: 0 6px 6px 0;
        border-left: 0px solid;
        border-top: 2px solid #dcdfe6;
        border-right:2px solid #dcdfe6;
        border-bottom: 2px solid #dcdfe6;
        box-shadow: none;
      }
    }

    .dis-flex {
      display: inline-block;

      &:nth-child(1) {
        width: 110px;
      }
    }
  }
}
</style>
