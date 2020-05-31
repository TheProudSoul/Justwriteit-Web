<template>
  <v-container fluid class="fill-height pa-0">
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <editor
      @focus="onEditorFocus"
      @blur="onEditorBlur"
      @change="onEditorChange"
      initialEditType="wysiwyg"
      :options="editorOptions"
      ref="toastuiEditor"
      height="100%"
      style="width:100%"
    ></editor>
    <v-dialog v-model="dialog" persistent max-width="290">
      <template v-slot:activator="{ on }">
        <v-btn id="dialogBtn" color="primary" dark v-on="on" style="display: none"></v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Save Before Leave?</v-card-title>
        <v-card-text>You have unsaved change. Do you want to save these change ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="stay">cancel</v-btn>
          <v-btn color="red darken-1" text @click="loadNewContent">Dont Save</v-btn>
          <v-btn color="primary darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";

import { Editor } from "@toast-ui/vue-editor";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    editor: Editor
  },
  data: () => ({
    editorOptions: {
      usageStatistics: false,
      useCommandShortcut: true
    },
    dialog: false,
    focused: false,
    loading: false,
    oldCurrentFile: null
  }),
  computed: {
    ...mapState({
      isChange: state => state.library.isChange,
      currentFile: state => state.library.currentFile,
      saveFileEvent: state => state.library.saveFileEvent,
      content: state => state.library.content
    })
  },
  mounted() {
    this.setMarkdown();
  },
  watch: {
    currentFile(newFile, old) {
      if (this.isChange) {
        this.oldCurrentFile = old;
        document.getElementById("dialogBtn").click();
      } else {
        this.loadNewContent()
      }
    },
    saveFileEvent(value) {
      if (value) {
        this.saveFile();
      }
    },
    content() {
      this.setMarkdown();
    }
  },
  methods: {
    ...mapMutations({
      setChange: "setChange",
      setSelectItem: "setSelectItem",
      commitContent: "commitContent"
    }),
    onEditorFocus() {
      this.focused = true;
      console.log("onEditorFocus");
    },
    onEditorBlur() {
      console.log("onEditorBlur");
    },
    onEditorChange() {
      if (this.focused && this.getMarkdown() != this.content) {
        this.setChange(true);
      }
    },
    getMarkdown() {
      return this.$refs.toastuiEditor.invoke("getMarkdown");
    },
    setMarkdown() {
      this.$refs.toastuiEditor.invoke("setMarkdown", this.content, false);
      this.loading = false;
      this.setChange(false);
      this.focused = false;
    },
    stay() {
      this.dialog = false;
      setSelectItem([this.oldCurrentFile]);
    },
    save() {
      this.loading = true;
      let md = this.getMarkdown();
      let pathname;
      if (this.oldCurrentFile == null) {
        pathname = "untitled.md";
        this.$http.notificationApi.commitAdd(pathName, false);
      } else {
        pathname = this.oldCurrentFile.pathName;
      }
      this.$http.notificationApi.commitEdit(pathname, md).then(res => {
        this.commitContent(md);
        this.loading = false;
        this.dialog = false;
      });
    },
    loadNewContent() {
        this.loading = true;
        this.$http.fileApi.fetchContent(this.currentFile.pathName).then(res => {
          this.commitContent(res.data);
        });
    },
    saveFile() {
      this.loading = true;
      let md = this.getMarkdown();
      let pathname;
      if (this.currentFile == null) {
        pathname = "untitled.md";
        this.$http.notification.commitAdd(pathName, false);
      } else {
        pathname = this.currentFile.pathName;
      }
      this.$http.notificationApi.commitEdit(pathname, md).then(res => {
        this.commitContent(md);
        this.loading = false;
      });
    }
  }
};
</script>

<style>
</style>