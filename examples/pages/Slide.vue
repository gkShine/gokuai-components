<template>
    <div class="container">
        <h3 class="demo-title">
            单文件幻灯片
        </h3>
        <div class="demo-block" style="height: 400px;">
            <gk-slide fit v-if="images.length" v-model="images[2]"></gk-slide>
        </div>
        <h3 class="demo-title">
            多文件幻灯片
        </h3>
        <div class="demo-block" style="height: 400px;">
            <gk-slide fit v-if="images.length" :list="images" toolbar v-model="images[1]"></gk-slide>
        </div>
        <h3 class="demo-title">
            图文幻灯片
        </h3>
        <div class="demo-block" style="height: 400px;">
            <gk-slide fit v-if="data.length" :list="data" toolbar >
                <template slot-scope="props">
                    <div class="item">
                        <h4>{{props.item.name}}</h4>
                        <p>
                            <img :src="props.item.pic" >
                        </p>
                    </div>
                </template>
            </gk-slide>
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
          this.images.push(dat.pic);
        });
      });
    }
  }
</script>

<style scoped lang="scss">
    .item {
        text-align: center;

        h4 {
            background: #2b2d32;
            line-height: 40px;
            color: #fff;
            margin: 0;
        }
        p {
            margin: 0;
            height: 320px;
            width: 100%;
            position: relative;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            img {
                max-height: 320px;
                max-width: 100%;
            }
        }
    }
</style>