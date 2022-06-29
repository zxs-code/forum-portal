<template>
  <div class="posts-detail-box">
    <link href="https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css" rel="stylesheet">
    <el-card shadow="never">
      <div>
        <!--        标题-->
        <h1 style="margin-top:0">{{posts.title}}</h1>
        <!--        帖子各项数据-->
        <div class="posts-state">
          <div style="margin-bottom: 5px">
            <span>{{posts.views}}阅读</span>
            <span>{{posts.likes}}点赞</span>
            <span>{{posts.dislikes}}点踩</span>
            <span>{{posts.stars}}收藏</span>
          </div>
          <div>
            <span>发布于 <forum-pretty-time :time="posts.createTime"></forum-pretty-time></span>
            <span v-if="posts.createTime !== posts.updateTime">更新于  <forum-pretty-time
              :time="posts.updateTime"></forum-pretty-time></span>
          </div>
        </div>
        <!--        标签-->
        <div class="tags-box">
          <el-button type="primary" size="small" round plain v-for="(tag,index) in posts.tags" :key="index">{{tag}}
          </el-button>
        </div>
        <!--        作者-->
        <nuxt-link :to="'/user/'+posts.author.id+'/info'" :style="{pointerEvents: posts.anonymous? 'none': 'auto'}">
          <forum-avatar :src="avatar" :size="40" vertical-align="top"></forum-avatar>
          <div :style="authorStyle">
            <b style="font-size: 15px">{{posts.author.nickname}}</b><br>
            <span style="font-size: 13px;color: #909399">{{posts.author.signature}}</span>
          </div>
        </nuxt-link>
        <!--        帖子内容-->
        <el-skeleton :rows="20" :loading="loading" style="margin-top: 30px" animated/>
        <div class="content-box markdown-body">
          <span v-dompurify-html="this.posts.content"> </span>
        </div>
        <el-divider></el-divider>
        <!--        评论区-->
        <div id="comment" v-if="!loading">
          <forum-comment :resource-id="posts.id" :resource-type="0"></forum-comment>
        </div>
        <!--        收藏框-->
        <forum-fav-dialog :fav-visible.sync="favVisible" :favorites="favorites" :selected="selected"
                          :submit="handleCollectSubmit" :create-fav="createFav"></forum-fav-dialog>
        <!--        底部悬浮框-->
        <div class="bottom-box">
          <div style="display: inline-block">
            <span class="like" :class="{active: isLike}" @click="handleLike">
              <span class="iconfont bbs-icon-like-true"></span>
              <span class="icon-right-text" v-if="posts.likes > 0">{{likes}}</span>
              <span class="icon-right-text" v-else>点赞</span>
            </span>
            <span class="like" :class="{active: isDislike}" @click="handleDislike">
              <span class="iconfont bbs-icon-dislike-true"></span>
              <span class="icon-right-text" v-if="posts.dislikes > 0">{{dislikes}}</span>
              <span class="icon-right-text" v-else>点踩</span>
            </span>
            <span class="like" :class="{active: posts.isStars}" @click="handleCollect">
              <span class="iconfont bbs-icon-collect-true"></span>
              <span class="icon-right-text" v-if="posts.stars > 0">{{stars}}</span>
              <span class="icon-right-text" v-else>收藏</span>
            </span>
            <el-popover
              placement="top-start"
              width="260"
              trigger="hover">
              <span slot="reference" class="share el-icon-share">分享</span>
              <share :config="shareConfig"></share>
            </el-popover>
            <el-popover
              placement="top-start"
              width="50px"
              trigger="click">
              <span slot="reference" class="share el-icon-more">更多</span>
              <el-button type="text">置顶</el-button>
              <br>
              <el-button type="text">加精</el-button>
              <br>
              <el-button type="text">隐藏</el-button>
              <br>
              <el-button type="text">锁定</el-button>
              <br>
            </el-popover>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {mavonEditor} from "mavon-editor"
  import ForumAvatar from "./ForumAvatar";
  import ForumFavDialog from "./ForumFavDialog";
  import ForumComment from "./ForumComment";
  import ForumPrettyTime from "./ForumPrettyTime";

  export default {
    components: {ForumPrettyTime, ForumComment, ForumAvatar, ForumFavDialog},
    props: {
      posts: {
        type: Object,
        default() {
          return {
            id: null,
            title: '标题',
            content: '内容',
            tags: ['标签1', '标签2'],
            anonymous: true,
            views: null,
            likes: null,
            dislikes: null,
            comment: null,
            stars: null,
            isAuthor: false,
            likeState: -1,
            isStars: false,
            createTime: null,
            updateTime: null,
            author: {
              nickname: '匿名用户123456',
              avatar: null,
              id: null,
              signature: null
            }
          }
        }
      },
    },
    data() {
      return {
        // content: "<script>alert(1)<\/script>"
        // xss攻击 https://developer.mozilla.org/zh-CN/docs/Web/API/Element/innerHTML#%E5%AE%89%E5%85%A8%E9%97%AE%E9%A2%98
        favVisible: false,
        loading: true,
        canLike: true,
        showComment: false,
        scroll: '',
        shareConfig: {
          // url: "", // 网址，默认使用 window.location.href
          source: "", // 来源（QQ空间会用到）, 默认读取head标签：<meta name="site" content="http://overtrue" />
          title: this.posts.title, // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
          description: "", // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
          image: "", // 图片, 默认取网页中第一个img标签
          sites: [
            "qzone",
            "qq",
            "weibo",
            "wechat",
            "douban",
            "tencent"
          ], // 启用的站点
          // disabled: ["google", "facebook", "twitter"], // 禁用的站点
          wechatQrcodeTitle: "微信扫一扫：分享", // 微信二维码提示文字
          wechatQrcodeHelper: "<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>",
        },
        favorites: [],
      }
    },
    methods: {
      //点赞，点踩
      handleLike() {
        if (this.canLike) {
          let that = this;
          setTimeout(function () {
            that.canLike = true;
          }, 1000);
          this.canLike = false;
          let state = this.isLike ? 1 : 0;
          this.changeLike(state).then(res => {
            if (res.data.code === 0) {
              if (this.isLike) {
                this.posts.likes--;
              } else {
                this.posts.likes++;
                if (this.isDislike)
                  this.posts.dislikes--;
              }
              this.posts.likeState = state;
            }
          });
        }
      },
      handleDislike() {
        if (this.canLike) {
          let that = this;
          setTimeout(function () {
            that.canLike = true;
          }, 1000);
          this.canLike = false;
          let state = this.isDislike ? 3 : 2;
          this.changeLike(state).then(res => {
            if (res.data.code === 0) {
              // let state = this.isDislike ? 3 : 2;
              // this.posts.dislikes += this.isDislike ? -1 : 1;
              if (this.isDislike) {
                this.posts.dislikes--;
              } else {
                this.posts.dislikes++;
                if (this.isLike)
                  this.posts.likes--;
              }
              this.posts.likeState = state;
            }
          })
        }
      },
      changeLike(state) {
        return this.$axios.put('/like', {
          resource: {
            type: 0,
            id: this.posts.id
          },
          state: state
        })
      },
      //弹出收藏夹
      handleCollect() {
        this.$axios.get(`/fav/state/list`, {
          params: {id: this.posts.id, type: 0}
        }).then((res) => {
          if (res.data.code === 0) {
            this.favorites = res.data.data;
            this.favVisible = true;
          }
        })
      },
      //提交收藏
      async handleCollectSubmit(newSelected) {
        let success = false;
        let addFavIds = this.global.removeAll(newSelected, this.selected);
        let delFavIds = this.global.removeAll(this.selected, newSelected);
        await this.$axios.put('/posts/collect', {
          id: this.posts.id,
          addFavIds: addFavIds,
          delFavIds: delFavIds
        }).then((res) => {
          if (res.data.code === 0) {
            let oldState = this.posts.isStars;
            let newState = newSelected && newSelected.length > 0;

            this.selected = newSelected;
            if (oldState !== newState) {
              this.posts.isStars = newState;
              this.posts.stars += newState ? 1 : -1;
            }
            success = true;
          }
        })
        return success;
      },
      // 新建收藏夹
      async createFav(newFavName) {
        let success = false;
        await this.$axios.post('fav', {
          name: newFavName,
          type: 0
        }).then((res) => {
          if (res.data.code === 0) {
            this.favorites.push(res.data.data)
            success = true;
          }
        })
        return success;
      },
      // 滚动事件
      dataScroll() {
        this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
      },
      loadScroll() {
        let comment = document.getElementById('comment');
        if (this.scroll > comment.offsetTop - 500)
          this.showComment = true;
      },
      transferContent() {
        const md = mavonEditor.getMarkdownIt();
        // console.log("<img src='x' onerror='alert(1)'>")
        // console.log(md.render("<script>alert(1)<\/script>"))
        // this.content = md.render(this.posts.content);
        this.posts.content = md.render(this.posts.content);
        this.loading = false;
      }
    },
    watch: {
      //监听scroll变量，只要滚动条位置变化就会执行方法loadScroll
      scroll: function () {
        this.loadScroll();
      }
    },
    mounted() {
      this.transferContent();
      // scroll代表滚动条距离页面顶部距离
      window.addEventListener('scroll', this.dataScroll);
    },
    computed: {
      avatar() {
        return this.posts.author.avatar || 'http://localhost:9010/file/2022/04/26/1cbd173b-b529-4ea8-91f3-19f9c30d2483.jpeg';
      },
      // content() {
      //服务端渲染时组件未完全加载，在mounted()中转换内容
      // const md = mavonEditor.getMarkdownIt();
      // return md.render(this.posts.content);
      // return this.posts.content;
      // },
      authorStyle() {
        return {
          display: 'inline-block',
          verticalAlign: this.posts.author.signature ? 'bottom' : 'top'
        }
      },
      isLike() {
        return this.posts.likeState === 0;
      },
      isDislike() {
        return this.posts.likeState === 2;
      },
      likes() {
        return this.global.prettyNumber(this.posts.likes);
      },
      dislikes() {
        return this.global.prettyNumber(this.posts.dislikes);
      },
      stars() {
        return this.global.prettyNumber(this.posts.stars);
      },
      selected: {
        get() {
          let arr = [];
          for (let i in this.favorites)
            if (this.favorites[i].state)
              arr.push(this.favorites[i].id)
          return arr;
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/global1";

  .more-option {
    font-size: 20px;
  }

  .bottom-box {
    position: fixed;
    /*left: 50px;*/
    bottom: 0;
    z-index: 999;
    width: 1037px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    border-top: rgba(192, 196, 204, 0.57) solid 1px;
    padding-top: 8px;
    /*padding: 5px;*/

    background-color: white;

    .share {
      display: inline-block;
      /*align-items: center;*/
      width: 70px;
      margin-right: 20px;
      cursor: pointer;
      color: $color-info;

      .iconfont {
        font-size: 16px;
        /*margin-right: 0px;*/
      }

      .icon-right-text {
        font-size: 14px;
      }
    }

    .like {
      display: inline-block;
      /*align-items: center;*/
      width: 80px;
      margin-right: 20px;
      cursor: pointer;
      color: $color-info;

      &.active, &:hover {
        color: $color-main;
      }

      .iconfont {
        font-size: 16px;
        /*margin-right: 0px;*/
      }

      .icon-right-text {
        font-size: 14px;
      }
    }

    /*span {*/
    /*  font-size: 16px;*/
    /*  padding-left: 5px;*/
    /*  margin-right: 50px;*/
    /*  color: #8590A6;*/
    /*}*/


  }

  .posts-state {
    font-size: 14px;
    color: #999999;
  }

  .posts-state span {
    margin-right: 20px;
  }

  .tags-box {
    margin-bottom: 20px;
  }

  .tags-box .el-button {
    /*font-weight: bold;*/
    /*font-style: italic;*/
    /*color: #0066FF;*/
    /*color: #0366D6;*/
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .posts-detail-box {
    overflow: auto;
    width: 1080px;
    margin-bottom: 60px;
  }

  .content-box {
    margin-top: 10px;
  }


  a {
    color: #000000;
    text-decoration: none;
  }
</style>
