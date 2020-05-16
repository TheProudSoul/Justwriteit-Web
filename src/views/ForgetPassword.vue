<template>
  <div class="forget-password">
    <h1>Forgot password 😫</h1>
    <p>Enter your email address to reset</p>
    <el-form :model="emailValidateForm" ref="emailValidateForm">
      <el-form-item prop="email" :rules="email">
        <el-input type="email" v-model="emailValidateForm.email" placeholder="Email Address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width:100%"
          @click="submitForm('emailValidateForm')"
        >Send reset link</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    const EMAIL_PATTERN = new RegExp(
      "^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@" +
        "[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$"
    );
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("Email address can not be empty"));
      } else {
        if (!EMAIL_PATTERN.test(value)) {
          return callback(new Error("Invalid email"));
        }
        callback();
      }
    };
    return {
      emailValidateForm: {
        email: ""
      },
      email: [{ required: true, validator: validateEmail, trigger: "blur" }]
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.userApi
            .sendResetLink(this.emailValidateForm)
            .then(res => {
              // TODO 提示语
              // resolve(true);
            })
            .catch(err => {
              console.log(err);
              // reject(false);
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
.forget-password {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(350px, 500px);
  grid-template-rows: auto auto auto auto 80px;
  grid-gap: 20px;
  place-content: center;
}
p {
  font-size: 1.4em;
}
</style>