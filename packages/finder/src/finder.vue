<template>
    <div class="gk-finder">
        <div class="gk-finder-toolbar">
            <gk-breadcrumb :data="navList" show-nav @navigator="clickBreadcrumb" label="filename" value="fullpath"></gk-breadcrumb>

            <div class="gk-finder-show-ops" v-show="!preview">
                <gk-dropdown v-if="sortList" style="display: inline-block" @command="handleSort">
                    <gk-button icon="fa fa-sort" class="gk-finder-sort-button"></gk-button>
                    <gk-dropdown-menu slot="dropdown" show-arrow>
                        <gk-dropdown-item :icon="getSortIcon(sort.value)" v-for="(sort, idx) in sortList" :command="sort.value" :key="idx">{{sort.label}}</gk-dropdown-item>
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
                <gk-thumbnail ref="table" fit v-if="viewMode === 'thumbnail'" :loading="loading" :data="list" :border="0" :default-index="selectedIndex"
                              @select="selectItem" @dblclick="dblclickItem" @contextmenu="rightClickItem" >
                    <template slot-scope="props">
                        <p>
                            <img :src="props.thumb + '&size=128'" width="128" height="128"/>
                        </p>
                        <p>{{props.filename}}</p>
                    </template>
                </gk-thumbnail>
                <gk-table ref="table" fit :loading="loading" show-checkbox show-header :data="list" :itemHeight="itemHeight"
                          :default-index="selectedIndex" @select="selectItem" @dblclick="dblclickItem" @contextmenu="rightClickItem" v-else-if="viewMode === 'list'">
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
                                     :width="80"></gk-table-column>
                    <gk-table-column width="20%"></gk-table-column>
                </gk-table>
                <gk-table ref="table" fit :loading="loading" :data="list" :itemHeight="itemHeight + 20" @select="selectItem"
                          @dblclick="dblclickItem" @contextmenu="rightClickItem" :default-index="selectedIndex" v-else>
                    <gk-table-column :width="30"></gk-table-column>
                    <gk-table-column property="filename" label="文件名" sortable>
                        <template slot-scope="props">
                            <div class="gk-finder-filename">
                                <img :src="props.thumb + '&size=32'" height="32"/>
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
                    <gk-table-column width="20%"></gk-table-column>
                </gk-table>
            </template>

            <gk-slide v-if="preview" fit toolbar :options="previewToolbar" :list="fileList" v-model="selected" id="fullpath">
                <template slot-scope="props">
                    <iframe v-if="props.item.previewUrl" v-bind:src="props.item.previewUrl"></iframe>
                </template>
            </gk-slide>
        </div>

        <gk-menu ref="contextmenu">
            <gk-menu-item icon="fa fa-user" >保存</gk-menu-item>
            <gk-menu-item disabled>最后修改</gk-menu-item>
            <gk-menu-item>大小</gk-menu-item>
            <gk-menu-item>
                <span>刺激菜单</span>
                <gk-submenu>
                    <gk-menu-item>大小</gk-menu-item>
                    <gk-menu-item>大小2</gk-menu-item>
                    <gk-menu-item>大小2</gk-menu-item>
                    <gk-menu-item keymap="shift+s">
                        大小2
                        <gk-submenu>
                            <gk-menu-item>大小</gk-menu-item>
                            <gk-menu-item>大小2</gk-menu-item>
                            <gk-menu-item>大小2</gk-menu-item>
                            <gk-menu-item>
                                大小2
                            </gk-menu-item>
                        </gk-submenu>
                    </gk-menu-item>
                </gk-submenu>
            </gk-menu-item>
        </gk-menu>
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
  import GkMenu from "../../menu/src/menu";
  import GkMenuItem from "../../menu/src/menu-item";
  import GkDropdown from "../../dropdown/src/dropdown";
  import GkDropdownItem from "../../dropdown/src/dropdown-item.js";
  import GkDropdownMenu from "../../dropdown/src/dropdown-menu.js";
  import GkSubmenu from "../../menu/src/submenu.js";
  import GkCheckbox from "../../checkbox/src/checkbox";

  export default {
    name: 'GkFinder',
    components: {
      GkCheckbox, GkDropdown, GkDropdownMenu, GkDropdownItem, GkMenuItem, GkMenu, GkSubmenu, GkSlide, GkThumbnail,
      GkTableColumn, GkTable, GkButtonGroup, GkButton, GkBreadcrumb},
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
      'sort-list': Array,
      'default-sort': {
        type: String,
        default: ''
      },
      loading: Boolean,
      previewToolbar: Object
    },
    data() {
      let [sort, order] = this.defaultSort.split(' ');
      return {
        viewMode: 'default',
        sort: sort || '',
        order: order || '',
        selected: {},
        preview: false,
        navList: this.initNavs(),
        selectedIndex: [],
        fileList: []
      };
    },
    watch: {
      list: 'loadSuccess',
      current: 'changeFile'
    },
    methods: {
      getSortIcon(key) {
        let icon = '';
        if (key === this.sort) {
            icon = 'fa ' + (this.order === 'asc' ? 'fa-long-arrow-up' : 'fa-long-arrow-down');
        }
        return icon;
      },
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
        this.selectedIndex = this.$refs.table.getSelectedIndex();
        this.viewMode = mode;
      },
      selectItem(file, index) {
        this.selected = file;
        this.$emit('input', file);
      },
      dblclickItem(file, index) {
        this.selected = file;
        this.navList.push(file);
        this.$emit('enter', file, index);
        if (!file.dir) {
          this.showPreview();
        }
      },
      rightClickItem(file, index, event) {
        this.$refs.contextmenu.show(event);
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
      handleSort(command) {
        if (this.sort === command) {
            this.order = this.order === 'desc' ? 'asc' : 'desc';
        }
        this.sort = command;
        this.$emit('sort-change', this.sort, this.order);
      },
      changeFile() {
        if (this.current.dir) {
          this.preview = false;
        }
      }
    }
  }
</script>