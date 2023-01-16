<template>
  <el-dialog v-model="visible" width="22%" :show-close="false" align-center>
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
            <div class="input-area" @click="openDrop">
              <el-input v-model="form.areaCode" :readonly="true" class="w-50">
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
            </div>
            <div class="drop-down" v-show="dropTarget">
              <ul>
                <li
                  v-for="(item, index) in countriesList"
                  @click="setArea(item.code)"
                >
                  <span>{{ item.zh }}</span>
                  <span>+{{ item.code }}</span>
                </li>
              </ul>
            </div>
          </el-form-item>
          <el-form-item class="dis-flex">
            <el-input
              v-model="form.phone"
              class="phone-input"
              @focus="clearVerify"
            />
          </el-form-item>
        </div>
        <el-form-item>
          <el-input
            v-if="loginMode == 0"
            v-model="form.password"
            class="password-input"
            @focus="clearVerify"
          >
            <template #prefix>
              <el-icon class="el-icon-suf"><Lock /></el-icon>
            </template>
          </el-input>
          <div class="flex-start" v-if="loginMode == 1">
            <el-input
              v-model="form.captcha"
              class="captcha-input"
              @focus="clearVerify"
            >
              <template #prefix>
                <el-icon class="el-icon-suf"><Key /></el-icon>
              </template>
            </el-input>
            <div class="code-box" @click="sentCode">
              <span>|</span>
              <span>{{ codeBtn }}</span>
            </div>
          </div>
        </el-form-item>
        <div class="sub-box">
          <span v-if="verify" class="verify">{{ verify }}</span>
          <div class="auth">
            <span v-if="loginModeText == '验证码登录'">忘记密码</span>
            <i v-if="loginModeText == '验证码登录'">|</i>
            <span @click="codeLogin">{{ loginModeText }}</span>
          </div>
        </div>
        <div class="sign" @click="sign">登录</div>
      </el-form>
    </div>
  </el-dialog>
</template>
<script setup>
import { toRefs, ref, reactive } from "vue";
import cookie from "js-cookie";
import $api from "../../api/api";
const props = defineProps({
  visible: Boolean,
});
const verify = ref("");
const { visible } = toRefs(props);
const dropTarget = ref(false);
const codeBtn = ref("获取验证码");
const codeTimer = ref(60);
const timer = ref(null);
const loginModeText = ref('验证码登录')
/**
 * 0 密码登录
 * 1 验证码登录
*/
const loginMode = ref(0)
const form = reactive({
  areaCode: "+86",
  phone: "",
  captcha: "",
  password: "",
});

var countriesList = ref([]);

$api.getCountries().then((res) => {
  // console.log(res);
  let countryList = [];
  res.data.map((item) => {
    item.countryList.map((vv) => {
      countryList.push(vv);
    });
  });
  countriesList.value = countryList;
});

// 登录
const sign = () => {
  // console.log(cookie.set("22", "asdasdasd", 1));
  if (form.phone.length != 11 || Number(form.phone) == NaN) {
    verify.value = "请输入11位手机号";
  } else if (form.phone == "") {
    verify.value = "请输入手机号";
  } else if (form.password == "") {
    verify.value = "请输入登录密码";
  } else if (form.captcha == ''){
    verify.value = "请输入验证码";
  }else {
    $api
      .phoneLogin({
        countrycode: Number(form.areaCode.slice(1)),
        phone: Number(form.phone),
        captcha: "",
      })
      .then((res) => {
        console.log(res);
        cookie.set('ssoToken',res.cookie,{ expires: 30 })
      });
  }
};
// 发送验证码
const sentCode = () => {
  if (timer) return
  if (form.phone == "") {
    verify.value = "请输入手机号";
  } else if (form.phone.length != 11 || Number(form.phone) == NaN) {
    verify.value = "请输入11位手机号";
  } else {
    $api
      .sentCode({
        phone: form.phone,
        ctcode: Number(form.areaCode.slice(1)),
      })
      .then((res) => {
        timer = setInterval(() => {
          if (codeTimer.value == 0) {
            clearInterval(timer);
            timer.value = null;
            codeBtn.value = "重新获取";
            codeTimer.value = 60;
            return;
          }
          codeTimer.value--;
          codeBtn.value = `00:${
            codeTimer.value > 10 ? codeTimer.value : "0" + codeTimer.value
          }`;
        }, 1000);
      });
  }
};

// 清除验证提示信息
const clearVerify = () => {
  verify.value = "";
};
// 区号下拉菜单显示/隐藏
const openDrop = () => {
  dropTarget.value = !dropTarget.value;
};
// 下拉菜单单项点击
const setArea = (data) => {
  form.areaCode = "+" + data;
  dropTarget.value = false;
};

const codeLogin = ()=>{
  loginModeText.value = loginModeText.value == '验证码登录' ? '密码登录' : '验证码登录' 
  loginMode.value = loginMode.value == 0 ? 1 : 0
}
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
      width: 80px;
      height: 80px;
      margin: 0 auto;
    }
  }

  .el-form {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .flexs {
      display: flex;
      align-content: center;
    }
    .input-area {
      :deep(.el-input__inner) {
        cursor: pointer;
      }
    }
    .w-50 {
      width: 110px;
      height: 40px;
      cursor: pointer;

      :deep(.el-input__wrapper) {
        border-radius: 6px 0 0 0;
        border-left: 2px solid #dcdfe6;
        border-top: 2px solid #dcdfe6;
        border-right: 2px solid #dcdfe6;
        border-bottom: 2px solid #dcdfe6;
        box-shadow: none;
      }
    }

    .el-icon-suf {
      font-size: 18px;
    }

    .phone-input {
      width: 300px;
      height: 40px;
      :deep(.el-input__wrapper) {
        border-radius: 0 6px 0 0;
        border-left: 0px solid;
        border-top: 2px solid #dcdfe6;
        border-right: 2px solid #dcdfe6;
        border-bottom: 2px solid #dcdfe6;
        box-shadow: none;
      }
    }

    .dis-flex {
      display: inline-block;
      margin-bottom: 0;

      &:nth-child(1) {
        width: 110px;
      }
    }
    .password-input{
      width:410px !important;
      :deep(.el-input__wrapper) {
        border-right: 2px solid #dcdfe6 !important;
        border-radius: 0 0 6px 6px !important;
      }
    }
    .password-input,.captcha-input {
      width: 299px;
      height: 40px;
      :deep(.el-input__wrapper) {
        border-radius: 0 0 0 6px;
        border-left: 2px solid #dcdfe6;
        border-top: 0px solid #dcdfe6;
        border-right: 0px solid #dcdfe6;
        border-bottom: 2px solid #dcdfe6;
        box-shadow: none;
      }
    }
    .code-box {
      cursor: pointer;
      width: 110px;
      height: 40px;
      border-radius: 0 0 6px 0;
      border-right: 2px solid #dcdfe6;
      border-bottom: 2px solid #dcdfe6;
      display: flex;
      align-items: center;
      font-size: 14px;
      span {
        &:nth-child(1) {
          margin-right: 10px;
          color: #adadad;
        }
        &:nth-child(2) {
          
        }
      }
    }
    .sub-box {
      height: 50px;
      width: 410px;
      font-size: 14px;
      .verify {
        padding: 0 10px;
        width: 410px;
        color: rgb(226, 42, 42);
      }
      .auth {
        cursor: pointer;
        text-align: right;
        span {
          margin: 0 10px;
          color: #4466ad;
        }
      }
    }
    .sign {
      width: 410px;
      height: 40px;
      background: #ff3a3a;
      border-radius: 8px;
      color: #fff;
      font-size: 17px;
      text-align: center;
      line-height: 40px;
      letter-spacing: 8px;
      margin-top: 10px;
    }
  }
  .drop-down {
    position: absolute;
    top: 42px;
    width: 410px;
    height: 200px;
    background: #fff;
    border-radius: 0 0 8px 8px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    z-index: 2018;
    overflow-y: auto;
    ul {
      li {
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        &:hover {
          background: #eee;
        }
      }
    }
  }
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  background-color: #8f8e8e;
}
</style>
