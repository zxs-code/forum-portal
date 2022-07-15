<template>
  <span>{{prettyTime}}</span>
</template>

<script>
  export default {
    props: {
      time: null,
    },
    computed: {
      prettyTime() {
        console.log(this)
        console.log(this.global.prettyTime(this.time))
        console.log(2)
        return this.global.prettyTime(this.time);
      }
    }
  }
</script>

<style scoped>

</style>
