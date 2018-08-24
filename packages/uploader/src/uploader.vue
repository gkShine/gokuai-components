<template>
    <div class="gk-uploader">
        <gk-table :fit="fit" ref="table" :data="list" :show-header="showCheck" :show-checkbox="showCheck"
                  :height="height"
                  @check="updateHeadLabel" :beforeSelect="() => false">
            <gk-table-column :checkbox="showCheck" :width="30" align="center"></gk-table-column>
            <gk-table-column property="name" :label="headLabel"></gk-table-column>
            <gk-table-column property="size" :width="50" :formatter="formatSize"></gk-table-column>
            <gk-table-column property="percent" :width="150" :formatter="formatState"></gk-table-column>
            <gk-table-column property="id" :formatter="formatOption" align="center" :width="100"></gk-table-column>
            <div slot="empty" class="gk-uploader-empty">
                <div ref="emptyContent" class="gk-uploader-empty-content" :style="emptyContentStyle">
                    <slot></slot>
                </div>
            </div>
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
      auto: {
        type: Boolean,
        default: true
      },
      server: {
        type: String,
        required: true
      },
      picker: Object,
      height: {
        type: Number,
        default: 400
      },
      headTpl: {
        type: String,
        default: 'selected :d'
      },
      emptyContentWidth: {
        type: Number,
        default: 500
      },
      'form-data': Object,
      buttons: Array,
      options: Object,
      fit: Boolean,
      dnd: Boolean,
      dialog: Boolean
    },
    data() {
      return {
        headLabel: this.headTpl.replace(':d', 0),
        list: [],
        files: [],
        uploader: false,
        emptyContentStyle: {},
      }
    },
    computed: {
      showCheck() {
        return !this.auto;
      },
      buttonList() {
        let list = [];
        if (this.buttons === undefined) {
          list = Object.values(this.defaultButtons);
        } else {
          this.buttons.forEach((button) => {
            if (button.type === 'folder' && this.isIE) {
              return;
            }
            list.push(Object.assign(this.defaultButtons[button.type], button));
          });
        }
        return list;
      },
      defaultButtons() {
        return {
          delete: {
            class: 'gk-uploader-delete'
          },
          file: {
            class: 'gk-uploader-file',
            multiple: true
          },
          folder: {
            class: 'gk-uploader-folder',
            multiple: true
          }
        };
      },
      states() {
        return {
          wait: 0,
          progress: 1,
          success: 2,
          error: 3
        }
      }
    },
    methods: {
      formatSize(value) {
        return bitSize(value);
      },
      formatState(value, file) {
        if (file.percent > 0) {
          return `${(file.percent * 100).toFixed(2)}% ${bitSize(file.speed, true)}/s`;
        }
        return '';
      },
      formatOption(value, file) {
        let h = this.$createElement;
        let self = this;
        return h('i', {
          'class': {
            'gk-icon-times': file.state === this.states.wait && !this.auto,
            'gk-icon-checkcircle': file.state === this.states.success,
            'gk-icon-timescircle': file.state === this.states.progress
          },
          on: {
            click() {
              if (self.auto) {
                return;
              }
              self.removeFile(value);
              self.updateHeadLabel();
            }
          }
        });
      },
      updateHeadLabel() {
        setTimeout(() => {
          this.headLabel = this.headTpl.replace(':d', this.$refs.table.getCheckedIndex().length);
        }, 20);
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
        this.uploader.removeFile(file);
        this.files.splice(index, 1);
        this.list.splice(index, 1);
      },
      webUpload(picker) {
        if (this.uploader !== false) {
          this.uploader.addButton(picker);
          return this.uploader;
        }
        let uploader = WebUploader.create(Object.assign({
          auto: this.auto,
          swf: swgimg,
          server: this.server,
          pick: picker,
          formData: this.formData || {},
          dnd: this.dnd && '.gk-uploader' || undefined,
          disableGlobalDnd: this.dnd
        }, this.options || {}));

        uploader.on('fileQueued', (file) => {
          this.list.push({
            id: file.id,
            name: file.name,
            size: file.size,
            state: 0,
            percent: 0,
            speed: 0
          });
          this.files.push(file);
          this.$emit('before', file);
        });

        uploader.on('uploadProgress', (file, percent) => {
          let {fi, index} = this.findFile(file.id);
          let timestamp = new Date().getTime();
          let diffSecond = (timestamp - (this.list[index].timestamp || timestamp - 1000)) / 1000;
          let diffSize = (percent - this.list[index].percent) * this.list[index].size;
          Object.assign(this.list[index], {
            state: this.states.progress,
            percent: percent,
            timestamp: timestamp,
            speed: diffSize / diffSecond
          });
          this.$emit('progress', file, percent);
        });

        uploader.on('uploadSuccess', (file, response) => {
          console.log(response);
          let {fi, index} = this.findFile(file.id);
          this.list[index].state = this.states.success;
          this.$emit('success', file, response);
        });

        uploader.on('error', type => {
          const desc = {
            F_EXCEED_SIZE: '文件大小超过限制',
            Q_EXCEED_NUM_LIMIT: '文件上传数超出限制'
          };
          this.$emit('error', type, desc);
        });

        uploader.on('uploadComplete', (file, response) => {
          let {fi, index} = this.findFile(file.id);
          this.$emit('complete', file, response);
        });

        this.uploader = uploader;
        return uploader;
      },
      initDelete(selector) {
        document.querySelector(selector).onclick = () => {
          let checked = this.$refs.table.getChecked();
          checked.forEach(file => {
            this.removeFile(file.id);
          });
          this.updateHeadLabel();
        };
      },
      upload() {
        this.uploader.upload();
      },
      updateEmptyStyle() {
        let position = this.$refs.emptyContent.getBoundingClientRect();
        this.emptyContentStyle = {
          width: this.emptyContentWidth + 'px',
          'margin-left': -this.emptyContentWidth / 2 + 'px',
          'margin-top': -position.height / 2 + 'px'
        };
      }
    },
    mounted() {
      this.updateEmptyStyle();
      if (this.picker !== undefined) {
        this.webUpload(this.picker);
      } else {
        this.buttonList.forEach((button) => {
          switch (button.type) {
            case 'delete':
              this.initDelete('.' + button.class);
              break;
            case 'file':
              this.webUpload({
                id: '.' + button.class,
                multiple: button.multiple
              });
              break;
            case 'folder':
              this.webUpload({
                id: '.' + button.class,
                multiple: button.multiple
              });
              let timer = setInterval(() => {
                let inputs = document.querySelectorAll(`.${button.class} input[type=file]`);

                if (inputs.length > 0) {
                  inputs.forEach((input) => {
                    input.setAttribute('webkitdirectory', '');
                  });
                  clearInterval(timer);
                }
              }, 10);
              break;
          }
        });
      }
    }
  }
</script>