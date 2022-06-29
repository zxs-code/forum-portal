<template>
  <div style="width: 730px;">
    <el-card class="posts-summary-card" shadow="never">
      <el-row>
        <el-tooltip class="item" effect="light" content="置顶" placement="top">
          <span v-if="posts.top" class="iconfont bbs-icon-top"/>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="加精" placement="top">
          <span v-if="posts.good" class="iconfont bbs-icon-good"/>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="锁定" placement="top">
          <span v-if="posts.locked" class="iconfont bbs-icon-lock"/>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="隐藏" placement="top">
          <span v-if="posts.hide" class="iconfont bbs-icon-hide"/>
        </el-tooltip>
        <span class="bbs-font-title">
            <nuxt-link :to="`/posts/${posts.id}`">
            {{posts.title}}
            </nuxt-link>
        </span>

      </el-row>
      <el-row :gutter="20" style="margin-bottom: 5px">
        <el-col :span="posts.previewImg != null ?16 :24">
          <span class="line-limit bbs-font-small-text">{{posts.summary}}</span>
        </el-col>
        <el-col v-if="posts.previewImg != null" :span="8">
          <el-image
            style="max-width: 240px; max-height: 135px"
            :src="posts.previewImg"
            :preview-src-list="posts.srcImg"
            fit="cover">
          </el-image>
        </el-col>
      </el-row>
      <el-row class="data-box">
        <el-col :span="5">
          <forum-avatar :size="20" :src="posts.author.avatar" fit="cover" @error="errorHandler"></forum-avatar>&nbsp;
          <span class="bbs-font-text">{{posts.author.nickname}}</span>
        </el-col>
        <el-col :span="7">
          <span class="iconfont bbs-icon-time"/>&nbsp;<span><forum-pretty-time :time="posts.createTime"/></span>
        </el-col>
        <el-col :span="6">
          <span class="iconfont bbs-icon-views"/>&nbsp;<span>{{posts.views}}</span>
        </el-col>
        <el-col :span="6">
          <span class="iconfont bbs-icon-comment"/>&nbsp;<span>{{posts.comment}}</span>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import ForumPrettyTime from "./ForumPrettyTime";
  import ForumAvatar from "./ForumAvatar";

  export default {
    components: {ForumPrettyTime,ForumAvatar},
    props: {
      posts: {
        type: Object,
        default() {
          return {
            id: 0,
            title: 'html怎么添加图片',
            summary: 'HTML称为超文本标记语言，是一种标识性的语言。它包括一系列标签．通过这些标签可以将网络上的文档格式统一，使分散的Internet资源连接为一个逻辑整体。HTML文本是由HTML命令组成的描述性文本，HTML命令可以说明文字，图形、动画、声音、表格、链接等。',
            top: false,  // 是否置顶
            good: true,  // 是否加精
            locked: true,    // 是否被锁
            hide: false,  // 是否被隐藏
            createTime: '2022-03-01', // 发布时间
            views: '16万',  // 浏览量
            comment: '1.6万', // 评论数
            author: {
              id: null,
              nickname: null,
              avatar: null
            },
            previewImg: 'https://exp-picture.cdn.bcebos.com/bff8683e21c2bbd6c40cac5d116186254093ae71.jpg',
            srcImg: [
              'https://exp-picture.cdn.bcebos.com/bff8683e21c2bbd6c40cac5d116186254093ae71.jpg'
            ]
          }
        },
        required: false,
      }
    },
    data() {
      return {
        spaceNum: 20
      }
    },
    methods: {
      errorHandler() {
        return true
      }
    }
  }
</script>

<style scoped>

  .iconfont{
    color: #909399;
  }

  .data-box {

  }

  .data-box span {
    font-size: 13px;
  }

  .bbs-font-title {
    font-size: 17px;
    font-weight: bold;
    color: #000000;
    line-height: 2;
  }

  .bbs-font-text {
    font-size: 13px;
    color: #606266;
  }

  .bbs-font-small-text {
    font-size: 14px;
    color: #909399;
    line-height: 1.5;
  }

  .bbs-font-placeholder {
    font-size: 13px;
    color: #C0C4CC;
  }

  .line-limit {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }

  .iconfont {
    font-size: 22px;
  }

  .item {
    margin: 4px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: #409EFF;
    text-decoration: dashed #409EFF;
  }

</style>
