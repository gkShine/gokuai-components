<template>
    <div class="container">
        <gk-finder v-model="openFile" :root="file" :list="fileList" :loading="loading"></gk-finder>
    </div>
</template>

<script>
  import {getFile, getFileList} from "../api";

  export default {
    data() {
      return {
        openFile: {},
        file: {},
        root: {},
        fileList: [],
        loading: false
      }
    },
    methods: {
      getFiles() {
        let para = {
          page: 1
        };
        getFileList(para).then(data => {
          this.fileList = data.list;
        });
      },
      getRoot() {
        getFile({}).then(data => {
          this.root = data;
        });
      }
    },
    mounted() {
      this.getRoot();
      this.getFiles();
    }
  }
</script>

<style scoped>
    .container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
</style>