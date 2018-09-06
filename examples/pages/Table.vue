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
            <gk-table :data="data" show-header>
                <gk-table-column :width="30" checkbox></gk-table-column>
                <gk-table-column property="id"></gk-table-column>
                <gk-table-column property="name"></gk-table-column>
                <gk-table-column property="username"></gk-table-column>
                <gk-table-column property="date"></gk-table-column>
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
    mounted() {
      getData({size: 20}).then(data => {
        this.data = data;
      });
    }
  }
</script>

<style scoped>

</style>