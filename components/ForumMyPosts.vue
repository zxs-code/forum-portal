<template>
  <div>
    <div v-for="(item,i) in posts" :key="i">
      <el-card shadow="never">
      <span class="bbs-font-title">
        <nuxt-link :to="`/posts/${item.id}`">{{item.title}}</nuxt-link>
      </span>
      </el-card>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        posts: [],
        curPage: 1,
        pageSize: 10
      }
    },
    methods: {
      loadPosts() {
        this.$axios.get('posts/owner', {
          params: {
            curPage: this.curPage,
            pageSize: this.pageSize
          }
        }).then((res) => {
          if (res.data.code === 0) {
            this.posts = res.data.data.item;
          }
        })
      }
    },
  }
</script>
<style scoped lang="scss">
  @import "assets/styles/global1";

  a {
    color: $color-main;
    text-decoration: none;
  }
</style>
