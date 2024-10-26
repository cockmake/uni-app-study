<script setup>
import {onLoad} from "@dcloudio/uni-app";
import {ref} from 'vue'
import {API_URL} from "../../base";

const articleData = ref({})
onLoad((option) => {
  uni.showLoading({
    title: '加载中'
  })
  uni.request({
    url: API_URL + '/articles/' + option.hid,
    method: 'GET',
    success: (res) => {
      const data = res.data
      articleData.value = data.data
      if (data.code !== 200 || !data.data) {
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        })
      }
    },
    fail: (error) => {
      console.log(error)
    },
    complete: () => {
      uni.hideLoading()
    }
  })
})
function timeFormat(t) {
  // t是过去的秒数
  // 年前 | 个月前 | 天前 | 小时前 | 分钟前 | 刚刚
  if (t < 60) {
    return '刚刚'
  } else if (t < 60 * 60) {
    return Math.floor(t / 60) + '分钟前'
  } else if (t < 60 * 60 * 24) {
    return Math.floor(t / 60 / 60) + '小时前'
  } else if (t < 60 * 60 * 24 * 30) {
    return Math.floor(t / 60 / 60 / 24) + '天前'
  } else if (t < 60 * 60 * 24 * 30 * 12) {
    return Math.floor(t / 60 / 60 / 24 / 30) + '个月前'
  } else {
    return Math.floor(t / 60 / 60 / 24 / 30 / 12) + '年前'
  }
}
</script>

<template>
  <view class="article-detail">
    <view style="width: 100%">
      <uni-title :title="articleData.title" align="center" type="h1"/>
    </view>
    <view
        style="display: flex; flex-direction: row; align-items: center; justify-content: space-around; flex-wrap: nowrap; width: 100%">
      <text class="uni-body">发表于：{{ timeFormat(articleData.pastime) }}</text>
      <text class="uni-body">阅读量：{{ articleData.pageViews }}</text>
      <text class="uni-body">作者：{{ articleData.author }}</text>
    </view>
    <view class="text-box">
      <text>{{articleData.article}}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.article-detail{
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.text-box{
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  margin-top: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #333;
  line-height: 1.5;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: justify;
  text-justify: inter-ideograph;
}
</style>