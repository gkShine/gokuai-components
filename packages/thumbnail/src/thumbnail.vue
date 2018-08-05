<template>
    <ul class="gk-thumbnail">
        <gk-thumbnail-item
                v-for="(dat, idx) in data"
                :key="idx"
                :data="dat"
                :render="$scopedSlots.default"
                :property="property"
                :size="size"
        ></gk-thumbnail-item>
    </ul>
</template>

<script>
  import GkThumbnailItem from "./thumbnail-item.js";

  export default {
    name: "GkThumbnail",
    components: {GkThumbnailItem},
    props: {
      data: Array,
      property: String,
      size: Object
    }
  }
</script>