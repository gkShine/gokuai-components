<template>
    <div class="container">
        <h3 class="demo-title">
            文件管理器
        </h3>
        <div class="demo-block" style="height: 768px; width: 1024px">
            <gk-finder v-if="Object.keys(root).length" v-model="openFile" :root="root" :list="fileList" :total="total" :loading="loading"
                       :default-sort="sort" :sort-list="sortList" @load-more="getMore" :show-more="locked" :more-text="moreText"
            ></gk-finder>
        </div>
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
        cache: {},
        total: 0,
        page: 1,
        fileList: [],
        loading: false,
        locked: false,
        moreText: '加载中...',
        sort: 'filename asc',
        sortList: [
          {
            value: 'filename',
            label: '文件名'
          },
          {
            value: 'last_dataline',
            label: '最后修改'
          },
          {
            value: 'filesize',
            label: '大小'
          }
        ]
      }
    },
    watch: {
      'openFile': 'changeOpenFile'
    },
    methods: {
      getFiles(fullpath) {
        if (this.cache[fullpath] !== undefined) {
          this.fileList = this.cache[fullpath];
          return;
        }
        let para = {
          page: 1,
          fullpath: fullpath
        };
        this.loading = true;
        getFileList(para).then(data => {
          this.cache[fullpath] = this.fileList = data.list;
          this.page = 1;
          this.total = data.total;
          this.loading = false;
        });
      },
      getRoot() {
        getFile({}).then(data => {
          this.root = data;

          this.getFiles(data.fullpath);
        });
      },
      getMore(file) {
        if (this.locked) {
          return;
        }
        let para = {
          page: ++this.page,
          fullpath: file.fullpath
        };
        this.locked = true;
        getFileList(para).then(data => {
          this.fileList = this.fileList.concat(data.list);
          this.locked = false;
        });
      },
      changeOpenFile() {
        this.getFiles(this.openFile.fullpath);
      }
    },
    mounted() {
      this.getRoot();
    }
  }
</script>