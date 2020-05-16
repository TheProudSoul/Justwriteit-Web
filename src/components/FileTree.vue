<template>
  <div class="file-tree-view">
    <el-tree :data="nodesData" highlight-current ref="tree" @node-click="nodeClick" @node-contextmenu='nodeContextMenu'>
      <span  class="custom-tree-node" slot-scope="{ node, data }">
        <span class="item-icon">
          <font-awesome-icon icon="file" v-if="data.leaf"></font-awesome-icon>
          <font-awesome-icon icon="folder" v-if="!data.leaf"></font-awesome-icon>
        </span>
        {{ data.title }}
      </span >
    </el-tree>
  </div>
</template>

<script>
import { mapState } from "vuex";
import util from "util";

export default {
  name: "FileTree",
  props: ['nodesData'],
  data() {
    return {
      nodes: [],
      defaultProps: {
          children: 'children',
          label: 'title'
        }
    };
  },
  computed: {
    ...mapState({
      username: state => state.Account.username,
      email: state => state.Account.email,
      isLogin: state => state.Account.isLogin,
      userId: state => state.Account.userId
    })
  },
  created() {
    this.$api.editorApi.listFileSystem(this.userId).then(res => {
      this.nodes = res.data.data;
    });
  },
  methods:{
    nodeClick(data, node, event) {
      this.$emit("nodeClick", data, node);
    },
    
    nodeContextMenu(event,data, node, component) {
      console.log(`nodeContextMenu `,event,data, node, component);
      // this.$refs.slvuetree.select(node.path);
      // this.contextMenuIsVisible = true;
      // const $contextMenu = this.$refs.contextmenu;
      // $contextMenu.style.left = event.clientX + "px";
      // $contextMenu.style.top = event.clientY + "px";
    },

    deleteNode(node){
      this.$refs.tree.remove(node)
    },

    insertAfter(data,node){
      this.$refs.tree.insertAfter(data,node)
    },

    append(data,node){
      this.$refs.tree.append(data,node)
    }
  }
};
</script>

<style>
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  background-color: #365347 !important;
  color: #fff;
}
</style>