<template>
  <div class="container">
    <h3 class="demo-title">
      基础缩略图
    </h3>
    <div class="demo-block" style="height: 600px" >
      <gk-thumbnail ref="thumbnail" fit adaptive :data="images" :size-scope="[128, 192, 256, 320]"></gk-thumbnail>

      <gk-button-group>
        <gk-button @click.native="$refs.thumbnail.zoom('in')">放大</gk-button>
        <gk-button @click.native="$refs.thumbnail.zoom('out')">缩小</gk-button>
        <gk-button @click.native="$refs.thumbnail.zoom(128)">设置为128</gk-button>
      </gk-button-group>
    </div>
    <h3 class="demo-title">
      含有选择框
    </h3>
    <div class="demo-block" style="height: 600px">
      <gk-thumbnail fit :data="images" :size="{w: 136, h: 136}" show-checkbox checkbox></gk-thumbnail>
    </div>
  </div>
</template>

<script>
  import {getData} from "../api";

  export default {
    data() {
      return {
        data: [],
        images: []
      }
    },
    mounted() {
      getData({size: 20}).then(data => {
        this.data = data;
        data.forEach(dat => {
          this.images.push(dat.pic)
        });
      });
    }
  }
</script>

<style scoped>

</style>