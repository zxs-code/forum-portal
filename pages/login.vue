<template>
  <div class="login_container">
    <div class="login_box">
      <h1 style="display: flex;justify-content: center;color: white;font-weight: normal" >登录</h1>
      <el-form label-width="0px" class="login_in" ref="loginForm" :model="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input type="text" prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-thumb" placeholder="请输入密码"
                    v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-checkbox v-model="loginForm.rememberMe" style="color: white;margin-right: 10px">记住我</el-checkbox>
          <nuxt-link to="register" style="color: #409EFF;margin-right: 10px">还未注册？</nuxt-link>
          <nuxt-link to="/user/password" style="color: #409EFF;">忘记密码？</nuxt-link>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LoginComponent",
    data() {
      return {
        loginForm: {
          username: null,
          password: null,
          rememberMe: false
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {pattern: /^[A-Za-z][A-Za-z\d]{0,15}$/, message: '用户名只能由数字，字母组成，以字母开头，最大长度16位', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 16, message: '密码长度在6到16个字符之间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post("/auth/login", this.loginForm)
              .then((res) => {
                let code = res.data.code;
                if (code === 0) {
                  this.$store.dispatch('user/removeUserInfo');
                  let url = this.$route.query.redirect || "/";
                  window.location.href = url;
                  // this.$router.push(ursil);
                }
              })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      document.body.style.backgroundImage = 'url(' + require('static/loginImg.jpeg') + ')'
      // document.querySelector('body').setAttribute('style', 'background-image: url("static/loginImg.jpeg")')
    },
    beforeDestroy() {
      document.body.style.backgroundImage = '';
    }
  }
</script>

<style scoped>

  .login_container {
    background-color: #42b983;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    /*background-color: rgba(64,158,255, 0.3);*/
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  .login_in {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

</style>

