<template>
  <div class="registration">
    <img alt="JustDoneIt logo" src="../assets/logo_big.png" />
    <el-form
      :model="registrationForm"
      status-icon
      :rules="validateForm"
      ref="registrationForm"
      label-width="170px"
      style="margin-right:170px"
    >
      <el-form-item label="Email Address" prop="email">
        <el-input type="email" autocomplete="off" v-model="registrationForm.email"></el-input>
      </el-form-item>
      <el-form-item label="Username" prop="username">
        <el-input v-model="registrationForm.username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="registrationForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password" prop="confirmPassword">
        <el-input type="password" v-model="registrationForm.confirmPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom:0">
        <el-button
          type="primary"
          style="width:100%;"
          @click="submitForm('registrationForm')"
        >Create Account</el-button>
      </el-form-item>
      <el-form-item>
        Have an account already?
        <router-link to="login">
          <el-button type="text">Login</el-button>
        </router-link>
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
        return callback(new Error("Email Address can not be empty"));
      } else {
        if (!EMAIL_PATTERN.test(value)) {
          return callback(new Error("Invalid email"));
        }
        callback();
      }
    };
    var checkUsername = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("Username can not be empty"));
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else if (value.length < 8) {
        callback(new Error("Your password should be at least 8 characters"));
      } else {
        if (this.registrationForm.confirmPassword !== "") {
          this.$refs.registrationForm.validateField("confirmPassword");
        }
        callback();
      }
    };
    var validatePassword2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.registrationForm.password) {
        callback(new Error("The two passwords are inconsistent!"));
      } else {
        callback();
      }
    };
    return {
      registrationForm: {
        email: "",
        password: "",
        confirmPassword: "",
        username: ""
      },
      validateForm: {
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, validator: validatePassword2, trigger: "blur" }
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
          this.$api.userApi.registration(this.registrationForm).then(res => {
              // TODO 提示语
              console.log(res.data)
            }).catch(err => {
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
.registration {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(600px, 800px);
  grid-template-rows: auto auto 80px;
  place-content: center;
}
img {
  display: grid;
  width: 500px;
  place-self: center;
  /* align: center; */
}
.el-form {
  font-weight: bold;
}
</style>