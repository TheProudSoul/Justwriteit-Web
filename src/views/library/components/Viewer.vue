<template>
  <v-container fluid class="pa-8">
    <viewer ref="viewer" height="100%" />
  </v-container>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Viewer } from "@toast-ui/vue-editor";

import { mapState, mapMutations } from "vuex";

export default {
  components: { viewer: Viewer },
  data: () => ({}),
  computed: {
    ...mapState({
      currentFile: state => state.library.currentFile,
      content: state => state.library.content
    })
  },
  watch: {
    currentFile() {
      this.$http.fileApi.fetchContent(this.currentFile.pathName).then(res => {
        this.commitContent(res.data);
      });
    },
    content() {
      this.setMarkdown();
    }
  },
  mounted() {
    this.setMarkdown();
  },
  methods: {
    ...mapMutations({
      commitContent: "commitContent"
    }),
    setMarkdown() {
      this.$refs.viewer.invoke("setMarkdown", this.content, false);
    }
  }
};
</script>

<style>
</style>