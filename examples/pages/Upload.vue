<template>
    <div class="container">
        <h3 class="demo-title">
            文件上传
        </h3>
        <div class="demo-block">
            <div class="demo-toolbar">
                <gk-uploader-buttons :buttons-text="buttons"></gk-uploader-buttons>
            </div>
            <gk-uploader server="https://jsonplaceholder.typicode.com/posts" :auto="false"></gk-uploader>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Upload",
    data() {
      return {
        buttons: {
          file: '上传文件',
          folder: '上传文件夹',
          delete: '删除'
        }
      }
    }
  }
</script>