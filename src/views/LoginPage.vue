<template>
  <v-app>
    <v-content>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1
                          class="text-center display-2 primary--text text--accent-3"
                        >Sign in to Super Knowledge</h1>
                        <h4 class="text-center" mt-4>Ensure your email for registration</h4>
                        <v-form ref="loginForm">
                          <v-text-field
                            label="Email*"
                            v-model="loginForm.email"
                            type="email"
                            :rules="emailRules"
                            color="primary accent-3"
                            prepend-icon="mdi-email"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Password*"
                            v-model="loginForm.password"
                            :loading="loginloading"
                            type="password"
                            :rules="passwordRules"
                            prepend-icon="mdi-lock"
                            color="primary accent-3"
                            :error-messages="loginError"
                            required
                          ></v-text-field>
                        </v-form>
                        <h3 class="text-center mt-3">Forget your password ?</h3>
                      </v-card-text>
                      <div class="text-center mt-3">
                        <v-btn
                          rounded
                          dark
                          class="primary accent-3"
                          :loading="loginloading"
                          @click="login"
                        >SIGN IN</v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="primary accent-3">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Hello, Friends !</h1>
                        <h5
                          class="text-center"
                        >Ensure your personal details and start journay with us</h5>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step++">SIGN UP</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="4" class="primary accent-3">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Welcome Back !</h1>
                        <h5
                          class="text-center"
                        >To enter your Knowledge Basement please login with your email</h5>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step--">SIGN IN</v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1
                          class="text-center display-2 primary--text text--accent-3"
                        >Create Account</h1>
                        <h4 class="text-center mt-4">Ensure your email for registration</h4>
                        <v-form ref="registrationForm">
                          <v-text-field
                            label="Username*"
                            v-model="registrationForm.username"
                            prepend-icon="mdi-account"
                            :rules="usernameRules"
                            color="primary accent-3"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Email*"
                            v-model="registrationForm.email"
                            prepend-icon="mdi-email"
                            type="email"
                            :rules="emailRules"
                            color="primary accent-3"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Password*"
                            v-model="registrationForm.password"
                            :loading="loginloading"
                            type="password"
                            :rules="passwordRules"
                            prepend-icon="mdi-lock"
                            color="primary accent-3"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Comfirm Password*"
                            v-model="registrationForm.confirmPassword"
                            :loading="registrationloading"
                            type="password"
                            :rules="passwordRules"
                            prepend-icon="mdi-lock"
                            color="primary accent-3"
                            :error-messages="registrationError"
                            required
                          ></v-text-field>
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-5">
                        <v-btn rounded dark class="primary accent-3" @click="signup">SIGN UP</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
        <v-bottom-sheet v-model="showSuccuess">
      <v-sheet class="text-center" height="200px">
        <v-btn
          class="mt-6"
          dark
          color="primary"
          @click="showSuccuess = !showSuccuess"
        >close</v-btn>
        <div class="py-3">You have
          <strong>successfully</strong> registrated. Now go and
          <strong>LOGIN</strong> !</div>
      </v-sheet>
    </v-bottom-sheet>
      <!-- <v-alert  dark dismissible border="left" type="primary">
          You have
          <strong>successfully</strong> registrated. Now go and
          <strong>LOGIN</strong> !
        </v-alert> -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    step: 1,
    showSuccuess:false,
    usernameRules: [
      value => !!value || "Required.",
      value => (value || "").length <= 20 || "Max 20 characters"
    ],
    emailRules: [
      value => !!value || "Required.",
      value => (value || "").length <= 20 || "Max 20 characters",
      value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      }
    ],
    passwordRules: [
      value => !!value || "Required.",
      value => (value || "").length <= 20 || "Max 20 characters",
      value => (value || "").length >= 8 || "Min 8 characters"
    ],
    loginForm: {
      email: "",
      password: ""
    },
    registrationForm: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    loginError: "",
    registrationError: "",
    registrationloading: false,
    loginloading: false
  }),
  watch: {
    "loginForm.email"() {
      this.loginError = "";
    },
    "loginForm.password"() {
      this.loginError = "";
    }
  },
  methods: {
    login() {
      if (this.$refs.loginForm.validate()) {
        this.loginloading = true;
        this.$http.userApi.login(this.loginForm).then(res => {
          console.log(res);
          this.loginloading = false;
          if (res.errCode == "00") {
            this.$store.dispatch("login", res.data);
            this.$router.replace("/");
          } else {
            this.loginError = res.errMsg;
          }
        });
      }
      //
    },
    signup() {
      if (this.$refs.registrationForm.validate()) {
        this.registrationloading = true;
        this.$http.userApi.registration(this.registrationForm).then(res => {
          console.log(res);
          this.registrationloading = false;
          if (res.errCode == "00") {
            this.showSuccuess=true
          } else {
            this.registrationError = res.errMsg;
          }
        });
      }
    }
  }
};
</script>

<style>
</style>