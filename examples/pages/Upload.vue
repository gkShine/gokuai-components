<template>
    <div class="container">
        <h3 class="demo-title">
            文件上传
        </h3>
        <div class="demo-block" style="width: 800px">
            <div class="demo-toolbar">
                <gk-uploader-buttons :buttons="autoButtons" dropdown>上传</gk-uploader-buttons>
            </div>
            <gk-uploader dnd :buttons="autoButtons" style="height: 400px" ref="uploader" server="http://yunku.goukuai.test/index/test_upload" headTpl="已选择:d个" fit >
                <h3>可直接拖拽文件到这里上传，最大文件不超过1GB</h3>
                <div>
                    <h4>温馨提示:</h4>
                    <ul>
                        <li>1.支持IE10以上或极速浏览器</li>
                        <li>2.严格遵守法律法规，严禁在互联网上存储，处理，传输，发布泄密信息</li>
                    </ul>
                </div>
            </gk-uploader>
        </div>
        <h3 class="demo-title">
            文件手动上传
        </h3>
        <div class="demo-block" style="width: 1024px">
            <div class="demo-toolbar">
                <gk-uploader-buttons :translate="translate"></gk-uploader-buttons>
                <gk-button @click.native="startUpload">开始上传</gk-button>
            </div>
            <gk-uploader :before-check="checkSize" style="height: 600px" ref="uploader" server="http://yunku.goukuai.test/index/test_upload" headTpl="已选择:d个" fit :auto="false" :form-data="formData">
                <div>
                    <h4>温馨提示:</h4>
                    <ul>
                        <li>1.支持IE10以上或极速浏览器</li>
                        <li>2.严格遵守法律法规，严禁在互联网上存储，处理，传输，发布泄密信息</li>
                    </ul>
                </div>
            </gk-uploader>
        </div>
        <h3 class="demo-title">
            弹出式上传
        </h3>
        <div class="demo-block" style="width: 1024px; height: 660px">
            <div class="demo-toolbar">
                <gk-button-group>
                    <gk-uploader-buttons :buttons="dialogButtons" dropdown>上传</gk-uploader-buttons>
                    <gk-button>下载</gk-button>
                </gk-button-group>
            </div>
            <gk-table :data="list" :height="600" class="file-list">
                <gk-table-column width="40"></gk-table-column>
                <gk-table-column property="name" label="文件名"></gk-table-column>
                <gk-table-column property="size" width="120" :formatter="formatSize" label="文件大小"></gk-table-column>
                <div slot="empty" class="gk-uploader-empty">
                    <div class="gk-uploader-empty-content" style="margin-left: -234px; margin-top: -71px;">
                        <h3>可直接拖拽文件到这里上传，最大文件不超过1GB</h3>
                        <div>
                            <h4>温馨提示:</h4>
                            <ul>
                                <li>1.支持IE10以上或极速浏览器</li>
                                <li>2.严格遵守法律法规，严禁在互联网上存储，处理，传输，发布泄密信息</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </gk-table>
            <gk-uploader :before-check="checkSize" :buttons="dialogButtons" :translate="translate" dnd=".file-list" dialog style="width: 600px;right: 20px;bottom: 0" server="http://yunku.goukuai.test/index/test_upload" headTpl="已选择:d个" :height="400" @success="uploadSuccess">
                <div>
                    <h4>温馨提示:</h4>
                    <ul>
                        <li>1.支持IE10以上或极速浏览器</li>
                        <li>2.严格遵守法律法规，严禁在互联网上存储，处理，传输，发布泄密信息</li>
                    </ul>
                </div>
            </gk-uploader>
        </div>
    </div>
</template>

<script>
    import {bitSize} from "../../src/common/util";

    export default {
    name: "Upload",
    data() {
      return {
        list: [],
        formData: {
          code: ''
        },
        autoButtons: [
          {
            class: 'auto-gk-uploader-file',
            type: 'file',
            label: '上传文件'
          },
          {
            class: 'auto-gk-uploader-folder',
            type: 'folder',
            label: '上传文件夹',
          }
        ],
        dialogButtons: [
          {
            class: 'dialog-gk-uploader-file',
            type: 'file',
            label: '上传文件'
          },
          {
            class: 'dialog-gk-uploader-folder',
            type: 'folder',
            label: '上传文件夹',
          }
        ],
        translate: {
          'delete': '删除',
          'upload file': '上传文件',
          'upload folder': '上传文件夹',
          'Upload Finish': '上传完成',
          'Uploading (:n/:t)': '上传中(:n/:t)'
        }
      }
    },
    methods: {
      checkSize({size}, error) {
        if (size > 2090774) {
          return '超出大小[401]';
        }
        return true;
      },
      formatSize(value, item) {
        return bitSize(value);
      },
      startUpload() {
        this.$refs.uploader.upload();
      },
      uploadSuccess(file) {
        this.list.push({
          name: file.name,
          size: file.size
        })
      }
    }
  }
</script>