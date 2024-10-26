<script setup>
import {onShow, onLoad} from "@dcloudio/uni-app";
import {ref, reactive, onMounted} from 'vue'
import {API_URL, contentHeight} from "../../base";


const articleFindForm = reactive({
  keywords: '',
  tid: null,
  pageSize: 10,
  currentPage: 1
})

const totalNum = ref(50)
const pageData = ref([])
const range = ref([])

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
function goUpdateArticlePage(hid) {
  console.log('goUpdateArticlePage', hid)
  uni.navigateTo({
    url: '/pages/article-update/index?hid=' + hid
  })
}
function change(index) {
  if (index === '') {
    articleFindForm.tid = null
  }
  getArticles()
}

function showArticleDetail(hid) {
  uni.navigateTo({
    url: '/pages/article-detail/index?hid=' + hid
  })
}

function currentPageChange({type, current}) {
  articleFindForm.currentPage = current
  getArticles()
}

function searchIconClick() {
  getArticles()
}

function getArticleTypes() {
  uni.request({
    url: API_URL + '/types/',
    method: 'GET',
    header: {
      'Authorization': uni.getStorageSync('access-token'),
      'content-type': 'application/json'
    },
    success: (res) => {
      const data = res.data
      let tmp = []
      data.data.forEach((item, index) => {
        tmp.push({
          value: item.tid,
          text: item.tname
        })
      })
      range.value = tmp
    },
    fail: (error) => {
      console.log(error)
    },
    complete: () => {

    }
  })
}

function getArticles() {
  uni.showLoading({
    title: '加载中'
  })
  uni.request({
    url: API_URL + '/articles/',
    method: 'POST',
    header: {
      'Authorization': uni.getStorageSync('access-token'),
      'content-type': 'application/json'
    },
    data: articleFindForm,
    success: (res) => {
      const data = res.data
      if (data.code === 200) {
        totalNum.value = data.data.totalNum
        articleFindForm.pageSize = data.data.pageSize
        articleFindForm.currentPage = data.data.currentPage
        pageData.value = data.data.pageData
      }
    },
    fail: (error) => {
      console.log(error)
    },
    complete: () => {
      uni.hideLoading()
    }
  })
}

onLoad(() => {
  getArticleTypes()
  getArticles()

})
onMounted(() => {
  const info = uni.getSystemInfoSync()
  contentHeight.value = info.windowHeight - info.safeAreaInsets.bottom - 51
})

let hidToDelete = 0

function deleteConfirm() {
  uni.request({
    url: API_URL + '/articles/' + hidToDelete,
    method: 'DELETE',
    header: {
      'Authorization': uni.getStorageSync('access-token'),
      'content-type': 'application/json'
    },
    success: (res) => {
      const data = res.data
      if (data.code === 200) {
        getArticles()
      }else{
        uni.showToast({
          title: '删除失败',
          icon: 'error'
        })
      }
    },
    fail: (error) => {
      console.log(error)
    },
  })
}

const deleteConfirmDialog = ref()

function openDeleteDialog(hid) {
  hidToDelete = hid
  console.log(hidToDelete)
  deleteConfirmDialog.value.open()
}
</script>

<template>
  <view class="home" :style="{height: contentHeight + 'px'}">
    <view class="home-header">

      <view style="flex: 1">
        <uni-data-select
            placeholder="请选择分类"
            v-model="articleFindForm.tid"
            :localdata="range"
            @change="change">
        </uni-data-select>

      </view>

      <view style="flex: 2">
        <uni-easyinput suffixIcon="search" @iconClick="searchIconClick"
                       v-model="articleFindForm.keywords" placeholder="请输入关键字">
        </uni-easyinput>
      </view>

    </view>
    <view class="home-content">
      <view v-for="item in pageData" :key="item.hid">
        <uni-card>
          <template v-slot:title>
            <uni-section :title="item.title">
              <template v-slot:right>
                <view v-if="item.isOwner" style="display: flex; flex-direction: row; flex-wrap: nowrap; width: 120px; align-items: center; justify-content: space-between">
                  <uv-button type="warning" text="修改" plain @click="goUpdateArticlePage(item.hid)"></uv-button>
                  <uv-button type="error" text="删除" plain @click="openDeleteDialog(item.hid)"></uv-button>
                </view>
              </template>
            </uni-section>
          </template>

          <view
              style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex-wrap: nowrap"
              @click="showArticleDetail(item.hid)">
            <text class="uni-body">发表于：{{ timeFormat(item.pastime) }}</text>
            <text class="uni-body">阅读量：{{ item.pageViews }}</text>
            <text class="uni-body">作者：{{ item.author }}</text>
          </view>

          <view slot="actions" class="card-actions">

            <view class="card-actions-item">
              <uni-icons type="pyq" color="#999"></uni-icons>
              <text class="card-actions-item-text">分享</text>
            </view>

            <view class="card-actions-item">
              <uni-icons type="heart" color="#999"></uni-icons>
              <text class="card-actions-item-text">点赞</text>
            </view>

            <view class="card-actions-item">
              <uv-icon name="level" color="#999"></uv-icon>
              <text class="card-actions-item-text" @click="showArticleDetail(item.hid)">阅读</text>
            </view>
          </view>
        </uni-card>

      </view>
    </view>

    <view class="home-footer">
      <view style="width: 100%">
        <uni-pagination :total="totalNum" :page-size="articleFindForm.pageSize"
                        :current="articleFindForm.currentPage" @change="currentPageChange"/>
      </view>

    </view>
  </view>
  <view>
    <uni-popup ref="deleteConfirmDialog" type="dialog">
      <uni-popup-dialog ref="inputClose" title="确认删除？" mode="base" content="要抛弃您珍贵的文章了吗？"
                        @confirm="deleteConfirm"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.home-content {
  flex: 1;
  width: 100%;
  overflow: auto;
}

.home-header {
  margin-top: 1px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.home-footer {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 45px;
}

.card-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 40px;
  border-top: 1px #eee solid;
}

.card-actions-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  cursor: pointer;
}

.card-actions-item-text {
  color: #666;
  margin-left: 5px;
}
</style>