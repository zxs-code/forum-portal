<template>
  <div class="my-info-box">
    <el-form label-position="right" label-width="80px" :model="user">
      <el-form-item label="id">
        <span class="no-change">{{user.id}}</span>
      </el-form-item>
      <!--      <el-form-item label="用户名">-->
      <!--        <span class="no-change">{{user.username}}</span>-->
      <!--      </el-form-item>-->
      <el-form-item label="昵称">
        <el-input v-model="user.nickname"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="user.gender">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
          <el-radio :label="2">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker type="date" placeholder="选择日期" v-model="user.birthday" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <forum-avatar v-if="user.avatar" :src="user.avatar" :size="100"></forum-avatar>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="个性签名">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="user.signature">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import ForumAvatar from "./ForumAvatar";

  export default {
    data() {
      return {
        labelPosition: 'right',
        user: {
          id: '1234',
          username: '1243',
          nickname: '5213523',
          gender: 0,
          birthday: '2002-02-02',
          avatar: '',
          signature: ''
        }
      };
    },
    methods: {
      loadMyInfo() {
        this.$axios.get('user/info/myInfo')
          .then((res) => {
            if (res.data.code === 0) {
              this.user = res.data.data;
            }
          })
      },
      save() {
        this.$axios.put('user/info/myInfo',
          {
            nickname: this.user.nickname,
            gender: this.user.gender,
            birthday: this.user.birthday,
            avatar: this.user.avatar,
            signature: this.user.signature
          }
        )
      },
      handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return false;
        }
        console.log(file);
        let formData = new FormData();
        formData.append("multipartFile", file);
        this.$axios({
          url: 'file',
          method: 'post',
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'},
        }).then((res) => {
          this.user.avatar = res.data.data.url;
        });
        return false;
      }
    },
    components: {ForumAvatar},
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/global1";

  .my-info-box {
    .el-form-item {
      width: 600px;
    }
  }

  .no-change {
    color: $text-minor;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
