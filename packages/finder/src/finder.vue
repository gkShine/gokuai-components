<template>
    <div class="gk-finder">
        <div class="gk-finder-toolbar">
            <gk-breadcrumb :show-nav="false" :data="navList" @navigator="clickBreadcrumb" label="filename" value="fullpath"></gk-breadcrumb>

            <div class="gk-finder-show-ops" v-show="!preview">
                <gk-dropdown style="display: inline-block">
                    <gk-button icon="fa fa-sort" class="gk-finder-sort-button"></gk-button>
                    <gk-dropdown-menu slot="dropdown">
                        <gk-dropdown-item icon="fa fa-user">filename</gk-dropdown-item>
                        <gk-dropdown-item divided>最后修改</gk-dropdown-item>
                        <gk-dropdown-item>大小</gk-dropdown-item>
                    </gk-dropdown-menu>
                </gk-dropdown>

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
            <template v-show="!preview">
                <gk-thumbnail fit v-if="viewMode === 'thumbnail'" :loading="loading" :data="list" :border="0" :selectedIndex="selectedIndex"
                              @select="selectItem" @dblclick="dblclickItem">
                    <template slot-scope="props">
                        <p>
                            <img :src="props.thumb + '&size=128'"/>
                        </p>
                        <p>{{props.filename}}</p>
                    </template>
                </gk-thumbnail>
                <gk-table fit :loading="loading" show-checkbox show-header :data="list" :selectedIndex="selectedIndex" :itemHeight="itemHeight"
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
                <gk-table fit :loading="loading" :data="list" :itemHeight="itemHeight + 20" :selectedIndex="selectedIndex" @select="selectItem"
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
            </template>

            <gk-slide v-if="preview" fit toolbar :options="previewToolbar" :list="fileList" v-model="selected" id="fullpath">
                <template slot-scope="props">
                    <iframe v-if="props.item.previewUrl" v-bind:src="props.item.previewUrl"></iframe>
                </template>
            </gk-slide>
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
  import GkSlide from "../../slide/src/slide";
  import GkDropdown from "../../dropdown/src/dropdown";
  import GkDropdownItem from "../../dropdown/src/dropdown-item";
  import GkDropdownMenu from "../../dropdown/src/dropdown-menu.js";

  export default {
    name: 'GkFinder',
    components: {
      GkDropdownItem,
      GkDropdownMenu,
      GkDropdown, GkSlide, GkThumbnail, GkTableColumn, GkTable, GkButtonGroup, GkButton, GkBreadcrumb},
    props: {
      list: { //当前文件列表
        type: Array,
        required: true
      },
      value: { //选中文件/文件夹
        type: Object|null,
        required: true
      },
      current: Object, //当前打开文件/文件夹
      root: Object, //根文件夹或库
      'item-height': {
        type: Number,
        default: 42
      },
      loading: Boolean,
      previewToolbar: Object
    },
    data() {
      return {
        viewMode: 'default',
        selected: {},
        preview: false,
        navList: this.initNavs(),
        selectedIndex: -1,
        fileList: []
      };
    },
    watch: {
      list: 'loadSuccess',
      current: 'changeFile'
    },
    methods: {
      initNavs() {
        let navs = [], path = '', fullpath = '';
        this.root && navs.push(this.root);
        if (this.current && this.current.fullpath) {
          fullpath += this.current.fullpath + '/';
        }
        for (let i = 0; i < fullpath.length; i++) {
          if (fullpath[i] === '/') {
            navs.push({
              filename: path.substring(path.lastIndexOf('/'), path.length),
              fullpath: fullpath.substr(0, fullpath.length - 1)
            });
          }
          path += fullpath[i];
        }
        return navs;
      },
      formatDate(value) {
        return timeToDate(value * 1000);
      },
      formatSize(value, item) {
        return item.dir ? '-' : bitSize(value);
      },
      handleViewMode(mode) {
        this.viewMode = mode;
      },
      selectItem(file, index) {
        this.selected = file;
        this.selectedIndex = index;
        this.$emit('input', file);
      },
      dblclickItem(file, index) {
        this.selected = file;
        this.selectedIndex = index;
        this.navList.push(file);
        this.$emit('enter', file, index);
        if (!file.dir) {
          this.showPreview();
        }
      },
      clickBreadcrumb(value, file, index) {
        this.navList = this.navList.slice(0, index + 1);
        this.selectItem(null, -1);
        this.$emit('navigator', value, file);
      },
      showPreview() {
        this.preview = true;
      },
      loadSuccess() {
        this.fileList = [];
        this.list.forEach((file)=> {
          if (!file.dir) {
            this.fileList.push(file);
          }
        });
        this.preview = false;
      },
      changeFile() {
        if (this.current.dir) {
          this.preview = false;
        }
      }
    }
  }
</script>