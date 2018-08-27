<template>
    <section ref="uploader" class="gk-uploader" :class="{'gk-uploader-dialog': dialog}" :style="{display: hidden ? 'none' : 'block',height: dialog ? height + 'px' : ''}">
        <div class="gk-uploader-head" v-if="dialog">
            <h2>{{dialogTitle()}}</h2>
            <div><i :class="'gk-icon-window-' + (mini ? 'maximize': 'minimize')" @click="mini = !mini"></i><i class="gk-icon-times" @click="hidden=true"></i></div>
        </div>
        <div class="gk-uploader-body">
            <gk-table :fit="fit || dialog" ref="table" :data="list" :show-header="showCheck" :show-checkbox="showCheck"
                      :height="height"
                      @check="updateHeadLabel" :beforeSelect="() => false">
                <gk-table-column :checkbox="showCheck" :width="30" align="center"></gk-table-column>
                <gk-table-column property="name" :label="headLabel"></gk-table-column>
                <gk-table-column property="size" :width="80" :formatter="formatSize"></gk-table-column>
                <gk-table-column property="percent" :width="130" :formatter="formatState"></gk-table-column>
                <gk-table-column property="state" :formatter="formatOption" align="center" :width="100"></gk-table-column>
                <div slot="empty" class="gk-uploader-empty">
                    <div ref="emptyContent" class="gk-uploader-empty-content" :style="emptyContentStyle">
                        <slot></slot>
                    </div>
                </div>
            </gk-table>
        </div>
    </section>
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
      dnd: String,
      chunked: Boolean,
      dialog: Boolean,
      translate: Object
    },
    data() {
      return {
        mini: false,
        hidden: this.dialog,
        headLabel: this.headTpl.replace(':d', 0),
        list: [],
        errorList: [],
        files: [],
        finishFiles: [],
        uploader: false,
        emptyContentStyle: {}
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
            type: 'delete',
            class: 'gk-uploader-delete'
          },
          file: {
            type: 'file',
            class: 'gk-uploader-file',
            multiple: true
          },
          folder: {
            type: 'folder',
            class: 'gk-uploader-folder',
            multiple: true
          }
        };
      },
      states() {
        return {
          ready: 'ready',
          pause: 'pause',
          cancel: 'cancel',
          progress: 'progress',
          success: 'success',
          error: 'error'
        }
      }
    },
    watch: {
      mini: 'changeMini'
    },
    methods: {
      $t(value) {
        return this.translate && this.translate[value] || value;
      },
      dialogTitle() {
        if (this.finishFiles.length === this.list.length) {
          return this.$t('Upload Finish');
        }
        return this.$t('Uploading (:n/:t)').replace(':n', this.finishFiles.length).replace(':t', this.list.length);
      },
      changeMini() {
        this.$refs.uploader.style.height = this.mini ? 'auto' : this.height + 'px';
      },
      formatSize(value) {
        return bitSize(value);
      },
      formatState(value, data) {
        let stateText = '';
        switch (data.state) {
          case this.states.pause:
            stateText = this.$t('paused');
            break;
          case this.states.success:
            stateText = this.$t('successful');
            break;
          case this.states.cancel:
            stateText = this.$t('canceled');
            break;
          case this.states.error:
            stateText = this.$t('error');
            break;
        }
        if (stateText) {
          return this.$createElement('span', {
            'class': 'uploader-state-' + data.state
          }, stateText);
        }
        if (data.percent > 0) {
          return `${(data.percent * 100).toFixed(2)}% ${bitSize(data.speed, true)}/s`;
        }
        return '';
      },
      formatOption(value, data) {
        let h = this.$createElement;
        let self = this;
        let icons = [];
        switch (data.state) {
          case this.states.ready:
            if (!this.auto) {
              icons.push(h('i', {
                'class': 'gk-icon-times',
                on: {
                  click() {
                    self.removeFile(data.id);
                  }
                }
              }));
            }
            break;
          case this.states.pause:
            icons.push(h('i', {
              'class': 'gk-icon-playarrow',
              on: {
                click() {
                  let {file, } = self.findFile(data.id);
                  self.uploader.upload(file);
                  data.state = self.states.progress;
                }
              }
            }));
            break;
          case this.states.progress:
            if(this.chunked) {
              icons.push(h('i', {
                'class': 'gk-icon-pause',
                on: {
                  click() {
                    self.uploader.stop(data.id);
                    data.state = self.states.pause;
                  }
                }
              }));
            }
            break;
          case this.states.cancel:
          case this.states.error:
            icons.push(h('i', {
              'class': 'gk-icon-redo',
              on: {
                click() {
                  let {file, } = self.findFile(data.id);
                  self.uploader.retry(file);
                  data.state = self.states.progress;
                }
              }
            }));
            break;
        }
        if ([this.states.pause, this.states.progress].indexOf(data.state) > -1) {
          icons.push(h('i', {
            'class': 'gk-icon-times',
            on: {
              click() {
                self.uploader.cancelFile(data.id);
                Object.assign(data, {
                  state: self.states.cancel,
                  percent: 0,
                  speed: 0
                })
              }
            }
          }));
        }
        return icons;
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
          chunked: this.chunked,
          auto: this.auto,
          swf: swgimg,
          server: this.server,
          pick: picker,
          formData: this.formData || {},
          dnd: this.dnd === undefined ? undefined : this.dnd ? this.dnd : '.gk-uploader',
          disableGlobalDnd: this.dnd
        }, this.options || {}));

        uploader.on('fileQueued', (file) => {
          this.list.push({
            id: file.id,
            name: file.name,
            size: file.size,
            state: this.states.ready,
            percent: 0,
            speed: 0
          });
          this.files.push(file);
          this.hidden = this.mini = false;
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
          let {fi, index} = this.findFile(file.id);
          this.list[index].state = this.states.success;
          this.finishFiles.push(file);
          this.$emit('success', file, response);
        });

        uploader.on('uploadError', (file, reason) => {
          let {fi, index} = this.findFile(file.id);
          this.list[index].state = this.states.error;
          this.errorList[index] = reason;
          this.$emit('error', file, reason);
        });

        uploader.on('error', type => {
          const desc = {
            F_EXCEED_SIZE: '文件大小超过限制',
            Q_EXCEED_NUM_LIMIT: '文件上传数超出限制'
          };
          this.$emit('error', null, type, desc);
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
      updateEmptyStyle() {
        let position = this.$refs.emptyContent.getBoundingClientRect();
        this.emptyContentStyle = {
          width: this.emptyContentWidth + 'px',
          'margin-left': -this.emptyContentWidth / 2 + 'px',
          'margin-top': -position.height / 2 + 'px'
        };
      },
      upload() {
        this.uploader.upload();
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