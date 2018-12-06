<template>
  <div class="gk-finder" :class="{'gk-mobile-finder': isMobile}">
    <slot name="header"></slot>
    <div class="gk-finder-toolbar">
      <gk-breadcrumb :data="navList" id="fullpath" @navigator="clickBreadcrumb" label="filename"
                     value="fullpath" :style="{'margin-right': opsWidth}"></gk-breadcrumb>

      <div ref="ops" class="gk-finder-show-ops" v-show="!preview">
        <slot name="breadcrumb"></slot>
        <gk-dropdown v-if="sortList" class="gk-finder-sort-block" @command="handleSort">
            <span class="gk-finder-sort-button">
              <i :class="this.order === 'asc' ? 'gk-icon-arrowsdownline' : 'gk-icon-long-arrow-down'" style="vertical-align: middle"></i>{{sortLabel}}<i class="gk-icon-Path" style="vertical-align: middle"></i>
            </span>
          <gk-dropdown-menu slot="dropdown" show-arrow>
            <gk-dropdown-item :icon="getSortIcon(sort.value)" v-for="(sort, idx) in sortList"
                              :command="sort" :key="idx">{{sort.label}}
            </gk-dropdown-item>
          </gk-dropdown-menu>
        </gk-dropdown>

        <gk-button-group plain  class="gk-finder-view-mode">
          <gk-button :border="false" v-for="(view,index) in viewList" size="mini" :key="index" :is-actived="viewMode === view"
                     @click.native="handleViewMode(view)" :icon="'gk-icon-'+view"></gk-button>
        </gk-button-group>
      </div>
    </div>

    <div class="gk-finder-content" :class="'gk-finder-view-' + viewMode">
      <gk-slide v-if="preview" fit toolbar :options="previewToolbar" id="fullpath" :list="fileList" v-model="previewFile">
        <template slot-scope="scope">
          <gk-iframe v-if="getPreviewUrl" :src="getPreviewUrl(scope.item)"></gk-iframe>
        </template>
      </gk-slide>

      <template v-else>
        <gk-thumbnail ref="table" shortcut scroll-on-check right-selected :checkbox="showCheckbox" fit
                      v-if="viewMode === 'listgrid'" :show-more="showMore" :more-text="moreText"
                      :loading="loading" :data="list"
                      :border="0" :default-index="selectedIndex" @load-more="loadMore" @select="selectItem"
                      @selectAll="selectAllItem" @check="checkItem" @checkAll="checkAllItem"
                      @doubleClick="doubleClickItem" @contextmenu="contextItem" @tap="doubleClickItem">
          <template slot-scope="scope">
            <p>
              <gk-fileicon :thumbnail="scope.row.thumbnail" :filename="scope.row.filename" :size="64"
                           :folder="!!scope.row.dir"></gk-fileicon>
            </p>
            <p class="gk-finder-filename" :title="scope.row.filename">{{scope.row.filename}}</p>
          </template>
          <div slot="empty" class="gk-finder-empty">
            <slot></slot>
          </div>
        </gk-thumbnail>
        <gk-table ref="table" shortcut fit scroll-on-check right-selected show-header :loading="loading"
                  :data="list"
                  :default-index="selectedIndex" :show-more="showMore" :more-text="moreText"
                  @load-more="loadMore" @select="selectItem" @doubleClick="doubleClickItem"
                  @selectAll="selectAllItem" @check="checkItem" @checkAll="checkAllItem"
                  @contextmenu="contextItem" @tap="doubleClickItem" v-else-if="viewMode === 'list'">
          <gk-table-column :checkbox="showCheckbox" :width="25" align="center"></gk-table-column>
          <gk-table-column property="filename" :label="gettext('filename')">
            <template slot-scope="scope">
              <div class="gk-finder-filename-column">
                <gk-fileicon :thumbnail="scope.row.thumbnail" :filename="scope.row.filename" :size="20"
                             :folder="!!scope.row.dir"></gk-fileicon>
                <p>{{scope.row.filename}}</p>
              </div>
            </template>
          </gk-table-column>
          <gk-table-column property="last_dateline" :label="gettext('last_dateline')" :formatter="formatDate"
                           :width="180"></gk-table-column>
          <gk-table-column property="filesize" :label="gettext('size')" :formatter="formatSize"
                           :width="80"></gk-table-column>
          <gk-table-column width="10%"></gk-table-column>
          <div slot="empty" class="gk-finder-empty">
            <slot></slot>
          </div>
        </gk-table>
        <gk-table ref="table" shortcut fit scroll-on-check right-selected :loading="loading" :data="list"
                  @select="selectItem" @selectAll="selectAllItem" @check="checkItem" @checkAll="checkAllItem"
                  @doubleClick="doubleClickItem" @tap="doubleClickItem" @contextmenu="contextItem" :default-index="selectedIndex"
                  :more-text="moreText" :show-more="showMore" @load-more="loadMore" v-else>
          <gk-table-column :width="25" :checkbox="showCheckbox" align="center"></gk-table-column>
          <gk-table-column :width="40" valign="top">
            <template slot-scope="scope">
              <gk-fileicon :thumbnail="scope.row.thumbnail" :filename="scope.row.filename" :size="32"
                           :folder="!!scope.row.dir"></gk-fileicon>
            </template>
          </gk-table-column>
          <gk-table-column property="filename" :label="gettext('filename')">
            <template slot-scope="scope">
              <div class="gk-finder-main-column">
                <div class="gk-finder-filename-column">
                  <p>{{scope.row.filename}}</p>
                  <p>
                    <span>{{scope.row.last_member_name}}</span>
                    <span>{{formatDate(scope.row.last_dateline)}}</span>
                    <span v-if="scope.row.filesize">{{formatSize(scope.row.filesize, scope.row)}}</span>
                  </p>
                </div>
                <ul v-if="!isMobile && itemButtons">
                  <li v-for="(button,index) in itemButtons" :key="index" @click="handleItemButton(button.command, scope.row, scope.index, $event)">{{button.label}}</li>
                  <li v-if="buttons" @click="handleItemButton('more', scope.row, scope.index, $event)">{{gettext('more')}}</li>
                </ul>
              </div>
            </template>
          </gk-table-column>
          <gk-table-column width="8%" v-if="isMobile && (buttons || itemButtons)" >
            <template slot-scope="scope">
              <i class="gk-icon-caretdown gk-finder-item-dropdown" v-touch:tap="($event) => handleItemDropdown(scope.row, scope.index, $event)"></i>
            </template>
          </gk-table-column>
          <div slot="empty" class="gk-finder-empty">
            <slot></slot>
          </div>
        </gk-table>
      </template>
    </div>

    <gk-menu ref="contextmenu" v-if="buttons" :data="buttons" @command="commandFile"></gk-menu>

    <slot name="footer"></slot>
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
  import touch from 'gokuai-components/packages/touch/src/touch';
  import {timeToDate, bitSize, baseName, dirName} from "gokuai-components/src/common/util";
  import { device } from 'device.js';

  const GkIframe = {
    props: {
      src: String
    },
    watch: {
      src: 'updateIframe'
    },
    render(h) {
      return h('div', {
        style: {
          position: 'relative',
          width: '100%',
          height: '100%'
        }
      });
    },
    methods: {
      updateIframe() {
        this.$el.innerHTML = '<iframe src="' + this.src + '"></iframe>';
      }
    },
    mounted() {
      this.updateIframe();
    }
  };

  export default {
    name: 'GkFinder',
    components: {
      GkCheckbox, GkDropdown, GkDropdownMenu, GkDropdownItem, GkMenuItem, GkMenu, GkSubmenu, GkSlide, GkThumbnail,
      GkTableColumn, GkTable, GkButtonGroup, GkButton, GkBreadcrumb, GkFileicon, GkIframe
    },
    directives: {touch},
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
      'item-buttons': Array,
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
        sortLabel: '文件名',
        order: order || '',
        preview: false,
        previewFile: this.value,
        navList: this.initNavs(this.value),
        selectedIndex: [],
        fileList: [],
        opsWidth: '150px'
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
      },
      isMobile() {
        return device.mobile || device.tablet;
      },
      showCheckbox() {
        return !this.isMobile && this.checkbox
      },
      itemButtonsDom() {
        if (!this.isMobile || !this.itemButtons) {
          return false;
        }
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.setAttribute('colspan', 4);
        let ul = document.createElement('ul');
        ul.classList.add('gk-finder-item-buttons');
        this.itemButtons.map((button) => {
          let li = document.createElement('li');
          li.innerText = button.label;
          li.addEventListener('click', () => {
            this.$emit('command', this.getSelected(), button.command);
          });
          ul.appendChild(li);
        });
        if (this.buttons) {
          let li = document.createElement('li');
          li.innerHTML = '<i class="gk-icon-ellipsisv"></i>' + this.gettext('more');
          li.addEventListener('click', (event) => {
            this.contextItem(this.getSelected(), event);
          });
          ul.appendChild(li);
        }
        td.appendChild(ul);
        tr.appendChild(td);
        return tr;
      }
    },
    methods: {
      gettext(value) {
        return this.translate && this.translate[value] || value;
      },
      showMobileMenuItem(targetElement) {
        if (!this.itemButtonsDom) {
          return;
        }
        const parent = targetElement.parentNode;
        if (parent.lastChild === targetElement) {
          parent.appendChild(this.itemButtonsDom);
        }
        else {
          parent.insertBefore(this.itemButtonsDom, targetElement.nextSibling);
        }
      },
      hideMobileMenuItem() {
        if (!this.itemButtonsDom) {
          return;
        }
        const openButtons = this.$el.querySelector('.gk-icon-caretup');
        if (openButtons) {
          openButtons.classList.remove('gk-icon-caretup');
        }
        this.itemButtonsDom.remove();
      },
      handleItemDropdown(file, index, event) {
        this.$refs.table.select(file, index);
        if (this.itemButtons) {
          if (event.target.className.indexOf('gk-icon-caretup') > -1) {
            this.hideMobileMenuItem();
          } else {
            this.hideMobileMenuItem();
            event.target.classList.add('gk-icon-caretup');
            this.showMobileMenuItem(event.target.parentNode.parentNode);
          }
        } else {
          this.contextItem([file], event);
        }
      },
      handleItemButton(command, file, index, event) {
        if (command === 'more') {
          this.$refs.table.select(file, index);
          this.contextItem([file], event);
        } else {
          this.$emit('command', [file], command);
        }
      },
      getSortIcon(key) {
        let icon = '';
        if (key === this.sort) {
          icon = this.order === 'asc' ? 'gk-icon-arrowsdownline' : 'gk-icon-long-arrow-down';
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
      doubleClickItem(file, event) {
        if (event.target.className.indexOf('gk-finder-item-dropdown') > -1) {
          return;
        }
        if (this.beforeEnter && this.beforeEnter(file, event) === false) {
          return;
        }
        this.navList.push(file);
        this.$emit('input', file);
        this.$emit('enter', file);
        this.openFile(file);
      },
      contextItem(files, event) {
        if (!this.buttons || !this.buttons.length) {
          return;
        }
        if (this.beforeContextmenu && this.beforeContextmenu(files, event) === false) {
          return;
        }
        this.$refs.contextmenu.show(event);
        event.stopPropagation();
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
         if (this.sort === command.value) {
         this.order = this.order === 'desc' ? 'asc' : 'desc';
        }
        this.sort = command.value;
        this.sortLabel = command.label;
        this.$emit('sort-change', this.sort, this.order);
      },
      changeFile(file) {
        this.updateNavs(file);
        this.$emit('input', file);
      },
      openFile(file) {
        this.hideMobileMenuItem();
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
        return this.$refs.table ? this.$refs.table.getSelected() : [];
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