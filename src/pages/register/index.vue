<template>
  <view class="register-form-box">
    <view class="register-form">
      <uv-form labelPosition="left" :model="registerForm" ref="form" label-width="80px">
        <uv-form-item label="昵称" prop="nickName">
          <uv-input v-model="registerForm.nickName" border="bottom" placeholder="请输入昵称">
          </uv-input>
        </uv-form-item>

        <uv-form-item label="用户名" prop="userName">
          <uv-input v-model="registerForm.userName" border="bottom" placeholder="请输入用户名">
          </uv-input>
        </uv-form-item>

        <uv-form-item label="密码" prop="userPwd">
          <uv-input v-model="registerForm.userPwd" border="bottom" password placeholder="请输入密码">
          </uv-input>
        </uv-form-item>

        <uv-form-item label="确认密码" prop="userPwdRe">
          <uv-input v-model="registerForm.userPwdRe" border="bottom" password placeholder="请再次输入密码">
          </uv-input>
        </uv-form-item>
        <uv-button type="primary" text="提交" customStyle="margin-top: 20rpx" @click="registerFormSubmit"></uv-button>
        <uv-button type="warning" text="重置" customStyle="margin-top: 20rpx" @click="registerFormReset"></uv-button>

      </uv-form>
    </view>

    <uv-notify ref="notify">
      <template v-slot:icon>
        <view style="margin-right: 10rpx">
          <uv-icon :name="iconName" color="white"/>
        </view>
      </template>
    </uv-notify>
  </view>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {onLoad, onHide, onShow, onReady} from "@dcloudio/uni-app";
import {API_URL} from "../../base";
import {encryptPassword} from "../../utils/encryption";

const registerForm = reactive({
  nickName: '',
  userName: '',
  userPwd: '',
  userPwdRe: '',
})

const form = ref()
const notify = ref()
const iconName = ref('checkmark-circle')

function registerSuccessNavigateToHome() {
  uni.showToast({
    title: '为您跳转首页'
  })
  setTimeout(() => {
    uni.hideToast();
    uni.navigateBack();
  }, 1000)
}

function registerFormSubmit() {
  // 判断两次密码是否一致
  if (registerForm.userPwd !== registerForm.userPwdRe) {
    uni.showToast({
      title: '两次密码不一致',
      duration: 1000 * 4,
      icon: 'error'
    });
    return
  }
  uni.showLoading({
    title: '加载中'
  });
  uni.request({
    url: API_URL + '/users/register',
    method: 'POST',
    data: {
      nickName: registerForm.nickName,
      userName: registerForm.userName,
      userPwd: encryptPassword(registerForm.userPwd),
    },
    success: (res) => {
      let data = res.data
      if (data.code === 200) {
        iconName.value = "checkmark-circle"
        notify.value.show({
          type: 'success',
          message: '注册成功',
          duration: 1000 * 4,
        })
        // 跳转回登录页
        registerSuccessNavigateToHome();
      } else {
        iconName.value = "close-circle"
        notify.value.show({
          type: 'error',
          message: data.message,
          duration: 1000 * 4,
        })
      }
    },
    fail: (err) => {
      console.log(err)
    },
    complete: () => {
      uni.hideLoading();
    }
  })
}

function registerFormReset() {
  form.value.resetFields()
}

onLoad(() => {
  console.log("注册页面 onLoad")

})
onReady(() => {
  // 这里可以使用dom

})

onShow(() => {
  console.log("注册页面 onShow")
})

onHide(() => {
  console.log("注册页面 onHide")
})
</script>


<style scoped lang="scss">
.register-form-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;

  .register-form {
    margin-top: 3rem;
    width: 90%;
  }
}
</style>
