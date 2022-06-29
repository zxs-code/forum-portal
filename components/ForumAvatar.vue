<template>
  <div style="display: inline-block">
    <img src="/avatar.jpeg" :fit="fit" :style="style" v-real-img="src"/>
  </div>
</template>
<script>
  export default {
    props: {
      src: {
        type: String,
        default() {
          return ''
        }
      },
      fit: {
        type: String,
        default() {
          return 'cover'
        }
      },
      size: {
        type: Number,
        default() {
          return 40;
        }
      },
      verticalAlign: {
        type: String,
        default() {
          return 'bottom';
        }
      }
    },
    computed: {
      style() {
        return {
          width: this.size + 'px',
          height: this.size + 'px',
          borderRadius: '100%',
          objectFit: this.fit,
          verticalAlign: this.verticalAlign
        }
      }
    }
  }
</script>

<style scoped>
</style>
