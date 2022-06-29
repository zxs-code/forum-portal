<template>
  <div>
    <h4>{{commentData.cursor.total}} 评论</h4>
    <el-tabs v-model="orderBy" @tab-click="handleClick">
      <el-tab-pane label="按热度排序" name="0"></el-tab-pane>
      <el-tab-pane label="按时间排序" name="1"></el-tab-pane>
    </el-tabs>
    <div class="container" style="overflow: hidden">
      <transition name="fade">
        <div class="input-wrapper" style="margin-top: 10px;margin-bottom: 20px">
          <el-input class="gray-bg-input"
                    v-model="inputComment"
                    type="textarea"
                    style="width: 89%"
                    :rows="3"
                    placeholder="发表一条友善的评论">
          </el-input>
          <el-button type="primary" style="font-size: 14px" @click="commitComment">发表评论</el-button>
        </div>
      </transition>
      <div>
        <div class="comment" v-for="item in commentData.comments">
          <div class="info">
            <forum-avatar :size="36" :src="item.author.avatar || defaultAvatar"/>
            <div class="right">
              <div class="name">{{item.author.nickname}}</div>
              <div class="date">
                <forum-pretty-time :time="item.createTime"></forum-pretty-time>
              </div>
            </div>
          </div>
          <div class="content">{{item.content}}</div>
          <div class="control">
        <span class="like" :class="{active: item.likeState === 0}"
              @click="likeComment(item,item.likeState === 0? 1: 0)">
          <i class="iconfont bbs-icon-like-true"></i>
          <span class="like-num" v-if="item.likes > 0">{{item.likes}}</span>
        </span>
            <span class="like" :class="{active: item.likeState === 2}"
                  @click="likeComment(item,item.likeState === 2? 3: 2)">
          <i class="iconfont bbs-icon-dislike-true"></i>
          <span class="like-num" v-if="item.dislikes > 0">{{item.dislikes}}</span>
        </span>
            <span class="comment-reply" @click="showCommentInput(item)">
          <i class="iconfont bbs-icon-reply"></i>
          <span>回复</span>
        </span>
          </div>
          <div class="reply">
            <div class="item" v-for="reply in item.replies">
              <div class="reply-content">
                <forum-avatar :size="22" :src="reply.from.avatar || defaultAvatar"/>
                &nbsp
                <span class="from-name">{{reply.from.nickname}}</span>
                <span v-if="reply.to" style="margin-left: 10px">回复</span>
                <span class="to-name" v-if="reply.to"> @{{reply.to.nickname}}</span>
                <span v-if="reply.to" style="margin-left: 3px">:</span>
                <span class="reply-font">{{reply.content}}</span>
              </div>
              <div class="reply-bottom">
                <span><forum-pretty-time :time="reply.createTime"></forum-pretty-time></span>
                <span class="like" :class="{active: reply.likeState === 0}"
                      @click="likeReply(reply,reply.likeState === 0? 1: 0)">
               <i class="iconfont bbs-icon-like-true"></i>
               <span class="like-num" v-if="reply.likes > 0">{{reply.likes}}</span>
            </span>
                <span class="like" :class="{active: reply.likeState === 2}"
                      @click="likeReply(reply,reply.likeState === 2? 3: 2)">
                <i class="iconfont bbs-icon-dislike-true"></i>
                <span class="like-num" v-if="reply.dislikes > 0">{{reply.dislikes}}</span>
            </span>
                <span class="reply-text" @click="showCommentInput(item, reply)">
              <i class="iconfont bbs-icon-reply"></i>
              <span>回复</span>
            </span>
              </div>
            </div>
            <span class="reply-count" @click="moreReply(item)" v-if="item.reply > 3">共{{item.reply}}条回复</span>
            <transition name="fade">
              <div class="input-wrapper" v-if="showItemId === item.id">
                <el-input class="gray-bg-input"
                          v-model="inputReply"
                          type="textarea"
                          :rows="3"
                          autofocus
                          :placeholder="replyPlaceHolder">
                </el-input>
                <div class="btn-control">
                  <span class="cancel" @click="cancel">取消</span>
                  <el-button class="btn" type="success" round @click="commitReply">确定</el-button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <forum-reply :dialog-visible.sync="dialogVisible" :comment-id="dialogCommentId"></forum-reply>
      <p v-if="loadingFail" align="center" style="color: #909399;font-size: 14px">加载失败</p>
      <p v-if="loading" align="center" style="color: #909399;font-size: 14px">加载中...</p>
      <p v-if="noMore" align="center" style="color: #909399;font-size: 14px">没有更多了</p>
    </div>
  </div>
</template>

<script>
  import ForumAvatar from "./ForumAvatar";
  import ForumPrettyTime from "./ForumPrettyTime";
  import ForumReply from "./ForumReply";

  export default {
    components: {ForumReply, ForumPrettyTime, ForumAvatar},
    props: {
      resourceId: {
        type: Number,
        required: true
      },
      resourceType: {
        type: Number,
        required: true
      },
    },
    data() {
      return {
        inputComment: '',
        inputReply: '',
        curReply: null,
        showItemId: '',
        replyPlaceHolder: '回复评论',
        dialogVisible: false,
        loading: false,
        loadingFail: false,
        dialogCommentId: -1,
        canLike: true,
        orderBy: "0",

        defaultAvatar: 'http://localhost:9010/file/2022/04/26/1cbd173b-b529-4ea8-91f3-19f9c30d2483.jpeg',
        commentData: {
          comments: [],
          cursor: {
            total: 0,
            isBegin: true,
            isEnd: false,
            prev: 0,
            next: 0,
            orderBy: 0,
          },
        }
      }
    },
    computed: {
      noMore() {
        return this.commentData.cursor.isEnd;
      },
      disabled() {
        return this.loading || this.noMore
      }
    },
    watch: {},
    methods: {
      //加载评论
      loadComment() {
        this.loadingFail = false;
        this.loading = true
        this.$axios.post('comment/list', {
          resource: {
            type: this.resourceType,
            id: this.resourceId
          },
          orderBy: this.commentData.cursor.orderBy,
          next: this.commentData.cursor.next,
        }).then((res) => {
          let data = res.data.data;
          if (data) {
            this.commentData.cursor = data.cursor;
            this.commentData.comments = this.commentData.comments.concat(data.comments);
          } else {
            this.loadingFail = true;
          }
          console.log(this.loadingFail)
          this.loading = false;
        })
      },
      //切换评论顺序
      handleClick(tab, event) {
        this.commentData.cursor.next = 0;
        this.commentData.cursor.isBegin = false;
        this.commentData.cursor.isEnd = false;
        this.commentData.cursor.orderBy = tab.name;
        this.commentData.comments = [];
        this.loadComment();
        // console.log(tab, event);
      },
      // 关闭评论
      handleClose(done) {
        done();
      },
      //更多回复
      moreReply(item) {
        console.log(this.dialogVisible)
        this.dialogCommentId = item.id;
        this.dialogVisible = true;
      },
      /**
       * 点赞
       */
      likeComment(item, newState) {
        let oldState = item.likeState;
        if (oldState === newState)
          return;
        if (this.canLike) {
          this.canLike = false;
          this.$axios.put('/like', {
            resource: {
              id: item.id,
              type: 1
            },
            state: newState
          }).then((res) => {
            if (res.data.code === 0) {
              if (oldState === 0)
                item.likes--;
              if (oldState === 2)
                item.dislikes--;
              if (newState === 0)
                item.likes++;
              if (newState === 2)
                item.dislikes++;
              item.likeState = newState;
            }
            this.canLike = true;
          })
        }
      },
      likeReply(item, newState) {
        let oldState = item.likeState;
        if (oldState === newState)
          return;
        if (this.canLike) {
          this.canLike = false;
          this.$axios.put('/like', {
            resource: {
              id: item.id,
              type: 2
            },
            state: newState
          }).then((res) => {
            if (res.data.code === 0) {
              if (oldState === 0)
                item.likes--;
              if (oldState === 2)
                item.dislikes--;
              if (newState === 0)
                item.likes++;
              if (newState === 2)
                item.dislikes++;
              item.likeState = newState;
            }
            this.canLike = true;
          })
        }
      },
      /**
       * 点击取消按钮
       */
      cancel() {
        this.showItemId = ''
      },

      /**
       * 提交评论
       */
      commitComment() {
        this.$axios.post('comment', {
          resourceId: this.resourceId,
          resourceType: this.resourceType,
          content: this.inputComment
        }).then((res) => {
          if (res.data.code === 0) {
            this.inputComment = null;
          }
        });
      },
      /**
       * 提交回复
       */
      commitReply() {
        this.$axios.post('reply', {
          commentId: this.showItemId,
          toReplyId: this.curReply ? this.curReply.id : null,
          content: this.inputReply
        }).then((res) => {
          if (res.data.code === 0) {
            this.inputReply = null;
            this.curReply = null;
            this.showItemId = null;
          }
        });
      },
      /**
       * 点击评论按钮显示输入框
       * item: 当前大评论
       * reply: 当前回复的评论
       */
      showCommentInput(item, reply) {
        if (reply) {
          this.curReply = reply;
          this.replyPlaceHolder = "@" + reply.from.nickname + " "
        } else {
          this.curReply = null;
          this.replyPlaceHolder = '回复评论'
        }
        this.showItemId = item.id
      },
      handleScroll() {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        //滚动条到底部的条件
        if (scrollTop + windowHeight >= scrollHeight) {
          this.loadComment();
        }
      },
    },
    created() {
      // console.log(this.comments)
    },
    mounted() {
      addEventListener('scroll', this.handleScroll)
    }
  }
</script>

<style scoped lang="scss">

  @import "assets/styles/global1";

  .container {
    padding: 0 10px;
    box-sizing: border-box;

    .comment {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-bottom: 1px solid $border-fourth;

      .info {
        display: flex;
        align-items: center;

        .avatar {
          border-radius: 50%;
        }

        .right {
          display: flex;
          flex-direction: column;
          margin-left: 10px;

          .name {
            font-family: Consolas;
            font-size: 16px;
            color: #6D757A;
            font-weight: bold;
            margin-bottom: 5px;
            font-weight: 500;
          }

          .date {
            font-size: 12px;
            color: $text-minor;
          }
        }
      }

      .content {
        font-size: 16px;
        color: $text-main;
        line-height: 20px;
        padding: 10px 0;
      }

      .control {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: $text-minor;

        .like {
          display: flex;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;
          color: $color-info;

          &.active, &:hover {
            color: $color-main;
          }

          .iconfont {
            font-size: 14px;
            margin-right: 5px;
          }
        }

        .comment-reply {
          display: flex;
          align-items: center;
          cursor: pointer;

          &:hover {
            color: $text-333;
          }

          .iconfont {
            font-size: 16px;
            margin-right: 5px;
          }
        }

      }

      .reply {
        margin: 10px 0;
        border-left: 2px solid $border-first;

        .reply-count {
          cursor: pointer;
          margin-left: 8px;
          margin-top: 20px;
          font-size: 13px;
          color: $color-main;
        }

        .item {
          margin: 0 10px;
          padding: 10px 0;
          border-bottom: 1px dashed $border-third;

          .reply-content {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: $text-main;

            .from-name {
              font-family: Consolas;
              color: #6D757A;
              font-weight: bold;
            }

            .to-name {
              font-family: Consolas;
              color: $color-main;
              font-weight: bold;
              margin-left: 5px;
              margin-right: 5px;
            }

            .reply-font {
              margin-left: 10px;
            }
          }

          .reply-bottom {
            display: flex;
            align-items: center;
            margin-top: 12px;
            font-size: 12px;
            color: $text-minor;

            .like {
              display: flex;
              align-items: center;
              margin-left: 15px;
              margin-right: 15px;
              cursor: pointer;
              color: $color-info;

              &.active, &:hover {
                color: $color-main;
              }

              .iconfont {
                font-size: 14px;
                margin-right: 5px;
              }
            }

            .reply-text {
              display: flex;
              align-items: center;
              margin-left: 10px;
              cursor: pointer;

              &:hover {
                color: $text-333;
              }

              .icon-comment {
                margin-right: 5px;
              }
            }
          }
        }

        .write-reply {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-minor;
          padding: 10px;
          cursor: pointer;

          &:hover {
            color: $text-main;
          }

          .el-icon-edit {
            margin-right: 5px;
          }
        }

        .fade-enter-active, fade-leave-active {
          transition: opacity 0.5s;
        }

        .fade-enter, .fade-leave-to {
          opacity: 0;
        }

        .input-wrapper {
          padding: 10px;

          .gray-bg-input, .el-input__inner {
            /*background-color: #67C23A;*/
          }

          .btn-control {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 10px;

            .cancel {
              font-size: 16px;
              color: $text-normal;
              margin-right: 20px;
              cursor: pointer;

              &:hover {
                color: $text-333;
              }
            }

            .confirm {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
</style>
