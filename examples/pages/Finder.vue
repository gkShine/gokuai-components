<template>
    <div class="container">
        <h3 class="demo-title">
            文件管理器
        </h3>
        <div class="demo-block" style="height: 768px;">
            <gk-finder ref="finder" checkbox v-if="Object.keys(root).length" v-model="openFile" :root="root" :list="fileList" :total="total" :loading="loading" :buttons="buttons" @command="fileCommand" :item-buttons="[{label: '下载', command: 'download'},{label: '下载', command: 'download'},{label: '下载', command: 'download'}]" :translate="translate" :default-sort="sort" :sort-list="sortList" @load-more="getMore" :show-more="locked" :more-text="moreText" >
              <div>
                我是空空空的
              </div>
            </gk-finder>
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
        translate: {
          all: '全选'
        },
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
    computed: {
      buttons() {
        return [{
          label: '下载',
          command: 'download',
          before: () => false
        }, {
          label: '保存到库',
          command: 'saveto'
        }];
      }
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
        if (!this.openFile.dir) {
          return;
        }
        this.getFiles(this.openFile.fullpath);
      },
      fileCommand(file, command) {
        this.$refs.finder.up();
      }
    },
    mounted() {
      this.getRoot();
    }
  }
</script>