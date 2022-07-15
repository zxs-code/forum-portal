<template>
  <div>
    <forum-header></forum-header>
    <posts-editor style="margin-top: 70px;margin-bottom: 300px"></posts-editor>
  </div>
</template>

<script>

  import ForumHeader from "../../components/ForumHeader";
  import PostsEditor from "../../components/PostsEditor";

  export default {
    components: {PostsEditor,ForumHeader}
  }
</script>

<style>
  /*body {*/
  /*  background-color: #F2F6FC;*/
  /*}*/
</style>
