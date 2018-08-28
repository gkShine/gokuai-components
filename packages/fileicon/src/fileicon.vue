<template>
    <i :class="[sizeCls, typeCls]"></i>
</template>

<script>
  import {getExt} from 'gokuai-components/src/common/util';

  export default {
    name: "GkFileicon",
    props: {
      folder: Boolean,
      type: {
        type: String,
        default: ''
      },
      filename: String,
      size: {
        type: Number,
        default: 32
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