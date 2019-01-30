<template>
  <div class="gk-contacts" :class="{'gk-mobile-contacts': isMobile, 'gk-ie-contacts': isIE}">
    <slot name="header"></slot>
    <div class="gk-contacts-toolbar">
      <gk-breadcrumb ref="breadcrumb" :data="navList" id="fullpath" :allow-input="allowInput" @navigator="handleNavigator" label="filename"
                     value="fullpath" :style="{'margin-right': opsWidth}"></gk-breadcrumb>

      <div ref="ops" class="gk-contacts-show-ops">
        <slot name="breadcrumb"></slot>
        <gk-dropdown v-if="sortList" class="gk-contacts-sort-block" @command="handleSort">
          <span class="gk-contacts-sort-button">
            <gk-icon :icon="order === 'asc' ? 'long-arrow-up' : 'long-arrow-down'"/>{{sortLabel}}<gk-icon icon="caretdown" placement="right"/>
          </span>
          <gk-dropdown-menu slot="dropdown" show-arrow>
            <gk-dropdown-item :icon="getSortIcon(sort.value)" v-for="(sort, idx) in sortList"
                              :command="sort" :key="idx">{{sort.label}}
            </gk-dropdown-item>
          </gk-dropdown-menu>
        </gk-dropdown>
      </div>
    </div>

    <div class="gk-contacts-content">
        <gk-table ref="table"
                  shortcut
                  fit
                  scroll-on-check
                  right-selected
                  :loading="loading"
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
                  @load-more="handleLoadMore">
          <gk-table-column :width="25" :checkbox="showCheckbox" align="center"></gk-table-column>
          <gk-table-column :width="40" valign="top">
            <template slot-scope="scope">

            </template>
          </gk-table-column>
          <gk-table-column property="filename" :label="gettext('filename')">
            <template slot-scope="scope">
              <div class="gk-contacts-main-column">
                <div class="gk-contacts-filename-column">
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
              <i class="gk-icon-caretdown gk-contacts-item-dropdown"
                 v-touch:tap="($event) => handleItemDropdown(scope.row, scope.index, $event.srcEvent)"></i>
            </template>
          </gk-table-column>
          <div slot="empty" class="gk-contacts-empty">
            <slot></slot>
          </div>
        </gk-table>
    </div>

    <gk-menu ref="contextmenu" v-if="contextMenus" :data="contextMenus" @command="handleCommand"></gk-menu>

    <slot name="footer"></slot>
  </div>
</template>

<script>
  import GkBreadcrumb from "gokuai-components/packages/breadcrumb/src/breadcrumb";
  import GkButton from "gokuai-components/packages/button/src/button";
  import GkButtonGroup from "gokuai-components/packages/button/src/button-group";
  import GkTable from "gokuai-components/packages/table/src/table";
  import GkTableColumn from "gokuai-components/packages/table/src/table-column";
  import GkMenu from "gokuai-components/packages/menu/src/menu";
  import GkMenuItem from "gokuai-components/packages/menu/src/menu-item";
  import GkDropdown from "gokuai-components/packages/dropdown/src/dropdown";
  import GkDropdownItem from "gokuai-components/packages/dropdown/src/dropdown-item";
  import GkDropdownMenu from "gokuai-components/packages/dropdown/src/dropdown-menu";
  import GkSubmenu from "gokuai-components/packages/menu/src/submenu";
  import GkCheckbox from "gokuai-components/packages/checkbox/src/checkbox";
  import touch from 'gokuai-components/packages/touch/src/touch';
  import {timeToDate, bitSize, baseName, dirName, isIE} from "gokuai-components/src/common/util";

  export default {
    name: 'GkContacts',
    components: {
      GkCheckbox, GkDropdown, GkDropdownMenu, GkDropdownItem, GkMenuItem, GkMenu, GkSubmenu,
      GkTableColumn, GkTable, GkButtonGroup, GkButton, GkBreadcrumb
    },
    directives: {touch},
    props: {
      value: Object,
      root: Object, //根分组
      'sort-list': Array,
      'default-sort': {
        type: String,
        default: ''
      },
      'allow-input': {
        type: Boolean,
        default: true
      },
      'show-more': Boolean,
      'more-text': String,
      full: Boolean,
      checkbox: Boolean,
      total: Number,
      groups: Function|Array,
      members: Function|Array,
      buttons: Array,
      'item-buttons': Array,
      loading: Boolean,
      translate: Object,
      'before-enter': Function,
      'before-contextmenu': Function
    },
    data() {
      let [sort, order] = this.defaultSort.split(' ');
      return {
        isIE: !!isIE(),
        sort: sort || '',
        sortLabel: '文件名',
        order: order || '',
        navList: [],
        selectedIndex: [],
        list: [],
        contextMenus: [],
        opsWidth: '150px'
      };
    },
    watch: {
      groups: {
        handler: '',
        immediate: true
      },
      members: {
        handler: '',
        immediate: true
      }
    },
    computed: {
      isMobile() {
        return touch.enable;
      },
      showCheckbox() {
        return !this.isMobile && this.checkbox
      },
      itemButtonsDom() {
        if (!this.isMobile || !this.itemButtons) {
          return false;
        }
        let tr = document.createElement('tr');
        tr.classList.add('gk-table-item-toolbar');
        let td = document.createElement('td');
        td.setAttribute('colspan', 4);
        let ul = document.createElement('ul');
        ul.classList.add('gk-contacts-item-buttons');
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
      gettext(value) {
        return this.translate && this.translate[value] || value;
      },
      getContextMenus(files) {
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
      getSortIcon(key) {
        let icon = '';
        if (key === this.sort) {
          icon = this.order === 'asc' ? 'gk-icon-long-arrow-up' : 'gk-icon-long-arrow-down';
        }
        return icon;
      },
      formatDate(value) {
        return timeToDate(value * 1000);
      },
      formatSize(value, item) {
        return item.dir ? '-' : bitSize(value);
      },
      showMobileMenuItem(targetElement) {
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
      hideMobileMenuItem() {
        if (!this.itemButtonsDom) {
          return;
        }
        const openButtons = this.$el.querySelector('.is-opened');
        if (openButtons) {
          openButtons.classList.remove('is-opened');
        }
        this.itemButtonsDom.remove();
      },
      handleItemDropdown(file, index, event) {
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
      handleItemButton(command, file, index, event) {
        if (command === 'more') {
          this.$refs.table.select(file, index);
          this.handleContextmenu([file], event);
        } else {
          this.$emit('command', [file], command);
        }
      },
      handleSelect(files, event) {
        this.$emit('select', files, event);
      },
      handleSelectAll(event) {
        this.$emit('selectAll', event);
      },
      handleCheck(files, event) {
        this.$refs.contextmenu.hide();
        this.$emit('check', files, event);
      },
      handleCheckAll(event) {
        this.$emit('checkAll', event);
      },
      handleDoubleClick(file, event) {
        if (event && event.target.className.indexOf('gk-contacts-item-dropdown') > -1) {
          return;
        }
        if (this.beforeEnter && this.beforeEnter(file, event) === false) {
          return;
        }
        this.navList.push(file);
        this.$emit('input', file);
        this.$emit('enter', file);
      },
      handleContextmenu(files, event) {
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
      handleCommand(command) {
        this.$emit('command', this.getSelected(), command);
      },
      handleNavigator(value, file, index) {
        if (file !== null) {
          this.navList = this.navList.slice(0, index + 1);
          this.handleSelect(null, -1);
          this.$emit('input', file);
        }
        this.$emit('navigator', value, file);
      },
      handleSort(command) {
        if (this.sort === command.value) {
          this.order = this.order === 'desc' ? 'asc' : 'desc';
        }
        this.sort = command.value;
        this.sortLabel = command.label;
        this.$emit('sort-change', this.sort, this.order);
      },
      handleLoadMore() {
        if (this.list.length === this.total) {
          return;
        }
        this.$emit('load-more', this.value);
      },
      getSelected() {
        return this.$refs.table ? this.$refs.table.getSelected() : [];
      },
      enter(file) {
        if (file === undefined) {
          let files = this.getSelected();
          if (files.length !== 1) {
            return false;
          }
          file = files[0];
        }
        this.handleDoubleClick(file);
      },
      up() {
        this.$refs.breadcrumb.toUp();
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.opsWidth = (this.$refs.ops.clientWidth + 30) + 'px';
      });
    }
  }
</script>