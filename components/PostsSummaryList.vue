<template>
  <div style="display: inline-block">
    <el-card v-if="loading" style="width: 730px;height: 1000px">
      <el-skeleton :rows="5" :count="20" :loading="loading" style="margin-top: 30px"/>
    </el-card>
    <div style="width: 730px;min-height: 1000px;background-color: white">
      <div v-for="(item,i) in postsList" :key="i">
        <posts-summary :posts="item"/>
      </div>
      <div align="center" style="font-size: 15px;color: #909399;padding-top: 50px">没有更多了</div>
      <div class="pagination">
        <el-pagination
          background
          :hide-on-single-page="true"
          :current-page="curPage"
          :page-size="pageSize"
          :pager-count="15"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import bus from "../plugins/bus";
  import PostsSummary from "./PostsSummary";

  export default {
    components: {PostsSummary},
    data() {
      return {
        total: 100,
        curPage: 1,
        pageSize: 20,
        postsList: [],
        keyword: null,
        loading: true
      }
    },
    methods: {
      loadPostsList() {
        this.$axios.get('search', {
          params: {
            curPage: this.curPage,
            pageSize: this.pageSize,
            keyword: this.keyword,
            type: 0
          }
        }).then((res) => {
          if (res.data.code === 0) {
            this.total = res.data.data.total;
            this.postsList = res.data.data.item;
            this.loading = false;
          }
        })
      }
    },
    watch: {
      curPage() {
        this.loadPostsList();
      },
      pageSize() {
        this.loadPostsList();
      },
      keyword() {
        let newURL = this.$route.path + `?keyword=${this.keyword}`;
        window.history.replaceState('', '', newURL);
        this.loadPostsList();
      },
    },
    created() {
      bus.$on('search', data => {
        this.keyword = data;
      })
    },
    mounted() {
      let keyword = this.$route.query.keyword;
      if (keyword)
        this.keyword = keyword;
      this.loadPostsList();
    }
  }
</script>

<style>
  .pagination {
    padding: 50px 0;
  }
</style>
