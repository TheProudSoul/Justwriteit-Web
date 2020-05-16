<template>
  <div class="title-bar-view">
    <div class="title-bar-left">
      <div class="logo"></div>
      <div class="title-bar-actions"></div>
    </div>

    <div class="title-bar-right">
      <el-dropdown :hide-on-click="false" trigger="hover"  @command="handleCommand">
        <span class="el-dropdown-link">
          <el-avatar
            size="large"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          ></el-avatar>
        </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>你好，{{username}}</el-dropdown-item>
          <el-dropdown-item divided command="logout">logout</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      username: state => state.Account.username,
      email: state => state.Account.email,
      isLogin: state => state.Account.isLogin,
      userId: state => state.Account.userId
    })
  },
  methods:{
    handleCommand(command) {
        if(command=='logout'){
          console.log('logout')
      this.$store.commit('logout')
      this.$router.push('/login');
        }
      }
    
  }
};
</script>

<style scoped>
.title-bar-view {
  display: grid;
  grid-template-columns: 1fr auto;
  height: 60px;
  align-items: center;
}
.logo {
  height: 50px;
  width: 200px;
  background: url('../assets/img/logo.svg') no-repeat;
  /* background: url("../assets/img/logo.png") no-repeat; */
  background-size: contain;
}
</style>