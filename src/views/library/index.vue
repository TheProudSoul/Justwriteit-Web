<template>
  <v-app id="library-view">
    <v-navigation-drawer mobile-break-point="0" v-model="drawer" :width="350" app>
      <v-card class="mx-auto" max-width="500">
        <v-sheet tile class="py-1 px-3 primary darken-3">
          <v-row align="center">
            <v-col cols="2">
              <v-btn fab small @click="back">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="5">
              <div class="headline font-weight-bold" style="color: white">{{currentLibrary.name}}</div>
            </v-col>
          </v-row>
          <v-col cols="12" class="pa-1">
            <v-btn-toggle class="mt-3" dense background-color="primary">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="downloadFile" v-on="on">
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </template>
                <span>Download File</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="createFolder" v-on="on">
                    <v-icon>mdi-folder-plus-outline</v-icon>
                  </v-btn>
                </template>
                <span>New Folder</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="createFile" v-on="on">
                    <v-icon>mdi-text-box-plus-outline</v-icon>
                  </v-btn>
                </template>
                <span>New File</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="saveFile" :disabled="!isChange" v-on="on">
                    <v-icon>mdi-content-save-outline</v-icon>
                  </v-btn>
                </template>
                <span>Save Current</span>
              </v-tooltip>
            </v-btn-toggle>
          </v-col>
        </v-sheet>
      </v-card>
      <v-treeview
        color="primary accent-3"
        return-object
        dense
        rounded
        hoverable
        :items="fileList"
        item-text="title"
        item-key="pathName"
        :active="selectItem"
        @update:active="updateActive"
        openOnClick
        activatable
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.leaf">mdi-file-document-outline</v-icon>
          <v-icon v-else>{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
        </template>
        <template v-slot:append="{ item }">
          <v-menu :position-x="0" :position-y="0" absolute offset-y>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" fab x-small>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <!-- 右键菜单 -->
            <v-list dense>
              <v-list-item-group v-model="activeItem" color="primary">
                <v-list-item
                  v-for="cxtItem in contextmenuItems"
                  :key="cxtItem.id"
                  @click.stop="doOperation(item, cxtItem.id)"
                >
                  <v-list-item-title>
                    <v-icon>mdi-{{cxtItem.icon}}</v-icon>
                    {{ cxtItem.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </template>
      </v-treeview>
    </v-navigation-drawer>
    <v-app-bar elevation="1" style="-webkit-app-region: drag" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="-webkit-app-region: no-drag"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        {{currentFileTitle}}
        <span v-show="isChange" style="color:grey">*</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="changeMode">
        <template v-if="isEditMode">View Mode</template>
        <template v-else>Edit Mode</template>
      </v-btn>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>

    <v-dialog v-model="nameDialog" @keydown.enter="newLink" max-width="500">
      <v-card>
        <v-card-title class="headline">Enter the name</v-card-title>
        <v-card-text>
          <v-text-field
            autofocus
            :loading="nameloading"
            :rules="nameRules"
            :error-messages="nameError"
            clearable
            v-model="name"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="grey darken-1" text @click="nameDialog = false">Cancel</v-btn>
          <v-btn color="primary darken-1" text @click="newLink">Commit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Action Confirm</v-card-title>
        <v-card-text>Are you sure you want to DELETE?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="deleteDialog = false">cancel</v-btn>
          <v-btn color="red darken-1" :loading="deleting" text @click="deleteCtx()">
            <v-icon>mdi-delete</v-icon>commit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import Editor from "./components/Editor";
import path from 'path'
import Viewer from "./components/Viewer";

export default {
  data: () => ({
    contextmenuItems: [
      { id: 0, title: "New File", icon: "text-box-plus-outline" },
      { id: 2, title: "New Folder", icon: "folder-plus-outline" },
      { id: 5, title: "Rename", icon: "form-textbox" },
      { id: 1, title: "Move To Trash", icon: "delete-outline" },
      { id: -1, title: "Download", icon: "download" }
    ],
    drawer: true,
    deleteDialog: false,
    nameDialog: false,
    nameloading: false,
    name: "",
    nameRules: [
      value => !!value || "Required.",
      value => (value || "").length <= 100 || "Max 100 characters"
    ],
    nameError: "",
    cxtIndex: 0,
    cxtItem: null,
    deleting: false,
    activeItem: null,
    isEditMode: false
  }),
  computed: {
    ...mapGetters({
      currentFileTitle: "currentFileTitle"
    }),
    ...mapState({
      isLogin: state => state.account.isLogin,
      isChange: state => state.library.isChange,
      selectItem: state => state.library.selectItem,
      fileList: state => state.library.fileList,
      currentLibrary: state => state.library.currentLibrary,
      content: state => state.library.content
    })
  },
  watch: {
    name() {
      this.nameError = "";
    }
  },
  methods: {
    ...mapMutations({
      setFileList: "commitFileList",
      setSelectItem: "setSelectItem",
      commitContent: "commitContent",
      publishSaveFileEvent: "publishSaveFileEvent"
    }),
    back() {
      this.commitContent("");
      this.$router.push("/");
    },
    doOperation(item, cxtIndex) {
      this.cxtIndex = cxtIndex;
      this.cxtItem = item;
      this.name = "";
      switch (cxtIndex) {
        case -1: {
          window.open(this.$http.fileApi.retrieve(item.pathName));
          break;
        }
        case 1: {
          // if (this.cxtItem.isDir) this.cxtIndex = 3;
          this.deleteDialog = true;
          break;
        }
        case 5: {
          this.name = item.title;
        }
        default: {
          // 0:New File
          // 2:New Folder
          // 5:Rename
          this.nameDialog = true;
          break;
        }
      }
    },
    newLink() {
      // TODO 检查名字是否合法

      switch (this.cxtIndex) {
        case 0: {
          this.nameloading = true;
          let pathname = "";
          if (this.cxtItem.leaf) {
            pathname = path.join(this.cxtItem.dirPath, this.name + ".md");
          } else {
            pathname = path.join(this.cxtItem.pathName, this.name + ".md") ;
          }
          this.$http.notificationApi.commitAdd(pathname, false).then(res => {
            this.nameloading = false;
            if (res.errCode == "00") {
              this.fetchData();
            }
          });
          this.nameDialog = false;
          break;
        }
        case 2: {
          this.nameloading = true;
          let pathname = "";
          if (this.cxtItem.leaf) {
            pathname = path.join(this.cxtItem.dirPath, this.name);
          } else {
            pathname = path.join(this.cxtItem.pathName, this.name);
          }
          this.$http.notificationApi.commitAdd(pathname, true).then(res => {
            this.nameloading = false;
            if (res.errCode == "00") {
              this.fetchData();
            }
          });
          this.nameDialog = false;
          break;
        }
        case 5: {
          this.nameloading = true;
          let pathname = this.cxtItem.dirPath + this.name;
          if (this.cxtItem.leaf) {
            pathname = pathname + ".md";
          }
          this.$http.notificationApi
            .commitMove(this.cxtItem.pathName, pathname)
            .then(res => {
              this.nameloading = false;
              if (res.errCode == "00") {
                this.fetchData();
              }
            });
          this.nameDialog = false;
          break;
        }
      }
    },
    deleteCtx() {
      // Move To Trash
      this.deleting = true;
      this.$http.notificationApi
        .commitDelete(this.cxtItem.pathName, !this.cxtItem.leaf)
        .then(res => {
          this.deleting = false;
          if (res.errCode == "00") {
            this.fetchData();
          }
        });
      this.deleteDialog = false;
    },
    updateActive(active) {
      console.log(active);
      if (
        active[0] &&
        active[0].leaf &&
        (!this.currentFile || active[0].pathName != this.currentFile.pathName)
      ) {
        this.setSelectItem(active);
      }
    },
    downloadFile() {
      window.open(this.$http.fileApi.retrieve(""));
    },
    createFolder() {
      this.name = "";
      this.cxtIndex = 2;
      this.cxtItem = { leaf: true, pathName: "",dirPath:'' };
      this.nameDialog = true;
    },
    createFile() {
      this.name = "";
      this.cxtIndex = 0;
      this.cxtItem = { leaf: true, pathName: "",dirPath:'' };
      this.nameDialog = true;
    },
    saveFile() {
      this.publishSaveFileEvent();
    },
    changeMode() {
      this.isEditMode = !this.isEditMode;
      if (this.isEditMode) {
        this.$router.push("/library/edit");
      } else {
        this.$router.push("/library");
      }
    },
    fetchData() {
      this.$http.fileApi.listFileSystem().then(res => {
        this.setFileList(res.data);
      });
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style>
.v-treeview-node.v-treeview-node--rounded .v-treeview-node__root {
  margin: 0;
  font-size: 14px;
}
#library-view {
  overflow: hidden !important;
}
</style>