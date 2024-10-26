<template>
  <view class="content">
    <view style="width: 100%; display: flex">
      <view style="width: 30%; margin-left: auto">
        <uv-button icon="account" @click="goRegisterPage">前往注册</uv-button>
      </view>
    </view>


    <view style="margin-top: 10%; width: 90%">
      <uv-form label-position="left" :model="loginForm" ref="form" label-width="120rpx">
        <uv-form-item label="用户名" prop="userName">
          <uv-input placeholder="请输入用户名" border="bottom" v-model="loginForm.userName"></uv-input>
        </uv-form-item>
        <uv-form-item label="密码" prop="userPwd">
          <uv-input placeholder="请输入密码" border="bottom" v-model="loginForm.userPwd" password></uv-input>
        </uv-form-item>
        <view style="margin-top: 10rpx">
          <uv-button type="primary" @click="login">登录</uv-button>
        </view>
      </uv-form>
    </view>

    <view>
      <uv-notify ref="notify">
        <template v-slot:icon>
          <view style="margin-right: 10rpx">
            <uv-icon name="close-circle" color="white"></uv-icon>
          </view>
        </template>
      </uv-notify>
    </view>


  </view>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {API_URL} from "../../base";
import {encryptPassword} from "../../utils/encryption";

const loginForm = reactive({
  userName: '',
  userPwd: ''
})

function goRegisterPage() {
  uni.navigateTo({
    url: '/pages/register/index'
  })
}

const notify = ref()

function login() {
  uni.showToast({
    title: "登录中",
    icon: "loading"
  })
  uni.request({
    url: API_URL + '/users/login',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      userName: loginForm.userName,
      userPwd: encryptPassword(loginForm.userPwd)
    },
    success: (res) => {
      const data = res.data
      if (data.code !== 200) {
        notify.value.show({
          type: 'error',
          message: data.message
        })
      }else{
        uni.setStorageSync('access-token', data.data.token)
        uni.reLaunch({
          url: '/pages/main/index'
        })
      }
    },
    fail: (error) => {
      console.log(error)
    },
    complete: () => {
      uni.hideToast()
    }
  })
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
