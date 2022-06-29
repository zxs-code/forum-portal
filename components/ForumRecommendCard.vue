<template>
  <el-card style="width: 340px;height:400px;display: inline-block">
    <div slot="header">
      <span>为你推荐</span>
    </div>
    <div v-for="(posts,i) in hotPosts" :key="i" class="text item">
      {{posts.title}}
    </div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        hotPosts: [
          {id: 1, title: '帖子标题1'},
          {id: 2, title: '帖子标题2'},
          {id: 3, title: '帖子标题3'},
          {id: 4, title: '帖子标题4'},
          {id: 5, title: '帖子标题5'},
          {id: 6, title: '帖子标题6'},
          {id: 7, title: '帖子标题7'},
          {id: 8, title: '帖子标题8'},
        ]
      }
    }
  }
</script>
<style lang='less' scoped>

</style>
