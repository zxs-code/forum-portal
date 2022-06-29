<template>
  <div class="container">
    <el-backtop :bottom=100 :right=80> <i class="el-icon-caret-top"></i></el-backtop>
    <forum-header></forum-header>
    <forum-posts-content :posts="posts"></forum-posts-content>

  </div>
</template>
<script>
  import ForumPostsContent from "../../components/ForumPostsContent";
  import ForumHeader from "../../components/ForumHeader";

  export default {
    async asyncData({$axios, params, error}) {
      const {data} = await $axios.get(`/posts/${params.id}/detail`);
      if (data.code === 0)
        return {posts: data.data}
      else
        error({statusCode: 404, message: '页面未找到'})
    },
    data() {
      return {
        posts: {
          id: null,
          title: '标题1',
          content: '内容',
          tags: ['标签1', '标签2'],
          anonymous: true,
          like: null,
          dislike: null,
          stars: null,
          isAuthor: false,
          likeState: 2,
          isStars: false,
          author: {
            nickname: '匿名用户123456',
            avatar: null,
            id: null,
            signature: null
          }
        }
      }
    },

    components: {ForumPostsContent, ForumHeader},
  }

</script>

<style scoped>
  .posts-detail-box{
    margin: 70px auto;
  }

</style>
