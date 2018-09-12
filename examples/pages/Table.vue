<template>
    <div class="container">
        <h3 class="demo-title">
            基础表格
        </h3>
        <div class="demo-block">
            <gk-table :data="data">
                <gk-table-column :width="10"></gk-table-column>
                <gk-table-column property="id"></gk-table-column>
                <gk-table-column property="name"></gk-table-column>
                <gk-table-column property="username"></gk-table-column>
                <gk-table-column property="date"></gk-table-column>
            </gk-table>
        </div>
        <h3 class="demo-title">
            含有选择框表格
        </h3>
        <div class="demo-block">
            <gk-table :data="data" show-header @sort-by="handleSort">
                <gk-table-column :width="30" checkbox></gk-table-column>
                <gk-table-column :width="100" property="id" label="#"></gk-table-column>
                <gk-table-column property="name" label="标题" sortable="desc"></gk-table-column>
                <gk-table-column :width="150" property="username" label="名字"></gk-table-column>
                <gk-table-column :width="200" property="date" sortable label="时间"></gk-table-column>
            </gk-table>
        </div>
    </div>
</template>

<script>
  import {getData} from "../api";

  export default {
    data() {
      return {
        data: []
      }
    },
    methods: {
      handleSort(column, order) {
        console.log(column, order);
      }
    },
    mounted() {
      getData({size: 20}).then(data => {
        this.data = data;
      });
    }
  }
</script>

<style scoped>

</style>