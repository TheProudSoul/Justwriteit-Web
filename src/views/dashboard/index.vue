<template>
  <v-app id="dashboard">
    <v-navigation-drawer mobile-break-point="0" v-model="drawer" :width="260" clipped app>
      <v-row align="center" justify="center">
        <div class="font-weight-bold headline py-4">Super Knowledge</div>
      </v-row>
      <v-row align="center" justify="center">
        <v-avatar tile :size="100">
          <img src="@/assets/logo.png" alt="logo" />
        </v-avatar>
      </v-row>
      <v-row align="center" justify="center">
        <v-switch
          :label="(!$vuetify.theme.dark ? 'Light' : 'Dark') + ' Theme'"
          v-model="$vuetify.theme.dark"
        />
      </v-row>
      <v-list nav dense>
        <v-divider />
        <v-list-item-group v-model="group" color="primary">
          <v-subheader>Basement</v-subheader>
          <v-list-item to="/" :key="1">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Library</v-list-item-title>
          </v-list-item>
            <v-list-item to="/version-control" :key="2">
              <v-list-item-icon>
                <v-icon>mdi-source-merge</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Version Control</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-subheader>PicBed</v-subheader>
            <v-list-item to="/picbed/upload" :key="3">
              <v-list-item-icon>
                <v-icon>mdi-cloud-upload</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Image Upload</v-list-item-title>
            </v-list-item>
            <v-list-item to="/picbed/gallery" :key="4">
              <v-list-item-icon>
                <v-icon>mdi-folder-multiple-image</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Gallery</v-list-item-title>
            </v-list-item>
          <v-divider />
          <v-subheader>System</v-subheader>
          <v-list-item to="/settings" :key="5">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
          <v-dialog v-model="logoutDialog" persistent max-width="290">
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-export</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </template>
            <v-card>
              <v-card-title class="headline">Action Confirm</v-card-title>
              <v-card-text>Are you sure you want to LOGOUT?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary darken-1" text @click="logoutDialog = false">CANCEL</v-btn>
                <v-btn color="red darken-1" text @click="logout()">COMMIT</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </v-list>
      <template v-slot:append>
        <v-row class="user-info" align="center">
          <v-avatar class="primary darken-1 mr-2 ml-6 mb-2">
            <span class="white--text headline">{{avatar}}</span>
          </v-avatar>
          <strong v-html="username"></strong>
          <span class="grey--text">&nbsp;({{ email }})</span>
        </v-row>
      </template>
    </v-navigation-drawer>
    <v-app-bar flat elevation="1" style="-webkit-app-region: drag" clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="-webkit-app-region: no-drag"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title class="pl-12">
        <h5>Super Knowledge</h5>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  data: () => ({
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
      value => (value || "").length <= 30 || "Max 30 characters",
      value => (value || "").length >= 8 || "Min 8 characters"
    ],
    loginError: "",
    drawer: true,
    group: 1,
    logoutDialog: false,
    loginDialog: false,
    loginForm: {
      email: "",
      password: ""
    },
    loginloading: false
  }),
  watch: {
    email() {
      this.errMsg = "";
    },
    password() {
      this.errMsg = "";
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.account.isLogin,
      username: state => state.account.username,
      email: state => state.account.email
    }),
    ...mapGetters({
      avatar: "avatar"
    })
  },
  methods: {
    logout() {
      this.$router.push("/login");
      this.$store.dispatch("logout");
      this.logoutDialog = false;
    }
  }
};
</script>

<style>
</style>