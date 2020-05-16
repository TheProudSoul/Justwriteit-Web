<template>
  <div class="login">
    <img alt="JustDoneIt logo" src="../assets/logo_big.png" />
    <el-form
      :model="loginForm"
      status-icon
      :rules="validateForm"
      ref="loginForm"
      label-width="100px"
      style="margin-right:100px"
    >
      <el-form-item label="Username" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password" style="margin-bottom:0">
        <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom:0;text-align:right">
        <router-link to="forget-password">
          <el-button type="text">Forget password?</el-button>
        </router-link>
      </el-form-item>
      <el-form-item style="margin-bottom:0">
        <el-button type="primary" style="width:100%;" @click="submitForm('loginForm')">Log in</el-button>
      </el-form-item>
      <el-form-item>
        Don't have an account yet?
        <router-link to="registration">
          <el-button type="text">Create one</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name:"Login",
  data() {
    const checkUsername = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("Username can not be empty"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Password can not be empty"));
      } else if (value.length < 8) {
        callback(new Error("Your password should be at least 8 characters"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        password: "testtest",
        username: "Test"
      },
      validateForm: {
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        username: [
          { required: true, validator: checkUsername, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.userApi.login(this.loginForm).then(res => {
              // redirct
              console.log(res.data)
              this.$router.push('/home');
              if (res.data.errCode == "00") {
            this.$store.dispatch("login", res.data.data);
            this.$router.push('home');
          } else {
            // 
          }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(470px, 800px);
  grid-template-rows: auto auto 80px;
  place-content: center;
}
img {
  display: grid;
  width: 400px;
  place-self: center;
  /* align: center; */
}
.el-form {
  font-weight: bold;
}
</style>