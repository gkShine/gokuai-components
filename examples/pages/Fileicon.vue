<template>
  <div class="container">
    <h3 class="demo-title">
      文件图标
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-fileicon size="256" filename="file.png"></gk-fileicon>
      <gk-fileicon size="128" filename="file.png"></gk-fileicon>
      <gk-fileicon size="64" filename="file.png"></gk-fileicon>
      <gk-fileicon size="32" filename="file.png"></gk-fileicon>
      <gk-fileicon size="24" filename="file.png"></gk-fileicon>
      <gk-fileicon size="16" filename="file.png"></gk-fileicon>
    </div>
    <h3 class="demo-title">
      文件类型
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-fileicon size="64" filename="file.png"></gk-fileicon>
      <gk-fileicon size="64" filename="file.mp4"></gk-fileicon>
      <gk-fileicon size="64" filename="file.mp3"></gk-fileicon>
      <gk-fileicon size="64" filename="file.php"></gk-fileicon>
      <gk-fileicon size="64" filename="file.html"></gk-fileicon>
      <gk-fileicon size="64" filename="file.js"></gk-fileicon>
      <gk-fileicon size="64" filename="file.txt"></gk-fileicon>
      <gk-fileicon size="64" filename="file.rar"></gk-fileicon>
      <gk-fileicon size="64" filename="file.exe"></gk-fileicon>
      <gk-fileicon size="64" filename="file.ai"></gk-fileicon>
      <gk-fileicon size="64" filename="file.apk"></gk-fileicon>
      <gk-fileicon size="64" filename="file.cdr"></gk-fileicon>
      <gk-fileicon size="64" filename="file.dmg"></gk-fileicon>
      <gk-fileicon size="64" filename="file.md"></gk-fileicon>
      <gk-fileicon size="64" filename="file.psd"></gk-fileicon>
      <gk-fileicon size="64" filename="file.ipa"></gk-fileicon>
      <gk-fileicon size="64" filename="file.gnode"></gk-fileicon>
      <gk-fileicon size="64" filename="file.doc"></gk-fileicon>
      <gk-fileicon size="64" filename="file.xls"></gk-fileicon>
      <gk-fileicon size="64" filename="file.ppt"></gk-fileicon>
      <gk-fileicon size="64" filename="file.udf"></gk-fileicon>
      <gk-fileicon size="64" type="lock"></gk-fileicon>
    </div>
    <h3 class="demo-title">
      文件夹类型
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-fileicon size="64" :folder="true"></gk-fileicon>
      <gk-fileicon size="64" :folder="true" type="share"></gk-fileicon>
      <gk-fileicon size="64" :folder="true" type="cache"></gk-fileicon>
      <gk-fileicon size="64" :folder="true" type="download"></gk-fileicon>
      <gk-fileicon size="64" :folder="true" type="lock"></gk-fileicon>
      <gk-fileicon size="64" :folder="true" type="sync"></gk-fileicon>
      <gk-fileicon size="64" :folder="true" type="upload"></gk-fileicon>
      <gk-fileicon size="64" :folder="true" type="collection-public"></gk-fileicon>
      <gk-fileicon size="64" :folder="true" type="collection-private"></gk-fileicon>
    </div>
    <h3 class="demo-title">
      文件缩略图
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-fileicon size="256" filename="file.png"
                   thumbnail="http://pic.58pic.com/58pic/14/91/48/58Q58PICM3d_1024.jpg"></gk-fileicon>
      <gk-fileicon size="128" filename="file.png"
                   thumbnail="http://pic.58pic.com/58pic/14/91/48/58Q58PICM3d_1024.jpg"></gk-fileicon>
      <gk-fileicon size="64" filename="file.png" thumbnail="http://pic.com/sssss.jpg"></gk-fileicon>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="scss">
  .demo-block {
    & > * {
      margin: 5px;
    }
  }
</style>