<template>
    <img :class="sizeCls" v-if="showThumbnail" :src="thumbnail" @error="showThumb = false" />
    <i v-else :class="[sizeCls, typeCls]"></i>
</template>

<script>
  import {getExt} from 'gokuai-components/src/common/util';

  export default {
    name: "GkFileicon",
    props: {
      folder: Boolean,
      type: String,
      thumbnail: String,
      filename: String,
      size: {
        type: Number,
        default: 32
      }
    },
    data() {
      return {
        showThumbnail: !!this.thumbnail
      }
    },
    computed: {
      sizeCls() {
        return 'gk-fileicon-' + this.size;
      },
      typeCls() {
        if (this.folder) {
          return 'gk-fileicon-' + (this.type ? this.type + '-folder' : 'folder');
        } else {
          return 'gk-fileicon-' + (this.type || getExt(this.filename));
        }
      }
    }
  }
</script>