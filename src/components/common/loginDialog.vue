<template>
  <el-dialog :model-value="visible" width="360" :show-close="false" align-center draggable>
    <template #header="{ close }">
      <div class="my_header">
        <el-icon :size="18" @click="close">
          <Close />
        </el-icon>
        <div class="qrCode_box" v-if="!qr_code_show" @click="qrCodeLogin">
          <div class="img-box">
            <img src="../../assets/img/qrcode_click.jpg" alt="">
          </div>
          <div class="out"></div>
        </div>
      </div>
    </template>

    <div class="body" v-if="!qr_code_show">
      <!-- logo -->
      <div class="logo-wrap">
        <img class="logo" src="../../assets/img/logo.png" alt="" />
      </div>

      <el-form :model="form">
        <div class="flexs">
          <!-- 国家区号下拉菜单部分 -->
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
                <li v-for="(item, index) in countriesList" @click="setArea(item.code)">
                  <span>{{ item.zh }}</span>
                  <span>+{{ item.code }}</span>
                </li>
              </ul>
            </div>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item class="dis-flex">
            <el-input v-model="form.phone" class="phone-input" @focus="clearVerify" placeholder="请输入手机号" />
          </el-form-item>
        </div>

        <el-form-item>
          <!-- 密码 -->
          <el-input v-if="loginMode == 0" type="password" show-password v-model="form.password" class="password-input"
            @focus="clearVerify" placeholder="请输入密码">
            <template #prefix>
              <el-icon class="el-icon-suf">
                <Lock />
              </el-icon>
            </template>
          </el-input>
          <!-- 验证码 -->
          <div class="flex-start" v-if="loginMode == 1">
            <el-input v-model="form.captcha" class="captcha-input" @focus="clearVerify" placeholder="请输入验证码">
              <template #prefix>
                <el-icon class="el-icon-suf">
                  <Key />
                </el-icon>
              </template>
            </el-input>
            <!-- 获取验证码 -->
            <div class="code-box" @click="sentCode">
              <span>|</span>
              <span>{{ codeBtn }}</span>
            </div>
          </div>

        </el-form-item>
        <div class="sub-box">
          <span v-if="verify" class="verify">{{ verify }}</span>
          <div class="auth">
            <!-- <span v-if="loginModeText == '验证码登录'" @click="forgetPwd">忘记密码</span> -->
            <!-- <i v-if="loginModeText == '验证码登录'">|</i> -->
            <span @click="codeLogin">{{ loginModeText }}</span>
          </div>
        </div>
        <div class="sign" @click="sign">登录</div>
      </el-form>
      <p class="suggest">建议使用二维码扫码登录</p>
    </div>
    <div class="qrCode_content" v-if="qr_code_show">
      <h3>扫码登录</h3>
      <el-image class="img" :src="qrCodeImg" loading="lazy" />
      <p class="hint">请使用官方app扫码登录</p>
      <div class="other" @click="otherLogin">
        <p>选择其他登录模式</p>
        <i class="iconfont">&#xe65f;</i>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, inject, onMounted, onBeforeUnmount } from "vue";
import cookie from "js-cookie";
import $api from "../../api/api";
import md5 from 'js-md5'

let p = defineProps({
  visible: {
    type: Boolean
  }
})

var reload = inject('reload')

const verify = ref("");
const dropTarget = ref(false);
const codeBtn = ref("获取验证码");
const codeTimer = ref(60);
const timer = ref(null);
const loginModeText = ref('验证码登录')
const isCode = ref(true)
const qr_code_show = ref(true)
const qrCodeImg = ref('')
const unikey = ref('')
const times = ref(null)
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

// 二维码登录
const qrCodeLogin = () => {
  qr_code_show.value = true
  $api.qrCodeKey().then((res) => {
    unikey.value = res.data.unikey
    $api.qrCodePic({
      key: res.data.unikey,
      qrimg: 'base64'
    }).then((res) => {
      // console.log(res);
      qrCodeImg.value = res.data.qrimg
      qrCode_login_status()
    })
  })
}
const otherLogin = () => {
  qr_code_show.value = false
}

const qrCode_login_status = () => {
  times.value = setInterval(() => {
    $api.qrCodeDete({
      key: unikey.value
    }).then((res) => {
      // console.log(res);
      if (res.code == 800 || res.code == 803) {
        clearInterval(times.value )
        times.value = null
      }
      if (res.code == 803) {
        cookie.set('ssoToken', res.cookie, { expires: 30 })
        clearInterval(times.value )
        times.value = null
        $api.userData().then(res => {
          // console.log(res,'resssssss');
          cookie.set('userId', res.account.id, { expires: 30 })
          reload.reload()
          close()
        })
      }
    })
  }, 2000)
}

// 登录
const sign = () => {
  let payload = {
    countrycode: Number(form.areaCode.slice(1)), // 国家区号
    phone: Number(form.phone), // 手机号
    captcha: Number(form.captcha), // 验证码
    md5_password: md5(form.password) // 密码
  }
  if (loginMode.value == 0) {
    delete payload.captcha
  }
  if (loginMode.value == 1) {
    delete payload.md5_password
  }
  // console.log(cookie.set("22", "asdasdasd", 1));
  if (form.phone.length != 11 || Number(form.phone) == NaN) {
    verify.value = "请输入11位手机号";
  } else if (form.phone == "") {
    verify.value = "请输入手机号";
  } else if (form.password == "" && loginMode.value == 0) {
    verify.value = "请输入登录密码";
  } else if (form.captcha == '' && loginMode.value == 1) {
    verify.value = "请输入验证码";
  } else {
    $api.checkPhone({ phone: form.phone }).then(res => {
      // 已注册继续登录
      if (res.exist == 1) {
        $api.phoneLogin(payload)
          .then((res) => {
            // console.log(res);
            cookie.set('ssoToken', res.cookie, { expires: 30 })
            cookie.set('userId', res.profile.userId, { expires: 30 })
            cookie.set('token', res.token, { expires: 30 })
            reload.reload()
            close()
          });
      } else {
        verify.value = "请前往官方网站注册"
      }
    })
  }
};
// 发送验证码
const sentCode = () => {
  if (form.phone == "") {
    verify.value = "请输入手机号";
  } else if (form.phone.length != 11 || Number(form.phone) == NaN) {
    verify.value = "请输入11位手机号";
  } else {
    if (isCode.value) {
      $api
        .sentCode({
          phone: form.phone,
          ctcode: Number(form.areaCode.slice(1)),
        })
        .then((res) => {
          timer.value = setInterval(() => {
            if (codeTimer.value == 0) {
              clearInterval(timer.value);
              timer.value = null;
              codeBtn.value = "重新获取";
              codeTimer.value = 60;
              isCode.value = true
              return;
            }
            isCode.value = false
            codeTimer.value--;
            codeBtn.value = `00:${codeTimer.value > 10 ? codeTimer.value : "0" + codeTimer.value
              }`;
          }, 1000);
        });
    }
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
// 切换登录方式
const codeLogin = () => {
  loginModeText.value = loginModeText.value == '验证码登录' ? '密码登录' : '验证码登录'
  loginMode.value = loginMode.value == 0 ? 1 : 0
}
onMounted(() => {
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
  qrCodeLogin()
})
onBeforeUnmount(()=>{
  clearInterval(times.value)
})
</script>
<style lang="less" scoped>
:deep(.el-icon) {
  cursor: pointer;
}

.my_header {
  position: relative;

  .qrCode_box {
    position: absolute;
    right: -20px;
    top: -20px;
    cursor: pointer;

    .img-box {
      width: 46px;
      height: 46px;
      background: rgb(226, 224, 224);
      border-radius: 0 10px 0 0;

      img {
        width: 40px;
        height: 40px;
        border-radius: 0 10px 0 0;
        margin-top: 6px;
      }
    }

    .out {
      border-radius: 0 10px 0 0;
      border: 23px solid;
      border-color: transparent transparent #fff #fff;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}

.body {
  .logo-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 60px;

    .logo {
      width: 70px;
      height: 70px;
      margin: 0 auto;
    }
  }

  .el-form {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    :deep(.el-form-item) {
      margin-bottom: 4px;
    }

    :deep(.el-input__inner) {
      font-size: 13px;
    }

    .flexs {
      display: flex;
      align-content: center;
    }

    .input-area {
      :deep(.el-input__inner) {
        cursor: pointer;
        font-size: 12px;
      }
    }

    .w-50 {
      width: 100px;
      height: 40px;
      cursor: pointer;

      :deep(.el-input__wrapper) {
        border-radius: 6px 0 0 0;
        border-left: 1px solid #dcdfe6;
        border-top: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        box-shadow: none;
      }
    }

    .el-icon-suf {
      font-size: 15px;
    }

    .phone-input {
      width: 200px;
      height: 40px;

      :deep(.el-input__wrapper) {
        border-radius: 0 6px 0 0;
        border-left: 0px solid;
        border-top: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        box-shadow: none;
      }
    }

    .dis-flex {
      display: inline-block;
      margin-bottom: 0;
    }

    .password-input {
      width: 300px !important;

      :deep(.el-input__wrapper) {
        border-right: 1px solid #dcdfe6 !important;
        border-radius: 0 0 6px 6px !important;
      }
    }

    .password-input,
    .captcha-input {
      width: 200px;
      height: 40px;

      :deep(.el-input__wrapper) {
        border-radius: 0 0 0 6px;
        border-left: 1px solid #dcdfe6;
        border-top: 0px solid #dcdfe6;
        border-right: 0px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        box-shadow: none;
      }
    }

    .code-box {
      cursor: pointer;
      width: 100px;
      height: 39px;
      border-radius: 0 0 6px 0;
      border-right: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      display: flex;
      align-items: center;
      font-size: 13px;

      span {
        &:nth-child(1) {
          margin-right: 10px;
          color: #adadad;
        }

      }
    }

    .sub-box {
      height: 50px;
      width: 410px;
      font-size: 12px;

      .verify {
        padding: 0 4px;
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
      width: 300px;
      height: 40px;
      background: #f03535;
      border-radius: 8px;
      color: #fff;
      font-size: 15px;
      text-align: center;
      line-height: 40px;
      letter-spacing: 8px;
      margin-top: 10px;
      cursor: pointer;
    }
  }

  .drop-down {
    position: absolute;
    top: 40px;
    width: 300px;
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

  .suggest {
    font-size: 13px;
    margin: 50px 0 24px 0;
    text-align: center;
  }
}

.qrCode_content {
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-size: 27px;
    color: #333;
    font-weight: normal;
  }

  .img {
    width: 180px;
    height: 180px;
    margin: 20px 0 14px 0;
  }

  .hint {
    font-size: 14px;
  }

  .other {
    display: flex;
    margin-top: 60px;
    cursor: pointer;

    p {
      font-size: 12px;
    }

    i {
      font-size: 12px;
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
