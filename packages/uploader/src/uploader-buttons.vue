<template>
    <div class="gk-uploader-buttons">
        <gk-button class="gk-uploader-delete">{{buttons.delete}}</gk-button>
        <gk-button type="html" class="gk-file-uploader">{{buttons.file}}</gk-button>
        <gk-button type="html" class="gk-folder-uploader" v-if="!isIE">{{buttons.folder}}</gk-button>
    </div>
</template>

<script>
  import GkButton from "gokuai-components/packages/button/src/button";
  import {isIE} from "gokuai-components/src/common/util";

  export default {
    name: "GkUploaderButtons",
    components: {GkButton},
    props: {
      'buttons-text': Object
    },
    computed: {
      isIE() {
        return isIE();
      },
      buttons() {
        return Object.assign({
          delete: 'delete',
          file: 'upload files',
          folder: 'upload folder'
        }, this.buttonsText || {});
      }
    }
  }
</script>