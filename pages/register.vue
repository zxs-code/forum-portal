<template>
  <div class="login_container">
    <div class="login_box">
      <h1 style="display: flex;justify-content: center;color: white;font-weight: normal">注册</h1>
      <el-form label-width="0px" class="login_in" ref="registerForm" :model="registerForm" :rules="rules">
        <el-form-item prop="username">
          <el-input type="text" prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-thumb" placeholder="请输入密码"
                    v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input type="email" prefix-icon="el-icon-message" placeholder="请输入邮箱"
                    v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <nuxt-link to="login" style="color: #409EFF;margin-right: 170px">已有账号？</nuxt-link>

          <!--          <el-button type="text">忘记密码？</el-button>-->
          <el-button type="primary" @click="submitForm('registerForm')">注册</el-button>
          <el-button @click="resetForm('registerForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RegisterComponent",
    data() {
      return {
        registerForm: {
          username: null,
          password: null,
          email: null
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
            this.$axios.post("/auth/register", this.registerForm)
              .then((res) => {
                if (res.data.code === 0)
                  window.location.href = "/login";
              });
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
    height: 350px;
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

