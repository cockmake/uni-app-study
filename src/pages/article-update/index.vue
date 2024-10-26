<script setup>
import {onLoad} from "@dcloudio/uni-app";
import {reactive, ref} from "vue";
import {API_URL, contentHeight} from "../../base";

const hid = ref(0)
onLoad((option) => {
  hid.value = option.hid
  uni.setNavigationBarTitle({
    title: '编辑文章'
  })
  getArticleTypes()
  getArticleDetail(option.hid)
})
const types = ref([])

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
      types.value = tmp
    },
    fail: (error) => {
      console.log(error)
    },
    complete: () => {

    }
  })
}

function getArticleDetail(hid) {
  uni.showLoading({
    title: '加载中...'
  })
  uni.request({
    url: API_URL + '/articles/' + hid,
    method: 'GET',
    header: {
      'Authorization': uni.getStorageSync('access-token'),
      'content-type': 'application/json'
    },
    success: (res) => {
      const data = res.data
      if (data.code === 200) {
        articleForm.title = data.data.title
        articleForm.article = data.data.article
        articleForm.type = data.data.type
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

const articleForm = reactive({
  title: '',
  article: '',
  type: null,
})
let submitted = false

function submit() {
  // 禁止用户重复提交
  if (submitted) {
    return
  }
  submitted = true

  uni.request({
    url: API_URL + '/articles/' + hid.value,
    method: 'PUT',
    header: {
      'Authorization': uni.getStorageSync('access-token'),
      'content-type': 'application/json'
    },
    data: {
      title: articleForm.title,
      article: articleForm.article,
      type: articleForm.type
    },
    success: (res) => {
      const data = res.data
      console.log(data)
      if (data.code === 200) {
        uni.showToast({
          title: '编辑成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      } else {
        submitted = false
        uni.showToast({
          title: '编辑失败',
          icon: 'error',
          duration: 2000
        })
      }
    },
    fail: (error) => {
      console.log(error)
    },
  })
}
</script>

<template>
  <view class="article-update" :style="'height: ' + contentHeight + 51 + 'px'">
    <uni-forms ref="form" :modelValue="articleForm" label-position="top">

      <uni-forms-item label="标题" required>
        <uni-easyinput v-model="articleForm.title" placeholder="请输入文章标题"/>
      </uni-forms-item>

      <uni-forms-item label="类别" required>
        <uni-data-select
            placement="bottom"
            placeholder="请选择文章类别"
            :localdata="types"
            v-model="articleForm.type">
        </uni-data-select>
      </uni-forms-item>

      <uni-forms-item label="内容" required>
        <uv-textarea height="300" v-model="articleForm.article" count placeholder="请输入内容"
                     maxlength="30000"></uv-textarea>
      </uni-forms-item>

      <uni-forms-item>
        <uv-button type="warning" @click="submit">确定修改</uv-button>
      </uni-forms-item>
    </uni-forms>
  </view>
</template>

<style scoped lang="scss">
.article-update {
  padding: 20px;
  background-color: #f5f5f5;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;

  .uni-forms-item {
    margin-bottom: 20px;
  }
}
</style>