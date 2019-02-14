<template>
  <div class="gk-contacts" :class="{'gk-mobile-contacts': isMobile}">
    <slot name="header"></slot>
    <div class="gk-contacts-toolbar">
      <gk-breadcrumb ref="breadcrumb" :data="navList" id="id"
                     @navigator="handleNavigator" label="name"
                     value="id" :style="{'margin-right': opsWidth}"></gk-breadcrumb>

      <div ref="ops" class="gk-contacts-show-ops">
        <slot name="breadcrumb"></slot>
        <gk-dropdown v-if="sortList" class="gk-contacts-sort-block" @command="handleSort">
          <span class="gk-contacts-sort-button">
            <gk-icon :icon="order === 'asc' ? 'long-arrow-up' : 'long-arrow-down'"/>{{sort.label}}<gk-icon
              icon="caretdown" placement="right"/>
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
                :data="data"
                :default-index="selectedIndex"
                :more-text="moreText"
                :show-more="showMore"
                @select="handleSelect"
                @selectAll="handleSelectAll"
                @check="handleCheck"
                @checkAll="handleCheckAll"
                @contextmenu="handleContextmenu"
                @load-more="handleLoadMore">
        <gk-table-column :width="25" :checkbox="showCheckbox" align="center"></gk-table-column>
        <gk-table-column property="itemname" :label="gettext('itemname')">
          <template slot-scope="scope">
            <div class="gk-contacts-main-column">
              <div v-if="scope.row[groupKey]" class="gk-contacts-name" :class="{'is-mini': mini}">
                <div>
                  <gk-icon class="gk-contacts-gavatar" icon="group"/>
                </div>
                <div>
                  <p>
                    {{scope.row[property.group.label]}}
                    <span v-if="scope.row[property.group.tags]">
                      <gk-tag size="mini" v-for="(tag, index) in scope.row[property.group.tags]" :key="index">{{tag}}</gk-tag>
                    </span>
                  </p>
                  <p class="gk-contacts-desc">{{scope.row | getDesc(property.group.desc)}}{{gettext('个成员')}}</p>
                </div>
              </div>
              <div v-else class="gk-contacts-name">
                <div>
                  <gk-avatar class="gk-contacts-avatar" size="34" circle
                             :name="scope.row[property.member.label]"></gk-avatar>
                </div>
                <div>
                  <p>
                    {{scope.row[property.member.label]}}
                    <span v-if="scope.row[property.member.tags]">
                      <gk-tag size="mini" v-for="(tag, index) in scope.row[property.member.tags]" :key="index">{{tag}}</gk-tag>
                    </span>
                  </p>
                  <p class="gk-contacts-desc">{{scope.row | getDesc(property.member.desc)}}</p>
                </div>
              </div>
              <ul v-if="!isMobile && itemButtons">
                <li v-for="(button,index) in itemButtons" :key="index"
                    @click="handleItemButton(button.command, scope.row, scope.index, $event)">{{button.label}}
                </li>
                <li v-if="buttons" @click="handleItemButton('more', scope.row, scope.index, $event)">
                  {{gettext('more')}}
                </li>
              </ul>
              <gk-icon v-if="!isMobile && scope.row[groupKey] && mini" icon="angleright"/>
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
  import _ from 'lodash';
  import GkBreadcrumb from "gokuai-components/packages/breadcrumb/src/breadcrumb";
  import GkTable from "gokuai-components/packages/table/src/table";
  import GkTableColumn from "gokuai-components/packages/table/src/table-column";
  import GkMenu from "gokuai-components/packages/menu/src/menu";
  import GkDropdown from "gokuai-components/packages/dropdown/src/dropdown";
  import GkDropdownItem from "gokuai-components/packages/dropdown/src/dropdown-item";
  import GkDropdownMenu from "gokuai-components/packages/dropdown/src/dropdown-menu";
  import GkAvatar from "gokuai-components/packages/avatar/src/avatar";
  import GkIcon from "gokuai-components/packages/icon/src/icon";
  import GkTag from "gokuai-components/packages/tag/src/tag";
  import touch from 'gokuai-components/packages/touch/src/touch';
  import { timeToDate, bitSize, baseName, dirName } from "gokuai-components/src/common/util";

  export default {
    name: 'GkContacts',
    components: {
      GkDropdown,
      GkDropdownMenu,
      GkDropdownItem,
      GkMenu,
      GkTableColumn,
      GkTable,
      GkBreadcrumb,
      GkAvatar,
      GkIcon,
      GkTag
    },
    directives: { touch },
    props: {
      value: Object,
      root: Object, //根分组
      sortList: Array,
      defaultSort: {
        type: String,
        default: ''
      },
      showMore: Boolean,
      moreText: String,
      mini: Boolean,
      checkbox: Boolean,
      buttons: Array,
      itemButtons: Array,
      loading: Boolean,
      translate: Object,
      beforeEnter: Function,
      beforeContextmenu: Function,
      props: Object,
      groupKey: String,
      data: Array,
      total: Number
    },
    data () {
      const [sort, order] = this.defaultSort.split(' ');
      return {
        sort: _.find(this.sortList, {value: sort}) || {},
        order: order || '',
        navList: this.root ? [this.root] : [],
        selectedIndex: [],
        contextMenus: [],
        opsWidth: '150px',
        groupCount: 0,
        memberCount: 0
      };
    },
    computed: {
      property () {
        return _.merge({
          group: {
            label: 'name',
            desc: 'desc',
            value: 'value',
            tags: 'tags'
          },
          member: {
            label: 'name',
            desc: 'desc',
            value: 'value',
            tags: 'tags'
          }
        }, this.props)
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
        td.setAttribute('colspan', 3);
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
    filters: {
      getDesc (value, prop) {
        const props = prop.split('|');
        return props.map(p => {
          return value[p] || undefined;
        }).join(' ')
      }
    },
    methods: {
      gettext (value) {
        return this.translate && this.translate[value] || value;
      },
      getContextMenus (items) {
        let getMenus = (buttons) => {
          let menus = [];
          buttons.map((button) => {
            if (button.before && button.before(items) === false) {
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
      handleItemDropdown (item, index, event) {
        this.$refs.table.select(item, index);
        if (this.itemButtons) {
          if (event.target.className.indexOf('is-opened') > -1) {
            this.hideMobileMenuItem();
          } else {
            this.hideMobileMenuItem();
            event.target.classList.add('is-opened');
            this.showMobileMenuItem(event.target.parentNode.parentNode);
          }
        } else {
          this.handleContextmenu([item], event);
        }
      },
      handleItemButton (command, item, index, event) {
        if (command === 'more') {
          this.$refs.table.select(item, index);
          this.handleContextmenu([item], event);
        } else {
          this.$emit('command', [item], command);
        }
      },
      handleSelect (items, event) {
        if (items === null) {
          return;
        }
        if (event && event.target.className.indexOf('gk-contacts-item-dropdown') > -1) {
          return;
        }
        const item = items[0];
        if (this.beforeEnter && this.beforeEnter(item, event) === false) {
          return;
        }
        if (item[this.groupKey]) {
          this.navList.push(item);
          this.$emit('selectGroup', item);
        } else {
          this.$emit('selectMember', item);
        }
        this.$emit('input', item);
      },
      handleSelectAll (event) {
        this.$emit('selectAll', event);
      },
      handleCheck (items, event) {
        this.$refs.contextmenu.hide();
        this.$emit('check', items, event);
      },
      handleCheckAll (event) {
        this.$emit('checkAll', event);
      },
      handleContextmenu (items, event) {
        if (!this.buttons || !this.buttons.length) {
          return;
        }
        if (this.beforeContextmenu && this.beforeContextmenu(items, event) === false) {
          return;
        }
        this.getContextMenus(items);
        this.$refs.contextmenu.show(event);
        event.stopPropagation();
      },
      handleCommand (command) {
        this.$emit('command', this.getSelected(), command);
      },
      handleNavigator (value, item, index) {
        if (item !== null) {
          this.navList = this.navList.slice(0, index + 1);
          this.handleSelect(null, -1);
          this.$emit('input', item);
        }
        this.$emit('navigator', value, item);
      },
      handleSort (command) {
        if (this.sort.value === command.value) {
          this.order = this.order === 'desc' ? 'asc' : 'desc';
        }
        this.sort = command
        this.$emit('sort-change', this.sort.value, this.order);
      },
      handleLoadMore () {
        if (this.data.length === this.total) {
          return;
        }
        this.$emit('load-more', this.value);
      },
      getSelected () {
        return this.$refs.table ? this.$refs.table.getSelected() : [];
      },
      enter (item) {
        if (item === undefined) {
          let items = this.getSelected();
          if (items.length !== 1) {
            return false;
          }
          item = items[0];
        }
        this.handleDoubleClick(item);
      },
      up () {
        this.$refs.breadcrumb.toUp();
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.opsWidth = (this.$refs.ops.clientWidth + 30) + 'px';
      });
    }
  }
</script>