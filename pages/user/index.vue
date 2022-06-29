<template>
  <div>
    <forum-header></forum-header>
    <forum-user-center style="margin: 70px auto"></forum-user-center>
  </div>
</template>
<script>
  import ForumHeader from "../../components/ForumHeader";
  import ForumUserCenter from "../../components/ForumUserCenter";

  export default {
    name: 'IndexPage',
    components: {ForumHeader, ForumUserCenter},
    // created() {
    //   if (typeof window !== 'undefined') {
    //     const percentageOn1 = (window.screen.width / 1920) * 100;
    //     document.body.style.zoom = percentageOn1+'%';
    //   }
    // }
  }
</script>
<style scoped>
  .password-form {
    margin: 100px auto 0px auto;
  }
</style>
