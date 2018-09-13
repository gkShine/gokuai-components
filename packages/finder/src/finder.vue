<template>
    <div class="gk-finder">
        <div class="gk-finder-toolbar">
            <gk-breadcrumb :data="navList" id="fullpath" @navigator="clickBreadcrumb" label="filename"
                           value="fullpath" :style="{'margin-right': opsWidth}"></gk-breadcrumb>

            <div ref="ops" class="gk-finder-show-ops" v-show="!preview">
                <slot name="breadcrumb"></slot>
                <gk-dropdown v-if="sortList" style="display: inline-block" @command="handleSort">
                    <gk-button icon="gk-icon-sort" class="gk-finder-sort-button" plain></gk-button>
                    <gk-dropdown-menu slot="dropdown" show-arrow>
                        <gk-dropdown-item :icon="getSortIcon(sort.value)" v-for="(sort, idx) in sortList"
                                          :command="sort.value" :key="idx">{{sort.label}}
                        </gk-dropdown-item>
                    </gk-dropdown-menu>
                </gk-dropdown>

                <gk-button-group plain class="gk-finder-view-mode">
                    <gk-button v-for="(view,index) in viewList" size="mini" :key="index" :is-actived="viewMode === view"
                               @click.native="handleViewMode(view)" :icon="'gk-icon-'+view"></gk-button>
                </gk-button-group>
            </div>
        </div>

        <div class="gk-finder-content" :class="'gk-finder-view-' + viewMode">
            <template v-show="!preview">
                <gk-thumbnail ref="table" shortcut scroll-on-check right-selected :checkbox="checkbox" fit
                              v-if="viewMode === 'listgrid'"
                              :loading="loading" :data="list"
                              :border="0" :default-index="selectedIndex" @load-more="loadMore" @select="selectItem"
                              @selectAll="selectAllItem" @check="checkItem" @checkAll="checkAllItem"
                              @dblclick="dblclickItem" @contextmenu="rightClickItem">
                    <template slot-scope="props">
                        <p>
                            <gk-fileicon :thumbnail="props.thumbnail" :filename="props.filename" :size="128"
                                         :folder="!!props.dir"></gk-fileicon>
                        </p>
                        <p class="gk-finder-filename">{{props.filename}}</p>
                    </template>
                </gk-thumbnail>
                <gk-table ref="table" shortcut fit scroll-on-check right-selected show-header :loading="loading"
                          :data="list"
                          :item-height="itemHeight"
                          :default-index="selectedIndex" :show-more="showMore" :more-text="moreText"
                          @load-more="loadMore" @select="selectItem" @dblclick="dblclickItem"
                          @selectAll="selectAllItem" @check="checkItem" @checkAll="checkAllItem"
                          @contextmenu="rightClickItem" v-else-if="viewMode === 'list'">
                    <gk-table-column :checkbox="checkbox" :width="25" align="center"></gk-table-column>
                    <gk-table-column property="filename" :label="gettext('filename')">
                        <template slot-scope="props">
                            <div class="gk-finder-filename-column">
                                <gk-fileicon :thumbnail="props.thumbnail" :filename="props.filename" :size="20"
                                             :folder="!!props.dir"></gk-fileicon>
                                {{props.filename}}
                            </div>
                        </template>
                    </gk-table-column>
                    <gk-table-column property="last_dateline" :label="gettext('last_dateline')" :formatter="formatDate"
                                     :width="180"></gk-table-column>
                    <gk-table-column property="filesize" :label="gettext('size')" :formatter="formatSize"
                                     :width="80"></gk-table-column>
                    <gk-table-column width="10%"></gk-table-column>
                </gk-table>
                <gk-table ref="table" shortcut fit scroll-on-check context-selected :loading="loading" :data="list"
                          :item-height="itemHeight + 20"
                          @select="selectItem" @selectAll="selectAllItem" @check="checkItem" @checkAll="checkAllItem"
                          @dblclick="dblclickItem" @contextmenu="rightClickItem" :default-index="selectedIndex"
                          :more-text="moreText" :show-more="showMore" @load-more="loadMore" v-else>
                    <gk-table-column :width="25" :checkbox="checkbox" align="center"></gk-table-column>
                    <gk-table-column property="filename" :label="gettext('filename')">
                        <template slot-scope="props">
                            <div class="gk-finder-filename-column">
                                <gk-fileicon :thumbnail="props.thumbnail" :filename="props.filename" :size="32"
                                             :folder="!!props.dir"></gk-fileicon>
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

            <gk-slide v-if="preview" fit toolbar :options="previewToolbar" :list="fileList" v-model="previewFile">
                <template slot-scope="props">
                    <iframe v-if="getPreviewUrl" v-bind:src="getPreviewUrl(props.item)"></iframe>
                </template>
            </gk-slide>
        </div>

        <gk-menu ref="contextmenu" v-if="buttons" :data="buttons" @command="commandFile"></gk-menu>
    </div>
</template>

<script>
  import GkBreadcrumb from "gokuai-components/packages/breadcrumb/src/breadcrumb";
  import GkButton from "gokuai-components/packages/button/src/button";
  import GkButtonGroup from "gokuai-components/packages/button/src/button-group";
  import GkTable from "gokuai-components/packages/table/src/table";
  import GkTableColumn from "gokuai-components/packages/table/src/table-column";
  import GkThumbnail from "gokuai-components/packages/thumbnail/src/thumbnail";
  import GkSlide from "gokuai-components/packages/slide/src/slide";
  import GkMenu from "gokuai-components/packages/menu/src/menu";
  import GkMenuItem from "gokuai-components/packages/menu/src/menu-item";
  import GkDropdown from "gokuai-components/packages/dropdown/src/dropdown";
  import GkDropdownItem from "gokuai-components/packages/dropdown/src/dropdown-item";
  import GkDropdownMenu from "gokuai-components/packages/dropdown/src/dropdown-menu";
  import GkSubmenu from "gokuai-components/packages/menu/src/submenu";
  import GkCheckbox from "gokuai-components/packages/checkbox/src/checkbox";
  import GkFileicon from "gokuai-components/packages/fileicon/src/fileicon";
  import {timeToDate, bitSize, baseName, dirName} from "gokuai-components/src/common/util";

  export default {
    name: 'GkFinder',
    components: {
      GkCheckbox, GkDropdown, GkDropdownMenu, GkDropdownItem, GkMenuItem, GkMenu, GkSubmenu, GkSlide, GkThumbnail,
      GkTableColumn, GkTable, GkButtonGroup, GkButton, GkBreadcrumb, GkFileicon
    },
    props: {
      list: { //当前文件列表
        type: Array,
        required: true
      },
      value: { //当前打开文件/文件夹
        type: Object | null,
        required: true
      },
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
      'show-more': Boolean,
      'more-text': String,
      checkbox: Boolean,
      total: Number,
      buttons: Array,
      loading: Boolean,
      'preview-toolbar': Object,
      translate: Object,
      'get-preview-url': Function,
      'before-enter': Function,
      'before-contextmenu': Function,
      views: Array
    },
    data() {
      let [sort, order] = this.defaultSort.split(' ');
      return {
        viewMode: this.views && this.views[0] || 'listdetail',
        sort: sort || '',
        order: order || '',
        preview: false,
        previewFile: this.value,
        navList: this.initNavs(this.value),
        selectedIndex: [],
        fileList: [],
        opsWidth: '150px',
      };
    },
    watch: {
      list: 'loadSuccess',
      value: 'openFile',
      previewFile: 'changeFile'
    },
    computed: {
      viewList() {
        let views = ['listdetail', 'list', 'listgrid'];
        if (this.views instanceof Array) {
          return views.filter(v => this.views.includes(v));
        }
        return views;
      }
    },
    methods: {
      gettext(value) {
        return this.translate && this.translate[value] || value;
      },
      getSortIcon(key) {
        let icon = '';
        if (key === this.sort) {
          icon = this.order === 'asc' ? 'gk-icon-longarrowup' : 'gk-icon-longarrowdown';
        }
        return icon;
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
        this.$refs.table.checked = {};
      },
      selectItem(files, event) {
        this.$emit('select', files, event);
      },
      selectAllItem(event) {
        this.$emit('selectAll', event);
      },
      checkItem(files, event) {
        this.$emit('check', files, event);
      },
      checkAllItem(event) {
        this.$emit('checkAll', event);
      },
      dblclickItem(file) {
        if (this.beforeEnter && this.beforeEnter(file, event) === false) {
          return;
        }
        this.navList.push(file);
        this.$emit('input', file);
        this.$emit('enter', file);
        this.openFile(file);
      },
      rightClickItem(files, event) {
        if (!this.buttons || !this.buttons.length) {
          return;
        }
        if (this.beforeContextmenu && this.beforeContextmenu(files, event) === false) {
          return;
        }
        this.$refs.contextmenu.show(event);
      },
      commandFile(command) {
        this.$emit('command', this.getSelected(), command);
      },
      clickBreadcrumb(value, file, index) {
        this.navList = this.navList.slice(0, index + 1);
        this.selectItem(null, -1);
        this.$emit('input', file);
        this.$emit('navigator', value, file);
      },
      loadSuccess() {
        this.fileList = [];
        this.list.forEach((file) => {
          if (!file.dir) {
            this.fileList.push(file);
          }
        });
        this.preview = false;
      },
      loadMore() {
        if (this.list.length === this.total) {
          return;
        }
        this.$emit('load-more', this.value);
      },
      handleSort(command) {
        if (this.sort === command) {
          this.order = this.order === 'desc' ? 'asc' : 'desc';
        }
        this.sort = command;
        this.$emit('sort-change', this.sort, this.order);
      },
      changeFile(file) {
        this.updateNavs(file);
        this.$emit('input', file);
      },
      openFile(file) {
        if (!file.dir) {
          this.previewFile = file;
          this.preview = true;
        } else {
          this.preview = false;
        }
      },
      initNavs(file) {
        let navs = [];

        if (file && file.fullpath) {
          navs.unshift(file);
          let fullpath = dirName(file.fullpath);
          while (fullpath) {
            navs.unshift({
              filename: baseName(fullpath),
              fullpath: fullpath,
              dir: 1
            });
            fullpath = dirName(fullpath);
          }
        }

        Object.keys(this.root).length && navs.unshift(this.root);
        return navs;
      },
      updateNavs(file) {
        let navs = this.initNavs(file);
        navs.forEach((nav, index) => {
          if (this.navList[index] && nav.fullpath === this.navList[index].fullpath) {
            navs[index] = this.navList[index]
          }
        });
        this.navList = navs;
      },
      getSelected() {
        return this.$refs.table.getSelected();
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.opsWidth = this.$refs.ops.clientWidth + 'px';
      });
      if (this.value && Object.keys(this.value).length) {
        this.openFile(this.value);
      }
    }
  }
</script>