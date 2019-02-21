<template>
  <div class="gk-finder" :class="{'gk-mobile-finder': isMobile, 'gk-ie-finder': isIE}">
    <slot name="header"></slot>
    <div class="gk-finder-toolbar">
      <gk-breadcrumb ref="breadcrumb" :data="navList" id="fullpath" :allow-input="allowInput"
                     @navigator="handleNavigator" label="filename"
                     value="fullpath" :style="{'margin-right': opsWidth}"></gk-breadcrumb>

      <div ref="ops" class="gk-finder-show-ops">
        <slot name="breadcrumb"></slot>
        <gk-dropdown v-if="sortList" v-show="!preview" class="gk-finder-sort-block" @command="handleSort">
          <span class="gk-finder-sort-button">
            <gk-icon :icon="order === 'asc' ? 'long-arrow-up' : 'long-arrow-down'"/>{{sort.label}}<gk-icon
              icon="caretdown" placement="right"/>
          </span>
          <gk-dropdown-menu slot="dropdown" show-arrow>
            <gk-dropdown-item :icon="getSortIcon(sort.value)" v-for="(sort, idx) in sortList"
                              :command="sort" :key="idx">{{sort.label}}
            </gk-dropdown-item>
          </gk-dropdown-menu>
        </gk-dropdown>

        <gk-button-group plain class="gk-finder-view-mode" v-show="!preview">
          <gk-button :border="false" v-for="(view,index) in viewList" size="mini" :key="index"
                     :is-active="viewMode === view"
                     @click.native="handleViewMode(view)" :icon="'gk-icon-'+view" class="gk-special-button"></gk-button>
        </gk-button-group>
      </div>
    </div>

    <div class="gk-finder-content" :class="'gk-finder-view-' + viewMode">
      <gk-slide v-if="preview" fit toolbar :options="previewToolbar" id="fullpath" :list="fileList"
                v-model="previewFile" @change="handleSlideChange">
        <template slot-scope="scope">
          <gk-iframe v-if="getPreviewUrl" :src="getPreviewUrl(scope.item)"></gk-iframe>
        </template>
      </gk-slide>

      <template v-else>
        <gk-thumbnail ref="table"
                      shortcut
                      scroll-on-check
                      right-selected
                      :checkbox="showCheckbox"
                      fit
                      v-if="viewMode === 'listgrid'"
                      :show-more="showMore"
                      :more-text="moreText"
                      :loading="loading"
                      loading-class="gk-content-loading"
                      :data="list"
                      :border="false"
                      :default-index="selectedIndex"
                      :translate="translate"
                      :size-scope="[128, 192, 256, 320]"
                      @load-more="handleLoadMore"
                      @tap="handleDoubleClick"
                      @select="handleSelect"
                      @selectAll="handleSelectAll"
                      @check="handleCheck"
                      @checkAll="handleCheckAll"
                      @doubleClick="handleDoubleClick"
                      @contextmenu="handleContextmenu">
          <template slot-scope="scope">
            <p>
              <gk-fileicon :thumbnail="scope.row.thumbnail" :filename="scope.row.filename" :size="scope.size/2"
                           :folder="!!scope.row.dir"></gk-fileicon>
            </p>
            <p class="gk-finder-filename" :title="scope.row.filename">
              <span>{{scope.row.filename}}</span>
            </p>
          </template>
          <div slot="empty" class="gk-finder-empty">
            <slot></slot>
          </div>
        </gk-thumbnail>
        <gk-table ref="table"
                  shortcut
                  fit
                  scroll-on-check
                  right-selected
                  show-header
                  :loading="loading"
                  loading-class="gk-content-loading"
                  :data="list"
                  :default-index="selectedIndex"
                  :show-more="showMore"
                  :more-text="moreText"
                  @load-more="handleLoadMore"
                  @tap="handleDoubleClick"
                  @select="handleSelect"
                  @selectAll="handleSelectAll"
                  @check="handleCheck"
                  @checkAll="handleCheckAll"
                  @doubleClick="handleDoubleClick"
                  @contextmenu="handleContextmenu"
                  v-else-if="viewMode === 'list'">
          <gk-table-column :checkbox="showCheckbox" :width="25" align="center"></gk-table-column>
          <gk-table-column property="filename" :label="gettext('filename')">
            <template slot-scope="scope">
              <div class="gk-finder-filename-column">
                <p>
                  <gk-fileicon :thumbnail="scope.row.thumbnail" :filename="scope.row.filename" :size="20"
                               :folder="!!scope.row.dir"></gk-fileicon>
                </p>
                <p>{{scope.row.filename}}</p>
              </div>
            </template>
          </gk-table-column>
          <gk-table-column property="last_dateline" :label="gettext('last_dateline')" :formatter="formatDate"
                           width="20%"></gk-table-column>
          <gk-table-column property="filesize" :label="gettext('size')" :formatter="formatSize"
                           width="8%"></gk-table-column>
          <gk-table-column width="5%"></gk-table-column>
          <div slot="empty" class="gk-finder-empty">
            <slot></slot>
          </div>
        </gk-table>
        <gk-table ref="table"
                  shortcut
                  fit
                  scroll-on-check
                  right-selected
                  :loading="loading"
                  loading-class="gk-content-loading"
                  :data="list"
                  :default-index="selectedIndex"
                  :more-text="moreText"
                  :show-more="showMore"
                  @tap="handleDoubleClick"
                  @select="handleSelect"
                  @selectAll="handleSelectAll"
                  @check="handleCheck"
                  @checkAll="handleCheckAll"
                  @doubleClick="handleDoubleClick"
                  @contextmenu="handleContextmenu"
                  @load-more="handleLoadMore"
                  v-else-if="viewMode === 'listdetail'">
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
                  <li v-for="(button,index) in itemButtons" :key="index"
                      @click="handleItemButton(button.command, scope.row, scope.index, $event)">{{button.label}}
                  </li>
                  <li v-if="buttons" @click="handleItemButton('more', scope.row, scope.index, $event)">
                    {{gettext('more')}}
                  </li>
                </ul>
              </div>
            </template>
          </gk-table-column>
          <gk-table-column width="8%" v-if="isMobile && (buttons || itemButtons)">
            <template slot-scope="scope">
              <i class="gk-icon-caretdown gk-finder-item-dropdown"
                 v-touch:tap="($event) => handleItemDropdown(scope.row, scope.index, $event.srcEvent)"></i>
            </template>
          </gk-table-column>
          <div slot="empty" class="gk-finder-empty">
            <slot></slot>
          </div>
        </gk-table>
      </template>
    </div>

    <gk-menu ref="contextmenu" v-if="contextMenus" :data="contextMenus" @command="handleCommand"></gk-menu>

    <slot name="footer"></slot>
  </div>
</template>

<script>
  import _ from "lodash";
  import GkBreadcrumb from "gokuai-components/packages/breadcrumb/src/breadcrumb";
  import GkButton from "gokuai-components/packages/button/src/button";
  import GkButtonGroup from "gokuai-components/packages/button/src/button-group";
  import GkTable from "gokuai-components/packages/table/src/table";
  import GkTableColumn from "gokuai-components/packages/table/src/table-column";
  import GkThumbnail from "gokuai-components/packages/thumbnail/src/thumbnail";
  import GkSlide from "gokuai-components/packages/slide/src/slide";
  import GkMenu from "gokuai-components/packages/menu/src/menu";
  import GkDropdown from "gokuai-components/packages/dropdown/src/dropdown";
  import GkDropdownItem from "gokuai-components/packages/dropdown/src/dropdown-item";
  import GkDropdownMenu from "gokuai-components/packages/dropdown/src/dropdown-menu";
  import GkFileicon from "gokuai-components/packages/fileicon/src/fileicon";
  import touch from 'gokuai-components/packages/touch/src/touch';
  import { timeToDate, bitSize, baseName, dirName, isIE } from "gokuai-components/src/common/util";

  const GkIframe = {
    props: {
      src: String
    },
    watch: {
      src: 'updateIframe'
    },
    render (h) {
      return h('div', {
        style: {
          position: 'relative',
          width: '100%',
          height: '100%'
        }
      });
    },
    methods: {
      updateIframe () {
        this.$el.innerHTML = '<iframe src="' + this.src + '"></iframe>';
      }
    },
    mounted () {
      this.updateIframe();
    }
  };

  export default {
    name: 'GkFinder',
    components: {
      GkDropdown, GkDropdownMenu, GkDropdownItem, GkMenu, GkSlide, GkThumbnail,
      GkTableColumn, GkTable, GkButtonGroup, GkButton, GkBreadcrumb, GkFileicon, GkIframe
    },
    directives: { touch },
    props: {
      list: { //当前文件列表
        type: Array,
        required: true
      },
      value: { //当前打开文件/文件夹
        type: [Object, null],
        required: true
      },
      root: Object, //根文件夹或库
      sortList: Array,
      defaultSort: {
        type: String,
        default: ''
      },
      allowInput: {
        type: Boolean,
        default: true
      },
      showMore: Boolean,
      moreText: String,
      checkbox: Boolean,
      total: Number,
      buttons: Array,
      itemButtons: Array,
      loading: Boolean,
      previewToolbar: Object,
      translate: Object,
      getPreviewUrl: Function,
      beforeEnter: Function,
      beforeContextmenu: Function,
      views: Array
    },
    data () {
      let [sort, order] = this.defaultSort.split(' ');
      return {
        isIE: !!isIE(),
        viewMode: this.views && this.views[0] || 'listdetail',
        sort: _.find(this.sortList, {value: sort}) || {},
        order: order || '',
        preview: false,
        previewFile: this.value,
        navList: this.initNavs(this.value),
        selectedIndex: [],
        fileList: [],
        contextMenus: [],
        opsWidth: '150px'
      };
    },
    watch: {
      list: 'loadSuccess',
      value: 'openFile'
    },
    computed: {
      viewList () {
        let views = ['listdetail', 'list', 'listgrid'];
        if (this.views instanceof Array) {
          return views.filter(v => this.views.includes(v));
        }
        return views;
      },
      isMobile () {
        return touch.enable;
      },
      showCheckbox () {
        return !this.isMobile && this.checkbox
      },
      itemButtonsDom () {
        if (!this.isMobile || !this.itemButtons) {
          return false;
        }
        let tr = document.createElement('tr');
        tr.classList.add('gk-table-item-toolbar');
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
            this.handleContextmenu(this.getSelected(), event);
          });
          ul.appendChild(li);
        }
        td.appendChild(ul);
        tr.appendChild(td);
        return tr;
      }
    },
    methods: {
      gettext (value) {
        return this.translate && this.translate[value] || value;
      },
      getContextMenus (files) {
        let getMenus = (buttons) => {
          let menus = [];
          buttons.map((button) => {
            if (button.before && button.before(files) === false) {
              return;
            }
            let menu = button;
            if (button.children) {
              menu.children = getMenus(button.children);
            }
            menus.push(menu);
          });
          return menus;
        };
        this.contextMenus = getMenus(this.buttons);
      },
      getSortIcon (key) {
        let icon = '';
        if (key === this.sort.value) {
          icon = this.order === 'asc' ? 'gk-icon-long-arrow-up' : 'gk-icon-long-arrow-down';
        }
        return icon;
      },
      formatDate (value) {
        return timeToDate(value * 1000);
      },
      formatSize (value, item) {
        return item.dir ? '-' : bitSize(value);
      },
      showMobileMenuItem (targetElement) {
        if (!this.itemButtonsDom) {
          return;
        }
        let itemToolbar = this.$el.querySelector('.gk-table-item-toolbar');
        itemToolbar && itemToolbar.remove();
        const parent = targetElement.parentNode;
        if (parent.lastChild === targetElement) {
          parent.appendChild(this.itemButtonsDom);
        } else {
          parent.insertBefore(this.itemButtonsDom, targetElement.nextSibling);
        }
      },
      handleSlideChange (file) {
        this.$emit('change-preview', file);
      },
      hideMobileMenuItem () {
        if (!this.itemButtonsDom) {
          return;
        }
        const openButtons = this.$el.querySelector('.is-opened');
        if (openButtons) {
          openButtons.classList.remove('is-opened');
        }
        this.itemButtonsDom.remove();
      },
      handleItemDropdown (file, index, event) {
        this.$refs.table.select(file, index);
        if (this.itemButtons) {
          if (event.target.className.indexOf('is-opened') > -1) {
            this.hideMobileMenuItem();
          } else {
            this.hideMobileMenuItem();
            event.target.classList.add('is-opened');
            this.showMobileMenuItem(event.target.parentNode.parentNode);
          }
        } else {
          this.handleContextmenu([file], event);
        }
      },
      handleItemButton (command, file, index, event) {
        if (command === 'more') {
          this.$refs.table.select(file, index);
          this.handleContextmenu([file], event);
        } else {
          this.$emit('command', [file], command);
        }
      },
      handleViewMode (mode) {
        if (this.viewMode === mode) {
          return;
        }
        this.selectedIndex = this.$refs.table.getSelectedIndex();
        this.viewMode = null;
        this.$nextTick(() => {
          this.viewMode = mode;
        })
      },
      handleSelect (files, event) {
        this.$emit('select', files, event);
      },
      handleSelectAll (event) {
        this.$emit('selectAll', event);
      },
      handleCheck (files, event) {
        this.$refs.contextmenu.hide();
        this.$emit('check', files, event);
      },
      handleCheckAll (event) {
        this.$emit('checkAll', event);
      },
      handleDoubleClick (file, event) {
        if (event && event.target.className.indexOf('gk-finder-item-dropdown') > -1) {
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
      handleContextmenu (files, event) {
        if (!this.buttons || !this.buttons.length) {
          return;
        }
        if (this.beforeContextmenu && this.beforeContextmenu(files, event) === false) {
          return;
        }
        this.getContextMenus(files);
        this.$refs.contextmenu.show(event);
        event.stopPropagation();
      },
      handleCommand (command) {
        this.$emit('command', this.getSelected(), command);
      },
      handleNavigator (value, file, index) {
        if (file !== null) {
          this.navList = this.navList.slice(0, index + 1);
          this.handleSelect(null, -1);
          this.$emit('input', file);
        }
        this.$emit('navigator', value, file);
      },
      handleSort (command) {
        if (this.sort.value === command.value) {
          this.order = this.order === 'desc' ? 'asc' : 'desc';
        }
        this.sort = command;
        this.$emit('sort-change', this.sort.value, this.order);
      },
      handleLoadMore () {
        if (this.list.length === this.total) {
          return;
        }
        this.$emit('load-more', this.value);
      },
      loadSuccess () {
        this.fileList = [];
        this.list.forEach((file) => {
          if (!file.dir) {
            this.fileList.push(file);
          }
        });
        this.preview = false;
      },
      openFile (file) {
        this.hideMobileMenuItem();
        if (!file.dir) {
          this.previewFile = file;
          this.preview = true;
          this.$emit('input', file);
        } else {
          this.preview = false;
        }
        this.updateNavs(file);
      },
      initNavs (file) {
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
      updateNavs (file) {
        let navs = this.initNavs(file);
        if (file.fullpath) {
          navs.forEach((nav, index) => {
            if (this.navList[index] && nav.fullpath === this.navList[index].fullpath) {
              navs[index] = this.navList[index]
            }
          });
        }
        this.navList = navs;
      },
      getSelected () {
        return this.$refs.table ? this.$refs.table.getSelected() : [];
      },
      zoom (size) {
        if (this.viewMode !== 'listgrid') {
          return false;
        }
        this.$refs.table.zoom(size);
      },
      enter (file) {
        if (file === undefined) {
          let files = this.getSelected();
          if (files.length !== 1) {
            return false;
          }
          file = files[0];
        }
        this.handleDoubleClick(file);
      },
      up () {
        this.$refs.breadcrumb.toUp();
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.opsWidth = (this.$refs.ops.clientWidth + 30) + 'px';
      });
      if (this.value && Object.keys(this.value).length) {
        this.openFile(this.value);
      }
    }
  }
</script>