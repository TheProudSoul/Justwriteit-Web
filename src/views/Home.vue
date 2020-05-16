<template>
  <el-container style="height: 100%">
    <el-header class="header">
      <TitleBar />
    </el-header>
    <el-container style="height: 100%">
      <el-header height="35px" class="file-actions-bar">
        <div class="mde-toolbar">
          <mde-button
            v-bind:disabled="item.disabled"
            v-bind:icon="item.icon"
            v-bind:key="item.type"
            v-bind:menu="item.menu"
            v-bind:text="item.text"
            v-bind:tooltip="item.tooltip"
            v-bind:type="item.type"
            v-for="item in actionsItems"
            v-on:click.native="doAction(item)"
          ></mde-button>
        </div>
      </el-header>
      <el-container style="height: 100%">
        <el-aside width="200px">
          <FileTree id="file-tree" ref="filetree" :nodesData="nodes" @nodeClick="nodeClick" />
        </el-aside>
        <el-main>
          <MainView ref="editor" :markdown="fileInfo" />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
  <!-- <div class="main-container">
    <FileTree id="file-tree" ref="filetree" :nodesData="nodes" @nodeClick="nodeClick" />
    <MainView ref="editor" :markdown="fileInfo" />
  </div>-->
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import TitleBar from "@/components/TitleBar";
import FileTree from "@/components/FileTree";
// import Editor from "@/components/Editor";
import MainView from "@/components/MainView";
import { mapState } from "vuex";
import Button from "@/components/mde-ui/mde-button.vue";
import util from "util";

export default {
  name: "Home",
  data() {
    return {
      actionsItems: [
        {
          text: "下载",
          type: "file",
          disabled: false,
          tooltip: {
            show: true,
            inverted: true,
            small: true,
            position: "bottom center",
            info: "download"
          }
        },
        {
          text: "新建文件",
          type: "file",
          disabled: false,
          tooltip: {
            show: true,
            inverted: true,
            small: true,
            position: "bottom center",
            info: "file"
          }
        },
        {
          text: "新建文件夹",
          type: "file",
          disabled: false,
          tooltip: {
            show: true,
            inverted: true,
            small: true,
            position: "bottom center",
            info: "folder"
          }
        },
        {
          text: "保存文件",
          type: "file",
          disabled: false,
          tooltip: {
            show: true,
            inverted: true,
            small: true,
            position: "bottom center",
            info: "save"
          }
        },
        {
          text: "删除",
          type: "file",
          disabled: false,
          tooltip: {
            show: true,
            inverted: true,
            small: true,
            position: "bottom center",
            info: "delete"
          }
        }
      ],
      currentNode: null,
      currentFile: null,
      nodes: [],
      fileInfo: ""
    };
  },
  computed: {
    ...mapState({
      username: state => state.Account.username,
      email: state => state.Account.email,
      isLogin: state => state.Account.isLogin,
      userId: state => state.Account.userId,
      doc: state => state.Editor.doc
    })
  },
  components: {
    FileTree,
    MainView,
    TitleBar,
    [Button.name]: Button
  },
  created() {
    this.$api.editorApi.listFileSystem(this.userId).then(res => {
      console.log(res.data);
      this.nodes = res.data.data;
    });
  },
  methods: {
    nodeClick(data, node) {
      if (data.leaf) {
        this.$api.editorApi.readFile(this.userId, data.pathName).then(res => {
          this.fileInfo = res.data.data;
        });
        console.log("this node is leaf");
        this.currentFile = node;
      }
      this.currentNode = node;
    },
    doAction(item) {
      switch (item.tooltip.info) {
        case "download": {
          const blobURL = this.$api.editorApi.retrieve(
            this.userId,
            this.currentNode.data.pathName
          );
          const tempLink = document.createElement("a");
          tempLink.style.display = "none";
          tempLink.href = blobURL;
          // tempLink.setAttribute('download', decodeURI(filename))
          // // 兼容：某些浏览器不支持HTML5的download属性
          // if (typeof tempLink.download === "undefined") {
          //   tempLink.setAttribute("target", "_blank");
          // }
          // 挂载a标签
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          // 释放blob URL地址
          window.URL.revokeObjectURL(blobURL);
          break;
        }
        case "file": {
          // console.log(`${util.inspect(this.currentNode)}`);
          this.$prompt("请输入文件名", "新建文件", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(({ value }) => {
              // 确定路径
              let newPath;
              let title = value + ".md";
              if (this.currentNode == null) {
                newPath = title;
              } else {
                let dirPath = this.currentNode.data.leaf
                  ? this.currentNode.data.dirPath
                  : this.currentNode.data.pathName + "/";
                if (dirPath == ".") newPath = title;
                else {
                  newPath = dirPath + title;
                }
              }
              // 调用文件操作的 api
              this.$api.editorApi
                .commitAdd(this.userId, newPath, false)
                .then(res => {
                  if (res.data.errCode == "00") {
                    let nodeData = {
                      title: title,
                      leaf: true,
                      pathName: newPath,
                      dirPath: newPath.substr(0, newPath.length - title.length)
                    };

                    if (this.currentNode.data.leaf) {
                      this.$refs.filetree.insertAfter(
                        nodeData,
                        this.currentNode
                      );
                    } else {
                      this.$refs.filetree.append(nodeData, this.currentNode);
                    }

                    this.$message({
                      type: "success",
                      message: "你的文件名是: " + newPath
                    });
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消新建文件"
              });
            });
          break;
        }
        case "folder": {
          this.$prompt("请输入文件夹名", "新建文件夹", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(({ value }) => {
              let newPath;
              if (this.currentNode == null) {
                newPath = value;
              } else {
                let dirPath = this.currentNode.data.leaf
                  ? this.currentNode.data.dirPath
                  : this.currentNode.data.pathName + "/";
                if (dirPath == ".") newPath = value + ".md";
                else {
                  newPath = dirPath + value;
                }
              }
              // 调用文件操作的 api
              this.$api.editorApi
                .commitAdd(this.userId, newPath, true)
                .then(res => {
                  if (res.data.errCode == "00") {
                    this.$message({
                      type: "success",
                      message: "你的文件夹名是: " + newPath
                    });
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消新建文件夹"
              });
            });
          break;
        }
        case "save": {
          let newPath;
          if (this.currentFile == null) {
            this.$prompt("请输入文件保存路径", "保存文件", {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            })
              .then(({ value }) => {
                newPath = value + ".md";
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "取消保存文件"
                });
              });
          } else {
            newPath = this.currentFile.data.pathName;
            console.log("new path:", newPath);
            this.$api.editorApi
              .commitEdit(this.userId, newPath, this.doc)
              .then(res => {
                if (res.data.errCode == "00") {
                  this.$message({
                    type: "success",
                    message: "你修改了: " + this.currentFile.data.pathName
                  });
                }
              });
          }

          break;
        }
        case "delete": {
          this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$api.editorApi
                .commitDelete(
                  this.userId,
                  this.currentNode.data.pathName,
                  this.currentNode.data.leaf
                )
                .then(res => {
                  console.log(res)
                  if (res.data.errCode == "00") {
                    this.$refs.filetree.deleteNode(this.currentNode);
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
          break;
        }
      }
    }
  }
};
</script>
<style scoped>
.main-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  height: 100%;
}
.header {
  background-color: #365347;
  align-items: center;
}
.file-actions-bar{
  /* background-color: blanchedalmond; */
  align-items: center;
}
.el-main {
  padding: 0;
}
.el-aside {
  border-right: 1px solid rgba(194, 199, 202, 0.6);
}
</style>
