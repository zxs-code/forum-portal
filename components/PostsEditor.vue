<template>
  <div style="width: 1120px;margin:0 auto;">
    <!--    标题-->
    <el-input
      type="text"
      placeholder="请输入标题"
      v-model="posts.title"
      maxlength="64"
      show-word-limit
      style="margin: 20px 0px"
    >
      <template slot="prepend" class="title-prepend">标题</template>
    </el-input>
    <!--    编辑器-->
    <div class="mavonEditor">
      <mavon-editor :toolbars="markdownOption" v-model="posts.content" ref="md"
                    @imgAdd="$imgAdd" @imgDel="$imgDel"/>
    </div>
    <!--    标签-->
    <el-card class="box-card" shadow="always">
      <el-divider content-position="left"><i class="iconfont bbs-icon-tag"></i></el-divider>
      <el-tag
        :key="tag"
        v-for="tag in posts.tags"
        closable
        type="success"
        effect="dark"
        :disable-transitions="false"
        @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        maxlength="10"
        show-word-limit
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
    </el-card>

    <div style="width: 100%; margin-top: 50px; text-align-last:justify;">
      <div style="display: inline-block">
        <el-button type="primary" icon="el-icon-finished" @click="submit">{{posts.id?'保存':'发表'}}</el-button>
        <el-checkbox v-model="posts.anonymous" style="margin-left: 30px" v-if="!posts.id">匿名</el-checkbox>
      </div>
      <el-button type="success" icon="el-icon-back" style="margin:auto" @click="back()">返回</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      posts: {
        type: Object,
        default() {
          return {
            title: null,
            content: null,
            tags: null,
            anonymous: false
          }
        }
      },
    },
    data() {
      return {
        img_file: [],
        inputVisible: false,
        inputValue: '',
        xssOptions: {
          whiteList: {
            span: ['script']
          }
        },
        markdownOption: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          navigation: true, // 导航目录
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          subfield: true, // 单双栏模式
          preview: true, // 预览
        },
      }
    },
    methods: {
      //上传图片
      $imgAdd(pos, $file) {
        // 第一步.将图片上传到服务器.
        this.img_file[pos] = $file;
        let formData = new FormData();
        formData.append("multipartFile", $file);
        this.$axios({
          url: 'file',
          method: 'post',
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'},
        }).then((res) => {
          let url = res.data.data.url;
          this.$refs.md.$img2Url(pos, url);
        });
      },
      //删除图片
      $imgDel(pos) {
        //pos为数组，pos[0]上传图片前为序号，上传后为url
        this.$axios({
          url: pos[0],
          method: 'delete'
        });
        delete this.img_file[pos[0]];
      },
      uploadImg($e) {
        let formData = new FormData()
        for (let _img in this.img_file) {
          formData.append("pos", _img);
        }
        this.$axios({
          url: 'file/multi',
          method: 'post',
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'},
        }).then((res) => {
          /**
           * 例如：返回数据为 res = [[pos, url], [pos, url]...]
           * pos 为原图片标志（0）
           * url 为上传后图片的url地址
           */
            // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          let arr = res.data.data;
          for (let i in arr) {
            // $vm.$img2Url 详情见本页末尾
            this.$refs.md.$img2Url(arr[i].pos, arr[i].url);
            // this.$refs.md.$img2Url(i, arr[i].url);
          }
        })
      },
      // 提交
      submit() {
        this.$axios({
          url: 'posts',
          method: this.posts.id ? 'put' : 'post',
          data: this.posts
        }).then((res => {
            let code = res.data.code;
            if (code === 0) {
              window.location.href = this.$route.query.redirect || "/";
            }
          }))
      },
      back() {
        this.$router.go(-1);
      },
      //标签方法
      handleClose(tag) {
        this.posts.tags.splice(this.posts.tags.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          if (!this.posts.tags)
            this.posts.tags = [];
          this.posts.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  }

</script>

<style>
  /*输入框前缀样式*/
  .el-input-group__prepend {
    background-color: #409EFF;
    color: #F2F6FC;
  }

  /*编辑器样式*/
  .mavonEditor {
    width: 100%;
    height: 100%;
  }

  /*标签组件样式*/
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 200px;
    margin-left: 10px;
    vertical-align: bottom;
  }

</style>
