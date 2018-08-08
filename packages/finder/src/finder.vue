<template>
    <div class="gk-finder">
        <div class="gk-finder-toolbar">
            <gk-breadcrumb :show-nav="false" :data="navData" @navigator="clickBreadcrumb" label="filename" value="fullpath"></gk-breadcrumb>

            <div class="gk-finder-show-ops">
                <gk-button icon="fa fa-sort" class="gk-finder-sort-button"></gk-button>
                <gk-button-group plain class="gk-finder-view-mode">
                    <gk-button
                            :class="{'gk-button-active' : viewMode === 'default'}"
                            @click.native="handleViewMode('default')" icon="gk-icon-listdetail"></gk-button>
                    <gk-button
                            :class="{'gk-button-active' : viewMode === 'list'}"
                            @click.native="handleViewMode('list')" icon="gk-icon-list"></gk-button>
                    <gk-button
                            :class="{'gk-button-active' : viewMode === 'thumbnail'}"
                            @click.native="handleViewMode('thumbnail')" icon="gk-icon-listgrid"></gk-button>
                </gk-button-group>
            </div>
        </div>

        <div class="gk-finder-content" :class="'gk-finder-view-' + viewMode">
            <gk-thumbnail fit v-if="viewMode == 'thumbnail'" :loading="loading" :data="jsonData" :border="0" :selectedIndex="selectedIdx"
                          @select="selectItem" @dblclick="dblclickItem">
                <template slot-scope="props">
                    <p>
                        <img :src="props.thumb + '&size=128'"/>
                    </p>
                    <p>{{props.filename}}</p>
                </template>
            </gk-thumbnail>
            <gk-table fit :loading="loading" show-checkbox show-header :data="jsonData" :selectedIndex="selectedIdx" :itemHeight="itemHeight"
                      @select="selectItem" @dblclick="dblclickItem" v-else-if="viewMode === 'list'">
                <gk-table-column checkbox :width="30" align="center"></gk-table-column>
                <gk-table-column property="filename" label="文件名" sortable>
                    <template slot-scope="props">
                        <div class="gk-finder-filename">
                            <img :src="props.thumb + '&size=32'" height="16"/>{{props.filename}}
                        </div>
                    </template>
                </gk-table-column>
                <gk-table-column property="last_dateline" label="最后修改" :formatter="formatDate" sortable
                                 :width="180"></gk-table-column>
                <gk-table-column property="filesize" label="大小" :formatter="formatSize" sortable
                                 :width="100"></gk-table-column>
                <gk-table-column :width="200"></gk-table-column>
            </gk-table>
            <gk-table fit :loading="loading" :data="jsonData" :itemHeight="itemHeight + 20" :selectedIndex="selectedIdx" @select="selectItem"
                      @dblclick="dblclickItem" v-else>
                <gk-table-column :width="30"></gk-table-column>
                <gk-table-column property="filename" label="文件名" sortable>
                    <template slot-scope="props">
                        <div class="gk-finder-filename">
                            <img :src="props.thumb + '&size=32'"/>
                            <div>
                                <p>{{props.filename}}</p>
                                <p>
                                    <span>{{props.last_member_name}}</span>
                                    <span>{{formatDate(props.last_dateline)}}</span>
                                    <span v-if="props.filesize">{{formatSize(props.filesize, props)}}</span>
                                </p>
                            </div>
                        </div>
                    </template>
                </gk-table-column>
                <gk-table-column :width="200"></gk-table-column>
            </gk-table>
        </div>
    </div>
</template>

<script>
  import GkBreadcrumb from "../../breadcrumb/src/breadcrumb";
  import GkButton from "../../button/src/button";
  import GkButtonGroup from "../../button/src/button-group";
  import GkTable from "../../table/src/table";
  import GkTableColumn from "../../table/src/table-column";
  import {timeToDate, bitSize} from "../../../src/common/util";
  import GkThumbnail from "../../thumbnail/src/thumbnail";

  export default {
    name: 'GkFinder',
    components: {GkThumbnail, GkTableColumn, GkTable, GkButtonGroup, GkButton, GkBreadcrumb},
    props: {
      'json-data': {
        type: Array,
        required: true
      },
      'item-height': {
        type: Number,
        default: 42
      },
      'nav-data': {
        type: Array
      },
      loading: Boolean
    },
    data() {
      return {
        viewMode: 'default',
        selected: {},
        selectedIdx: -1
      };
    },
    methods: {
      formatDate(value) {
        return timeToDate(value * 1000);
      },
      formatSize(value, item) {
        return item.dir ? '-' : bitSize(value);
      },
      handleViewMode(mode) {
        this.viewMode = mode;
      },
      selectItem(data, index) {
        this.selected = data;
        this.selectedIdx = index;
        this.$emit('select', data, index);
      },
      dblclickItem(data, index) {
        this.selected = data;
        this.selectedIdx = index;
        this.$emit('dblclick', data, index);
      },
      clickBreadcrumb(value, data, index) {
        this.$emit('navigator', value, data, index);
      }
    }
  }
</script>