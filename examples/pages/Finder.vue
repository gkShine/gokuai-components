<template>
    <div>
        <gk-finder v-model="selectedFile" :current="openFile" :root="file" :list="fileList" :loading="loading" ></gk-finder>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        selectedFile: {},
        openFile: {},
        file: {},
        root: {},
        fileList: [],
        loading: false
      }
    }
  }
</script>

<style scoped>

</style>