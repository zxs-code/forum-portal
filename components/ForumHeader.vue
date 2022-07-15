<template>
  <div class="out-header">
    <div class="header-border header-link-font">
      <div class="inner-header">
        <div style="display: inline-block">
          <i style="color:#409EFF;font-size: 28px">logo</i>
          <nuxt-link to="/" style="margin-left: 50px">首页</nuxt-link>
          <nuxt-link to="/posts/list" style="margin-left: 20px">帖子</nuxt-link>
          <nuxt-link to="/user" style="margin-left: 20px">用户</nuxt-link>
          <nuxt-link to="/recommend" style="margin-left: 20px">推荐</nuxt-link>
        </div>
        <div style="display: inline-block;">
          <el-input
            size="medium"
            style="width: 500px;"
            placeholder="请输入内容"
            v-model="keyword"
            @keyup.enter.native="searchHandler">
          </el-input>
          <el-button icon="el-icon-search" size="medium" type="primary" @click="searchHandler"></el-button>
          <!--          <nuxt-link to="/posts" style="margin-left: 20px"><i class="el-icon-edit">发帖</i></nuxt-link>-->
        </div>
        <div style="display: inline-block">
          <el-popover
            v-if="user"
            placement="bottom"
            width="200"
            trigger="click">
            <forum-avatar slot="reference" :src="avatar"/>
            <forum-user-card :user="user"></forum-user-card>
          </el-popover>
          <nuxt-link to="/login" style="display: inline-block;padding-top: 10px" v-else>注册/登录</nuxt-link>
        </div>
        <div>
          <el-badge :value="200" :max="99" class="item">
            <nuxt-link to="/message">消息</nuxt-link>
          </el-badge>
          <nuxt-link to="/posts/create" style="margin-left: 30px">发帖</nuxt-link>
          <nuxt-link to="/posts/create" style="margin-left: 30px">反馈</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import bus from "../plugins/bus";
  import ForumUserCard from './ForumUserCard.vue'
  import ForumAvatar from "./ForumAvatar";

  export default {
    data() {
      return {
        keyword: null,
      }
    },
    methods: {
      setUserInfo() {
        let isLogin = this.$store.getters['user/isLogin'](this);
        if (isLogin && this.user == null) {
          this.$axios.get('/user/myInfo')
            .then(res => {
              if (res.data.code === 0) {
                this.$store.dispatch('user/setUserInfo', res.data.data);
              }
            })
        }
      },
      searchHandler() {
        // 触发绑定的事件，并向外传递参数。
        if (!window.location.href.startsWith('http://localhost:3001/posts/list'))
          window.location.href = 'http://localhost:3001/posts/list?keyword=' + this.keyword;
        else
          bus.$emit('search', this.keyword);
      },
    },
    computed: {
      avatar() {
        return this.user.avatar || 'http://localhost:9010/file/2022/04/26/1cbd173b-b529-4ea8-91f3-19f9c30d2483.jpeg';
      },
      user() {
        return this.$store.getters['user/getUserInfo'](this);
      }
    },
    components: {ForumAvatar, ForumUserCard},
    mounted() {
      let keyword = this.$route.query.keyword;
      if (keyword)
        this.keyword = keyword;
      this.setUserInfo();
    }
  }
</script>

<style scoped>

  .out-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;
    background-color: white;
    border-bottom: solid 1px #C0C4CC;
    box-shadow: 0px 1px 5px #C0C4CC;
  }

  .header-border {
    margin: auto;
    width: 1200px;
    height: 49px;
  }

  .inner-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 44px
  }


</style>
