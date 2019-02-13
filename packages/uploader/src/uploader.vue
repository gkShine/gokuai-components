<template>
  <section ref="uploader" class="gk-uploader"
           :class="{'gk-uploader-dialog': dialog, 'gk-uploader-fit': fit, 'gk-mobile-uploader': isMobile}"
           :style="{display: hidden ? 'none' : 'block'}">
    <div class="gk-uploader-head" v-if="dialog">
      <h2>{{dialogTitle()}}</h2>
      <div><i :class="'gk-icon-window-' + (mini ? 'maximize': 'minimize')" @click="mini = !mini"></i><i
          class="gk-icon-times" @click="hidden=true"></i></div>
    </div>
    <div class="gk-uploader-body">
      <gk-table :fit="fit || dialog" ref="table" :data="list" :show-header="showCheck" :show-checkbox="showCheck"
                :height="height"
                @check="updateHeadLabel" :before-select="() => false">
        <gk-table-column :checkbox="showCheck" :width="25" align="center"></gk-table-column>
        <gk-table-column property="name" :label="headLabel">
          <template slot-scope="scope">
            <div class="gk-uploader-filename-column" :title="scope.row.name">
              <gk-fileicon :filename="scope.row.name" :size="24"></gk-fileicon>
              {{scope.row.name}}
            </div>
          </template>
        </gk-table-column>
        <gk-table-column property="size" :width="80" align="center" :formatter="formatSize"></gk-table-column>
        <gk-table-column property="percent" :width="140" align="center" :formatter="formatState"></gk-table-column>
        <gk-table-column property="state" :formatter="formatOption" align="center" class="gk-uploader-options"
                         :width="40"></gk-table-column>
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
  import "mdn-polyfills/NodeList.prototype.forEach";
  import WebUploader from 'webuploader';
  import swgimg from 'webuploader/dist/Uploader.swf';
  import GkTable from "gokuai-components/packages/table/src/table";
  import GkTableColumn from "gokuai-components/packages/table/src/table-column";
  import GkFileicon from "gokuai-components/packages/fileicon/src/fileicon";
  import { isIE, bitSize } from "gokuai-components/src/common/util";
  import touch from "gokuai-components/packages/touch/src/touch";

  export default {
    name: "GkUploader",
    components: { GkTable, GkTableColumn, GkFileicon },
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
      formData: Object,
      buttons: Array,
      options: Object,
      fit: Boolean,
      dnd: String,
      chunked: Boolean,
      dialog: Boolean,
      translate: Object,
      hideDelete: Boolean,
      beforeCheck: Function,
      checkResponse: Function
    },
    data () {
      return {
        mini: true,
        hidden: this.dialog,
        headLabel: this.headTpl.replace(':d', 0),
        list: [],
        relation: {},
        finishFiles: [],
        uploader: false,
        deleteButtons: [],
        emptyContentStyle: {}
      }
    },
    computed: {
      isMobile () {
        return touch.device.mobile;
      },
      showCheck () {
        return !this.auto;
      },
      buttonList () {
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
      defaultButtons () {
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
      states () {
        return {
          ready: 'ready',
          pause: 'pause',
          cancel: 'cancel',
          progress: 'progress',
          success: 'success',
          uploadError: 'uploadError',
          error: 'error'
        }
      }
    },
    watch: {
      mini: 'changeMini',
      list: 'changeList',
      finishFiles: 'checkFinish',
      formData: {
        handler: 'updateData',
        deep: true
      }
    },
    methods: {
      gettext (value) {
        return this.translate && this.translate[value] || value;
      },
      dialogTitle () {
        if (this.finishFiles.length === this.list.length) {
          return this.gettext('Upload Finish');
        }
        return this.gettext('Uploading (:n/:t)').replace(':n', this.finishFiles.length).replace(':t', this.list.length);
      },
      changeMini () {
        this.$refs.uploader.style.height = this.mini ? 'auto' : this.height + 'px';
      },
      changeList () {
        if (this.hideDelete) {
          this.deleteButtons.forEach((button) => {
            button.style.display = this.list.length ? 'inline-block' : 'none'
          });
        }
        this.updateHeadLabel();
      },
      checkFinish () {
        if (this.finishFiles.length === this.list.length) {
          this.$emit('finish');
          if (this.dialog) {
            this.mini = true;
          }
        }
      },
      updateData (data) {
        this.uploader.option('formData', data);
      },
      formatSize (value) {
        return bitSize(value);
      },
      formatState (value, data) {
        let stateText = '';
        switch (data.state) {
          case this.states.ready:
            stateText = this.auto ? this.gettext('ready') : '';
            break;
          case this.states.pause:
            stateText = this.gettext('paused');
            break;
          case this.states.success:
            stateText = this.gettext('successful');
            break;
          case this.states.cancel:
            stateText = this.gettext('canceled');
            break;
          case this.states.uploadError:
          case this.states.error:
            let file = this.uploader.getFile(data.id);
            stateText = file.statusText;
            break;
        }
        if (stateText) {
          return this.$createElement('span', {
            'class': 'uploader-state-' + data.state
          }, stateText);
        }
        if (data.percent > 0) {
          return `${(data.percent * 100).toFixed(2)}%(${bitSize(data.speed, true)}/s)`;
        }
        return '';
      },
      formatOption (value, data) {
        let h = this.$createElement;
        let self = this;
        let icons = [];
        switch (data.state) {
          case this.states.ready:
          case this.states.error:
            if (!this.auto) {
              icons.push(h('i', {
                'class': 'gk-icon-times',
                on: {
                  click () {
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
                click () {
                  let file = self.uploader.getFile(data.id);
                  self.uploader.upload(file);
                  data.state = self.states.progress;
                }
              }
            }));
            break;
          case this.states.progress:
            if (this.chunked) {
              icons.push(h('i', {
                'class': 'gk-icon-pause',
                on: {
                  click () {
                    self.uploader.stop(data.id);
                    data.state = self.states.pause;
                  }
                }
              }));
            }
            break;
          case this.states.cancel:
          case this.states.uploadError:
            icons.push(h('i', {
              'class': 'gk-icon-redo',
              on: {
                click () {
                  let file = self.uploader.getFile(data.id);
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
              click () {
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
      updateHeadLabel () {
        setTimeout(() => {
          this.headLabel = this.headTpl.replace(':d', this.$refs.table.getCheckedIndex().length);
        }, 20);
      },
      findList (id) {
        return this.list[this.relation[id]];
      },
      removeFile (id) {
        let file = this.uploader.getFile(id);
        this.uploader.removeFile(file);

        let index = this.relation[id];
        this.list.splice(index, 1);
        delete this.relation[id];

        //更新关联
        for (let i = index; i < this.list.length; i++) {
          this.relation[this.list[i].id] = i;
        }
      },
      webUpload (picker) {
        let button = document.querySelector(picker.id);
        button && button.addEventListener('mouseenter', () => {
          this.uploader.refresh();
        });
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
          duplicate: true,
          formData: this.formData || {},
          dnd: this.dnd === undefined ? undefined : this.dnd ? this.dnd : '.gk-uploader',
          disableGlobalDnd: this.dnd,
          timeout: 0
        }, this.options || {}));

        uploader.on('fileQueued', (file) => {
          let result = this.beforeCheck ? this.beforeCheck(file) : true;
          this.list.push({
            id: file.id,
            name: file.name,
            path: file.source.source.webkitRelativePath || file.name,
            state: result === true ? this.states.ready : this.states.error,
            size: file.size,
            percent: 0,
            speed: 0
          });
          this.relation[file.id] = this.list.length - 1;
          this.hidden = false;
          if (this.dialog) {
            this.mini = false;
          }
          if (result !== true) {
            this.finishFiles.push(file);
            file.setStatus('invalid', result);
          }
          this.$emit('before', file);
        });

        uploader.on('uploadProgress', (file, percent) => {
          let item = this.findList(file.id);
          let timestamp = new Date().getTime();
          let diffSecond = (timestamp - (item.timestamp || timestamp - 1000)) / 1000;
          let diffSize = (percent - item.percent) * item.size;
          Object.assign(item, {
            state: this.states.progress,
            percent: percent,
            timestamp: timestamp,
            speed: diffSize / diffSecond
          });
          this.$emit('progress', file, percent);
        });

        uploader.on('uploadBeforeSend', (object, data) => {
          let item = this.findList(object.file.id);
          data.path = item.path.substring(0, item.path.lastIndexOf(data.name) - 1);
        });

        uploader.on('uploadSuccess', (file, response) => {
          let item = this.findList(file.id);
          let result = this.checkResponse ? this.checkResponse(file, response) : true;
          if (result === true) {
            item.state = this.states.success;
          } else {
            item.state = this.states.uploadError;
            file.setStatus('error', result);
          }
          this.finishFiles.push(file);
          this.$emit('success', file, response);
        });

        uploader.on('uploadError', (file, reason) => {
          let item = this.findList(file.id);
          item.state = this.states.uploadError;
          file.setStatus('error', reason);
          this.$emit('uploadError', file, reason);
        });

        uploader.on('error', type => {
          const desc = {
            F_EXCEED_SIZE: '文件大小超过限制',
            Q_EXCEED_NUM_LIMIT: '文件上传数超出限制'
          };
          this.$emit('error', null, type, desc);
        });

        uploader.on('uploadComplete', (file, response) => {
          this.$emit('complete', file, response);
        });

        this.uploader = uploader;
        return uploader;
      },
      initDelete (selector) {
        this.deleteButtons = document.querySelectorAll(selector);
        this.deleteButtons.forEach((button) => {
          this.hideDelete && (button.style.display = 'none');
          button.onclick = () => {
            let checked = this.$refs.table.getChecked();
            checked.forEach(file => {
              this.removeFile(file.id);
            });
          };
        });
      },
      updateEmptyStyle () {
        let position = this.$refs.emptyContent.getBoundingClientRect();
        if (this.emptyContentWidth > window.innerWidth) {
          this.emptyContentStyle = {
            width: '96%',
            'margin-left': '-48%',
            'margin-top': '-24%'
          };
        } else {
          this.emptyContentStyle = {
            width: this.emptyContentWidth + 'px',
            'margin-left': -this.emptyContentWidth / 2 + 'px',
            'margin-top': -position.height / 2 + 'px'
          };
        }
      },
      upload () {
        this.uploader.upload();
      }
    },
    mounted () {
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
                  for (let i = 0; i < inputs.length; i++) {
                    inputs[i].setAttribute('webkitdirectory', '');
                  }
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
