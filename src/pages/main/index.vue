<script setup>
import Home from '../../tabs/home/index.vue'
import ArticlePublish from '../../tabs/article-publish/index.vue'
import {ref} from 'vue'

const tabIndex = ref(0)


function tabChange(index) {
  tabIndex.value = index
  switch (index) {
    case 0:
      uni.setNavigationBarTitle({
        title: '首页'
      })
      break
    case 1:
      uni.setNavigationBarTitle({
        title: '发表文章'
      })
      break
    case 2:
      uni.setNavigationBarTitle({
        title: '备选'
      })
      break
    case 3:
      uni.setNavigationBarTitle({
        title: '我的'
      })
      break
    default:
      break
  }
}

</script>

<template>
  <view v-show="tabIndex === 0">
    <Home/>
  </view>
  <view v-show="tabIndex === 1">
    <ArticlePublish/>
  </view>


  <view>
    <uv-tabbar :value="tabIndex" :fixed="true" @change="tabChange" >
      <uv-tabbar-item text="首页" icon="home"></uv-tabbar-item>
      <uv-tabbar-item text="发表" icon="file-text"></uv-tabbar-item>
      <uv-tabbar-item text="备选" icon="play-right"></uv-tabbar-item>
      <uv-tabbar-item text="我的" icon="account"></uv-tabbar-item>
    </uv-tabbar>
  </view>

</template>

<style scoped lang="scss">

</style>