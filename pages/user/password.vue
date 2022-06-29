<template>
  <div>
    <forum-header></forum-header>
    <password-form class="password-form"></password-form>
  </div>
</template>
<script>
  import ForumHeader from "/components/ForumHeader";
  import PasswordForm from "/components/PasswordForm";

  export default {
    name: 'IndexPage',
    components: {ForumHeader, PasswordForm},
    // created() {
    //   if (typeof window !== 'undefined') {
    //     const percentageOn1 = (window.screen.width / 1920) * 100;
    //     document.body.style.zoom = percentageOn1+'%';
    //   }
    // }
  }
</script>
<style scoped>
  .password-form{
    margin: 100px auto 0px auto;
  }
</style>
