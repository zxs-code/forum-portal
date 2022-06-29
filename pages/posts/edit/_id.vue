<template>
  <div>
    <forum-header></forum-header>
    <posts-editor :posts="posts" style="margin-top: 70px;margin-bottom: 300px"></posts-editor>
  </div>
</template>
<script>
  import ForumHeader from "../../../components/ForumHeader";
  import PostsEditor from "../../../components/PostsEditor";

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
          isLike: false,
          isDislike: false,
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

    components: {PostsEditor, ForumHeader},
  }

</script>

<style scoped>
  .posts-detail-box {
    margin: 100px auto 0 auto;
    /*width: 1280px;*/
    /*background-color: red;*/
  }
</style>
