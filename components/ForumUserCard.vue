<template>
  <div class="user-card">
    <div class="custom-nickname">{{user.nickname}}</div>
    <div class="user-data">
      <div class="item">
        <div class="item-key">关注</div>
        <div class="item-value">{{user.following}}1</div>
      </div>
      <div class="item">
        <div class="item-key">粉丝</div>
        <div class="item-value">{{user.follower}}</div>
      </div>
      <div class="item">
        <div class="item-key">帖子</div>
        <div class="item-value">{{user.posts}}</div>
      </div>
    </div>
    <div class="option">
      <nuxt-link to="/user">
        <div class="option-item">
          <i class="el-icon-user"></i>
          <span class="option-text">个人中心</span>
        </div>
      </nuxt-link>
      <nuxt-link to="/user">
        <div class="option-item">
          <i class="el-icon-tickets"></i>
          <span class="option-text">我的帖子</span>
        </div>
      </nuxt-link>
      <nuxt-link to="/user">
        <div class="option-item">
          <i class="el-icon-star-off"></i>
          <span class="option-text">我的收藏</span>
        </div>
      </nuxt-link>
      <nuxt-link to="/user">
        <div class="option-item">
          <i class="el-icon-time"></i>
          <span class="option-text">历史记录</span>
        </div>
      </nuxt-link>
      <div class="option-item" @click="logout">
        <i class="iconfont bbs-icon-tuichu"></i>
        <span class="option-text">退出</span>
      </div>
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
    methods: {
      logout() {
        this.$axios
          .delete('/auth/logout')
          .then((res) => {
            if (res.data.code === 0) {
              // this.$store.dispatch('user/removeUserInfo');
            }
          })
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "assets/styles/global1";

  .user-card {
    .user-data {
      display: flex;
      justify-content: space-between;
      padding: 5px 0 8px 0;
      border-top: 1px solid $color-border;
      border-bottom: 1px solid $color-border;

      .item {
        cursor: pointer;

        &:hover {
          color: $color-main;
        }

        .item-key {
          font-size: $text-minor;
        }

        .item-value {
          text-align: center;
          font-weight: bold;
        }
      }
    }

    .option {
      .option-item {
        cursor: pointer;
        width: 100%;
        padding: 8px 0;
        color: $text-normal;

        &:hover{
          color: $color-main;
        }
        .option-text {
          margin-left: 5px;
          font-size: 16px;
        }
      }
    }

    i {
      //图标大小
      font-size: 20px;
    }
  }


  .divider-horizontal {
    margin: 13px 0;
  }

  .custom-nickname {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    font-size: 20px;
  }

</style>

