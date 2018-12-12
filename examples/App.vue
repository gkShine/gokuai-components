<template>
  <div id="app">
    <gk-dropdown v-if="isMobile" class="mobile-menu-button">
      <gk-button><i class="fa fa-list-ul"></i></gk-button>
      <gk-dropdown-menu @command="handleCommand">
        <gk-dropdown-item :command="route.path" :class="{'gk-menu-item-active':route.path === $route.path}" v-for="(route, index) in $router.options.routes" :key="index" v-if="!route.hidden" >{{route.name}}</gk-dropdown-item>
      </gk-dropdown-menu>
    </gk-dropdown>
    <ul class="aside" v-else>
      <li :class="{'active':route.path === $route.path}" v-for="(route, index) in $router.options.routes" :key="index" v-if="!route.hidden">
        <router-link :to="route.path">{{route.name}}</router-link>
      </li>
    </ul>
    <router-view/>
    <gk-menu ref="menus" v-if="isMobile" @command="handleSwitch" :data="menus"></gk-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        menus: [],
        titles: [],
        blocks: []
      }
    },
    watch: {
      '$route': 'changeRoute'
    },
    computed: {
      isMobile() {
        return this.$device.mobile || this.$device.tablet
      }
    },
    methods: {
      handleCommand(value) {
        this.$router.push(value);
      },
      handleSwitch(index) {
        if (!this.isMobile) {
          return;
        }
        for (let i = 0; i < this.titles.length; i++) {
          this.titles[i].style.display = this.blocks[i].style.display = i === index ? 'block' : 'none';
        }
      },
      changeRoute() {
        if (!this.isMobile) {
          return;
        }
        this.$nextTick(() => {
          this.titles = this.$el.querySelectorAll('.demo-title');
          this.blocks = this.$el.querySelectorAll('.demo-block');
          let menus = [];
          for (let i = 0; i < this.titles.length; i++) {
            menus.push({
              label: this.titles[i].innerText,
              command: i
            });
            this.titles[i].onclick = (e) => {
              this.$refs.menus.show();
              e.stopPropagation();
            };
          }
          this.menus = menus;
          this.handleSwitch(0);
        });
      }
    },
    mounted() {
      this.changeRoute();
    }
  }
</script>

<style lang="scss">
  body, html {
    margin: 0;

    .aside {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: 200px;
      background: #FFFFFF;
      padding: 50px;

      li {
        padding: 8px 0;
        a {
          text-decoration: none;
          color: #434343;
          font-size: 14px;

          &:hover {
            color: #4B7FEF;
          }
        }

        &.active {
          a {
            color: #4B7FEF;
          }
        }
      }
    }

    .container {
      margin-left: 300px;
      padding-right: 20px;
    }

    &.touch {
      .aside {

      }

      .container {
        margin-left: 0;
        padding-right: 0;
      }
    }
  }

  ul {
    margin: 0;
    padding: 0;

    li {
      list-style: none;
    }
  }

  .demo-title {
    width: 984px;
    margin: 15px 0;
    color: #1f2f3d;
  }

  .demo-block {
    position: relative;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    margin-bottom: 60px;
  }

  .demo-block:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5)
  }

  .demo-toolbar {
    padding: 10px;
  }

  .touch {
    .demo-title {
      width: 100%;
      text-indent: 10px;
      display: none;
    }

    .demo-block {
      position: absolute;
      border-radius: 0;
      top: 60px;
      bottom: 0;
      left: 0;
      right: 0;
      display: none;
      margin: 0;
      height: auto !important;
    }

    .mobile-menu-button {
      position: fixed;
      right: 10px;
      top: 10px;
      z-index: 200;
    }
  }
</style>