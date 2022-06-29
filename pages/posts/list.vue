<template>
  <div>
    <forum-header></forum-header>
    <div class="out-box">
      <posts-summary-list></posts-summary-list>
      <div style="display: inline-block;vertical-align: top;margin-left: 20px">
        <forum-hot-tag style="margin-bottom: 20px"></forum-hot-tag><br>
        <forum-recommend-card></forum-recommend-card>
      </div>
    </div>
  </div>
</template>

<script>
  import PostsSummaryList from "../../components/PostsSummaryList";
  import ForumHeader from "../../components/ForumHeader"
  import ForumHotTag from "../../components/ForumHotTag";
  import ForumRecommendCard from "../../components/ForumRecommendCard";

  export default {
    name: 'IndexPage',
    data() {
      return {
        fit: 'cover',
      }
    },
    components: {ForumHeader, PostsSummaryList, ForumHotTag,ForumRecommendCard},
    // created() {
    //   if (typeof window !== 'undefined') {
    //     const percentageOn1 = (window.screen.width / 1920) * 100;
    //     document.body.style.zoom = percentageOn1+'%';
    //   }
    // }
  }
</script>

<style scoped>
  .out-box {
    width: 1100px;
    margin: 70px auto;
    /*background-color: red;*/
  }
</style>
