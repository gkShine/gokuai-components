<template>
    <div class="gk-finder-list">
        <div class="gk-finder-toolbar">
            <gk-breadcrumb :show-nav="true" :data="breadcrumbs"></gk-breadcrumb>

            <div class="gk-finder-show-ops">
                <gk-button icon="fa fa-sort" class="gk-finder-sort-button"></gk-button>
                <gk-button-group plain class="gk-finder-view-mode">
                    <gk-button
                            :class="{'gk-button-active' : viewMode === 'default'}"
                            @click="handleViewMode('default')" icon="gk-icon-listdetail"></gk-button>
                    <gk-button
                            :class="{'gk-button-active' : viewMode === 'list'}"
                            @click="handleViewMode('list')" icon="gk-icon-list"></gk-button>
                    <gk-button
                            :class="{'gk-button-active' : viewMode === 'thumbnail'}"
                            @click="handleViewMode('thumbnail')" icon="gk-icon-listgrid"></gk-button>
                </gk-button-group>
            </div>
        </div>

        <gk-table show-header :data="jsonData" :itemHeight="itemHeight">
            <gk-table-column checkbox :width="40" align="center"></gk-table-column>
            <gk-table-column property="filename" label="文件名" sortable></gk-table-column>
            <gk-table-column property="last_dateline" label="最后修改" :formatter="formatDate" sortable
                             :width="180"></gk-table-column>
            <gk-table-column property="filesize" label="大小" :formatter="formatSize" sortable :width="100"></gk-table-column>
            <gk-table-column :width="200"></gk-table-column>
        </gk-table>
    </div>
</template>

<script>
  import GkBreadcrumb from "../../breadcrumb/src/breadcrumb";
  import GkButton from "../../button/src/button";
  import GkButtonGroup from "../../button/src/button-group";
  import GkTable from "../../table/src/table";
  import GkTableColumn from "../../table/src/table-column";
  import {timeToDate, bitSize} from "../../../src/common/util";

  export default {
    name: 'GkFinder',
    components: {GkTableColumn, GkTable, GkButtonGroup, GkButton, GkBreadcrumb},
    props: {
      jsonData: {
        type: Object,
        required: true
      },
      itemHeight: {
        type: Number,
        default: 36
      }
    },
    data() {
      return {
        viewMode: 'default',
        selectItem: [],
        breadcrumbs: [
          {
            label: '库成员列表',
            path: ''
          },
          {
            label: '深圳腾讯科技部',
            path: ''
          },
          {
            label: '科技研发部门一',
            path: ''
          },
          {
            label: '张小丰的个人信息',
            path: ''
          }
        ]
      };
    },
    methods: {
      formatDate(value) {
        return timeToDate(value * 1000);
      },
      formatSize(value){
        return bitSize(value);
      },
      handleViewMode(mode) {
        this.viewMode = mode;
      }
    }
  }
</script>