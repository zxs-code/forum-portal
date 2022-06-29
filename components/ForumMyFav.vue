<template>
  <el-tabs :tab-position="tabPosition" @tab-click="handleClick">
    <div v-for="(item,i) in fav" :key="i">
      <el-tab-pane :label="item.name" :name="item.id">
      </el-tab-pane>
    </div>
  </el-tabs>
</template>

<script>
  export default {
    data() {
      return {
        fav: [],
        tabPosition: 'left',
      }
    },
    methods: {
      loadFav() {
        this.$axios.get('/fav/owner')
          .then((res) => {
            if (res.data.code === 0) {
              this.fav = res.data.data;
              console.log(this.fav)
            }
          })
      },
      handleClick(tab, event) {

      },
    }
  }
</script>
