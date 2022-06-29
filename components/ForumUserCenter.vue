<template>
  <el-card class="user-center-box">
    <el-tabs :tab-position="tabPosition" @tab-click="handleClick">
      <el-tab-pane label="我的信息" name="0">
        <forum-my-info ref="myInfo"></forum-my-info>
      </el-tab-pane>
      <el-tab-pane label="我的帖子" name="1">
        <forum-my-posts ref="myPosts"></forum-my-posts>
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="2">
        <forum-my-fav ref="myFav"></forum-my-fav>
      </el-tab-pane>
      <el-tab-pane label="历史记录" name="3">
        <forum-user-history ref="history"></forum-user-history>
      </el-tab-pane>
    </el-tabs>
  </el-card>

</template>
<script>
  import ForumMyFav from "./ForumMyFav";
  import ForumMyPosts from "./ForumMyPosts";
  import ForumMyInfo from "./ForumMyInfo";
  import ForumUserHistory from "./ForumUserHistory";

  export default {
    data() {
      return {
        tabPosition: 'left'
      };
    },
    methods: {
      handleClick(tab, event) {
        switch (tab.name) {
          case "0":
            this.$refs.myInfo.loadMyInfo();
            break;
          case "1":
            this.$refs.myPosts.loadPosts();
            break;
            case "2":
              this.$refs.myFav.loadFav();
          case "3":
            this.$refs.history.loadHistory();
            break;
        }
      }
    },
    components: {ForumMyInfo, ForumUserHistory, ForumMyPosts, ForumMyFav}
  };
</script>
<style scoped lang="scss">
  .user-center-box {
    padding-top: 50px;
    width: 1000px;
    height: 1000px;
  }
</style>
