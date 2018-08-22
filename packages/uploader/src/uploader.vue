<template>
    <div class="gk-uploader">
        <gk-table ref="table" :data="list" :show-header="isFull" :show-checkbox="isFull" :height="height"
                  @check="updateHeadLabel">
            <gk-table-column :checkbox="isFull" :width="30" align="center"></gk-table-column>
            <gk-table-column property="name" :label="headLabel"></gk-table-column>
            <gk-table-column property="size" :width="50" :formatter="formatSize"></gk-table-column>
            <gk-table-column property="id" :formatter="formatOption" align="center" :width="100"></gk-table-column>
        </gk-table>
    </div>
</template>

<script>
  import WebUploader from 'webuploader';
  import swgimg from 'webuploader/dist/Uploader.swf';
  import GkTable from "gokuai-components/packages/table/src/table";
  import GkTableColumn from "gokuai-components/packages/table/src/table-column";
  import {isIE, bitSize} from "gokuai-components/src/common/util";

  export default {
    name: "GkUploader",
    components: {GkTable, GkTableColumn},
    props: {
      mode: {
        type: String,
        default: 'full'
      },
      auto: {
        type: Boolean,
        default: false
      },
      server: {
        type: String,
        required: true
      },
      buttons: {
        type: String,
        default: 'bottom'
      },
      selector: String,
      height: {
        type: Number,
        default: 400
      },
      headTpl: {
        type: String,
        default: 'selected :d'
      }
    },
    data() {
      return {
        headLabel: this.headTpl.replace(':d', 0),
        list: [],
        files: [],
        uploader: {}
      }
    },
    computed: {
      isFull() {
        return this.mode === 'full';
      }
    },
    methods: {
      formatSize(value) {
        return bitSize(value);
      },
      formatOption(value) {
        let h = this.$createElement;
        let self = this;
        return h('i', this.auto ? {
          'class': 'gk-icon-check'
        } : {
          'class': 'gk-icon-close',
          on: {
            click() {
              self.removeFile(value);
              self.updateHeadLabel();
            }
          }
        });
      },
      updateHeadLabel() {
        this.headLabel = this.headTpl.replace(':d', this.$refs.table.getCheckedIndex().length);
      },
      findFile(id) {
        for (let i in this.files) {
          if (this.files[i].id === id) {
            return {file: this.files[i], index: i};
          }
        }
      },
      removeFile(id) {
        let {file, index} = this.findFile(id);
        Object.values(this.uploader).forEach((uploader) => {
          uploader.removeFile(file);
        });
        this.files.splice(index, 1);
        this.list.splice(index, 1);
      },
      webUpload(selector) {
        if (this.uploader[selector]) {
          return;
        }
        let uploader = WebUploader.create({
          auto: this.auto,
          swf: swgimg,
          server: this.server,
          pick: {
            id: selector,
            multiple: true
          }
        });

        uploader.on('fileQueued', (file) => {
          this.list.push({
            id: file.id,
            name: file.name,
            size: file.size
          });
          this.files.push(file);
          this.$emit('before', file);
        });

        this.uploader[selector] = uploader;
      },
      initDelete(selector) {
        document.querySelector(selector).onclick = () => {
          let checked = this.$refs.table.getChecked();
          checked.forEach(file => {
            this.removeFile(file.id);
          });
          this.updateHeadLabel();
        };
      }
    },
    mounted() {
      if (this.selector) {
        this.webUpload(this.selector);
      } else {
        this.webUpload('.gk-file-uploader');

        if (!isIE()) {
          this.webUpload('.gk-folder-uploader');

          let timer = setInterval(() => {
            let input = document.querySelector('.gk-folder-uploader input');
            if (input) {
              input.setAttribute('webkitdirectory', '');
              clearInterval(timer);
            }
          }, 10);
        }

        this.initDelete('.gk-uploader-delete');
      }
    }
  }
</script>