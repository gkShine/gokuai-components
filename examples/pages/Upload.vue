<template>
    <div class="container">
        <h3 class="demo-title">
            文件上传
        </h3>
        <div class="demo-block" style="width: 800px">
            <div class="demo-toolbar">
                <gk-uploader-buttons :buttons="autoButtons" dropdown>上传</gk-uploader-buttons>
            </div>
            <gk-uploader dnd :buttons="autoButtons" style="height: 400px" ref="uploader" :form-data="{code: '3k5adph3', fullpath: ''}" server="http://yunku.goukuai.test/index/test_upload" headTpl="已选择:d个" fit >
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
                <gk-uploader-buttons :buttons="buttons"></gk-uploader-buttons>
                <gk-button @click.native="startUpload">开始上传</gk-button>
            </div>
            <gk-uploader :buttons="buttons" style="height: 600px" ref="uploader" server="http://yunku.goukuai.test/index/test_upload" headTpl="已选择:d个" fit :auto="false">
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
  export default {
    name: "Upload",
    data() {
      return {
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
        buttons: [
          {
            class: 'gk-uploader-delete',
            type: 'delete',
            label: '删除'
          },
          {
            class: 'gk-uploader-file',
            type: 'file',
            label: '上传文件'
          },
          {
            class: 'gk-uploader-folder',
            type: 'folder',
            label: '上传文件夹',
          }
        ]
      }
    },
    methods: {
      startUpload() {
        this.$refs.uploader.upload();
      }
    }
  }
</script>