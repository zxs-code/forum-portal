<template>
  <span>{{prettyTime}}</span>
</template>

<script>
  import ForumUserCard from './ForumUserCard.vue'
  import ForumAvatar from "./ForumAvatar";

  export default {
    props: {
      time: null,
    },
    computed: {
      prettyTime() {
        return this.global.prettyTime(this.time);
      }
    }
  }
</script>

<style scoped>

</style>
