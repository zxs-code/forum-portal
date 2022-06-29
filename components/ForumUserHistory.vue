<template>
  <div>
    <div style="display: flex;justify-content: right;margin-bottom: 20px">
      <el-button type="primary" @click="deleteHistory">清空</el-button>
    </div>
    <div v-for="(item,i) in histories" :key="i">
      <el-card shadow="never">
        <div style="display: flex;justify-content: space-between">
          <span class="bbs-font-title">
            <nuxt-link :to="`/posts/${item.resourceId}`">{{item.title}}</nuxt-link>
          </span>
          <i class="el-icon-close" @click="deleteHistory(item)"/>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        histories: [
          {
            id: 1,
            resourceId: 2,
            title: '帖子标题1',
          },
          {
            id: 1,
            resourceId: 2,
            title: '帖子标题2',
          },
          {
            id: 1,
            resourceId: 2,
            title: '帖子标题3',
          },
          {
            id: 1,
            resourceId: 2,
            title: '帖子标题4',
          }, {
            id: 1,
            resourceId: 2,
            title: '帖子标题5',
          },
          {
            id: 1,
            resourceId: 2,
            title: '帖子标题6',
          },
          {
            id: 1,
            resourceId: 2,
            title: '帖子标题7',
          },
        ],
        curPage: 1,
        pageSize: 10
      }
    },
    methods: {
      loadHistory() {
        this.$axios.get('user/info/history', {
          params: {
            curPage: this.curPage,
            pageSize: this.pageSize
          }
        }).then((res) => {
          if (res.data.code === 0) {
            this.histories = res.data.data.item;
          }
        })
      },
      deleteHistory(item) {
        if (item.id) {
          console.log(1);
          this.$axios.delete(`user/info/history/${item.id}`)
            .then((res) => {
              if (res.data.code === 0)
                this.histories.splice(this.histories.indexOf(item), 1);
            })
        } else {
          this.$axios.delete(`user/info/history`)
            .then((res) => {
              if (res.data.code === 0)
                this.histories = [];
            })
        }
      }
    },
  }
</script>
<style scoped lang="scss">
  @import "assets/styles/global1";

  a {
    color: $color-main;
    text-decoration: none;
  }
</style>
