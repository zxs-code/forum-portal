<template>
  <div style="width: 500px">
    <el-form :model="form" label-position="top">
      <el-form-item label="邮箱">
        <el-input v-model="form.account" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="form.confirmPassword" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <div style="display: inline-block">
          <el-input v-model="form.captcha" placeholder="验证码"></el-input>
        </div>
        <el-button @click="sendMsg" type="primary" :disabled="canClick">{{ content }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        content: '发送邮件',
        totalTime: 60,
        canClick: false,
        form: {
          accountType: 'EMAIL',
          verifyType: 'MODIFY_PASSWORD',
          account: null,
          password: null,
          confirmPassword: null,
          captcha: null,
        }
      }
    },
    methods: {
      onSubmit() {
        if (!this.form.account) {
          this.$message({
            message: '邮箱不能为空',
            type: 'error'
          });
          return false;
        } else if (this.form.password !== this.form.confirmPassword) {
          this.$message({
            message: '密码不一致',
            type: 'error'
          });
          return false;
        }
        const formData = new FormData();
        Object.keys(this.form).forEach((key) => {
          formData.append(key, this.form[key]);
        });
        this.$axios.put('/auth/password', formData)
          .then((res) => {
            if (res.data.code === 0)
              window.location.href = "/login"
          })
      },
      sendMsg() {
        if (!this.form.account) {
          this.$message({
            message: '邮箱不能为空',
            type: 'error'
          });
          return;
        }
        if (this.canClick) return
        const formData = new FormData();
        formData.append("account", this.form.account);
        formData.append("accountType", this.form.accountType);
        formData.append("verifyType", this.form.verifyType);
        this.$axios.post('/auth/captcha', formData)
          .then((res) => {
            if (res.data.code === 0) {
              this.canClick = true
              this.content = this.totalTime + 's后重新发送'
              let clock = window.setInterval(() => {
                this.totalTime--
                this.content = this.totalTime + 's后重新发送'
                if (this.totalTime < 0) {
                  window.clearInterval(clock)
                  this.content = '重新发送'
                  this.totalTime = 60
                  this.canClick = false
                }
              }, 1000);
            }
          });

        // let clock = window.setInterval(() => {
        //   this.totalTime--
        //   this.content = this.totalTime + 's后重新发送'
        //   if (this.totalTime < 0) {
        //     window.clearInterval(clock)
        //     this.content = '重新发送短信'
        //     this.totalTime = 60
        //     this.canClick = false
        //   }
        // }, 1000);
      }
    }
  }
</script>
