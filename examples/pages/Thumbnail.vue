<template>
    <div class="container">
        <h3 class="demo-title">
            基础缩略图
        </h3>
        <div class="demo-block" style="height: 600px">
            <gk-thumbnail fit :data="images" :size="{w: 136, h: 136}"></gk-thumbnail>
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