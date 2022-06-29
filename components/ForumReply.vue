<template>
  <div class="container">
    <div class="comment">
      <div class="reply">
        <el-dialog
          :title="title"
          :visible.sync="dialogVisible"
          width="700px"
          @open="beforeOpen"
          :before-close="handleClose">
          <div
            infinite-scroll-delay=5000
            v-infinite-scroll="loadReply"
            infinite-scroll-disabled="disabled">
            <div class="item" v-for="reply in replies">
              <div class="reply-content">
                <forum-avatar :size="22" :src="reply.from.avatar || defaultAvatar"/>
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
                <span class="reply-text" @click="showReplyInput(reply)">
              <i class="iconfont bbs-icon-reply"></i>
              <span>回复</span>
            </span>
                <span v-if="reply.id !== reply.dialogId" class="reply-text" style="margin-left: 20px"
                      @click="showDialog(reply)">
              <span>查看对话</span>
            </span>
              </div>
              <transition name="fade">
                <div class="input-wrapper" v-if="reply === curReply">
                  <el-input class="gray-bg-input"
                            v-model="inputReply"
                            type="textarea"
                            :rows="3"
                            autofocus
                            :placeholder="replyPlaceHolder">
                  </el-input>
                  <div class="btn-control">
                    <span class="cancel" @click="cancel">取消</span>
                    <span class="cancel" @click="commitReply">确定</span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <p v-if="loadingFail" align="center" style="color: #909399;font-size: 14px">加载失败</p>
          <p v-if="loading" align="center" style="color: #909399;font-size: 14px">加载中...</p>
          <p v-if="noMore" align="center" style="color: #909399;font-size: 14px">没有更多了</p>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import ForumAvatar from "./ForumAvatar";
  import ForumPrettyTime from "./ForumPrettyTime";

  export default {
    components: {ForumPrettyTime, ForumAvatar},
    props: {
      commentId: {
        type: Number,
        required: true
      },
      dialogVisible: {
        type: Boolean,
        required: true
      },
    },
    data() {
      return {
        isDialog: false,
        canLike: true,
        inputReply: '',
        curReply: null,
        replyPlaceHolder: '回复评论',
        replyTitle: '更多回复',
        dialogTitle: '对话列表',
        loading: false,
        loadingFail: false,
        defaultAvatar: 'http://localhost:9010/file/2022/04/26/1cbd173b-b529-4ea8-91f3-19f9c30d2483.jpeg',
        replyData: {
          replies: [],
          cursor: {
            total: 0,
            isBegin: true,
            isEnd: false,
            prev: 0,
            next: 0,
          },
        },
        dialogData: {
          replies: [],
          cursor: {
            total: 0,
            isBegin: true,
            isEnd: false,
            prev: 0,
            next: 0,
          },
        }
      }
    },
    computed: {
      noMore() {
        return this.isDialog ? this.dialogData.cursor.isEnd : this.replyData.cursor.isEnd;
      },
      disabled() {
        return this.loading || this.noMore
      },
      title() {
        return this.isDialog ? this.dialogTitle : this.replyTitle;
      },
      replies() {
        return this.isDialog ? this.dialogData.replies : this.replyData.replies;
      }
    },
    methods: {
      //加载回复
      loadReply() {
        this.loadingFail = false;
        this.loading = true
        this.$axios.post('reply/list', {
          commentId: this.commentId,
          next: this.replyData.cursor.next,
        }).then((res) => {
          let data = res.data.data;
          if (data) {
            this.replyTitle = `共${this.replyData.cursor.total}条回复`;
            this.replyData.cursor = data.cursor;
            this.replyData.replies = this.replyData.replies.concat(data.replies);
          } else {
            this.loadingFail = true;
          }
          this.loading = false;
        })
      },
      // 关闭评论
      handleClose(done) {
        if (this.isDialog) {
          this.isDialog = false;
          this.dialogData.replies = [];
          this.dialogData.cursor.next = 0;
          return;
        }
        this.$emit('update:dialogVisible', false);
        this.replyData.replies = [];
        this.replyData.cursor.next = 0;
      },
      beforeOpen() {
        this.loadReply();
      },
      /**
       * 点赞
       */
      likeReply(item, newState) {
        let oldState = item.likeState;
        if (oldState === newState)
          return;
        if (this.canLike) {
          this.canLike = false;
          this.$axios.put('like', {
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
       * 提交回复
       */
      commitReply() {
        this.$axios.post('reply', {
          commentId: this.commentId,
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

      //查看对话
      showDialog(reply) {
        this.isDialog = true;
        this.loadingFail = false;
        this.loading = true
        this.$axios.post('reply/dialog/list', {
          commentId: this.commentId,
          dialogId: reply.dialogId,
          next: this.dialogData.cursor.next,
        }).then((res) => {
          let data = res.data.data;
          if (data) {
            this.dialogData.cursor = data.cursor;
            this.dialogData.replies = this.dialogData.replies.concat(data.replies);
          } else {
            this.loadingFail = true;
          }
          this.loading = false;

        })
      },

      cancel() {
        this.curReply = null
      },

      /**
       * 点击评论按钮显示输入框
       * item: 当前大评论
       * reply: 当前回复的评论
       */
      showReplyInput(reply) {
        if (reply) {
          this.curReply = reply;
          this.replyPlaceHolder = "@" + reply.from.nickname + " "
        } else {
          this.curReply = null;
          this.replyPlaceHolder = '回复评论'
        }
      }
    },
    created() {
      // console.log(this.comments)
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


