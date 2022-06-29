<template>
  <div>
    <div class="custom-nickname">{{user.nickname}}</div>
    <div style="display: flex;justify-content:space-between">
      <div style="display: inline-block">
        关注<br>{{user.following}}
      </div>
      <el-divider direction="vertical" style="height:15px"></el-divider>
      <div style="display: inline-block">
        粉丝<br>{{user.follower}}
      </div>
      <el-divider direction="vertical"></el-divider>
      <div style="display: inline-block">
        帖子<br>{{user.posts}}
      </div>
    </div>
    <div class="option">
      <el-divider class="divider-horizontal"></el-divider>
      <i class="el-icon-user"></i>
      <nuxt-link to="/user">个人中心</nuxt-link>
      <el-divider class="divider-horizontal"></el-divider>
      <i class="el-icon-tickets"></i>
      <nuxt-link to="/user">我的帖子</nuxt-link>
      <el-divider class="divider-horizontal"></el-divider>
      <i class="el-icon-star-off"></i>
      <nuxt-link to="/user">我的收藏</nuxt-link>
      <el-divider class="divider-horizontal"></el-divider>
      <i class="el-icon-time"></i>
      <nuxt-link to="/user">历史记录</nuxt-link>
      <el-divider class="divider-horizontal"></el-divider>
      <i class="iconfont bbs-icon-tuichu"></i>
      <nuxt-link to="/user">退出</nuxt-link>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      user: {
        type: Object,
        default() {
          return {
            id: null,
            nickname: null,
            avatarUrl: null,
            following: 0,
            follower: 0,
            posts: 0
          }
        }
      },
    },
  }
</script>
<style scoped lang="scss">
  @import "assets/styles/global1";
  .option {
    a {
      color: $text-normal;
    }
·
    i {
      font-size: 20px;
    }
  }

  .divider-horizontal {
    margin: 10px 0px;

  }

  .divider-vertical {
    margin: 5px 0px;
  }


  .custom-nickname {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    font-size: 20px;
  }

  a {
    color: #909399;
    width: 100%;
    padding: 5px 0px;
    font-size: 17px;
    text-decoration: none;
  }

  a:hover {
    color: #409EFF;
  }
</style>

