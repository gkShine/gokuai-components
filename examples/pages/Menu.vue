<template>
    <div class="container">
        <h3 class="demo-title">
            右键菜单
        </h3>
        <div class="demo-block" style="height: 400px; width: 600px" @contextmenu="handleRight">

        </div>
        <gk-menu ref="contextmenu">
            <gk-menu-item>菜单一</gk-menu-item>
            <gk-menu-item>菜单二</gk-menu-item>
            <gk-menu-item>菜单三</gk-menu-item>
            <gk-menu-item>菜单四
                <gk-submenu>
                    <gk-menu-item>菜单五</gk-menu-item>
                    <gk-menu-item>菜单六</gk-menu-item>
                    <gk-menu-item>菜单七</gk-menu-item>
                </gk-submenu></gk-menu-item>
        </gk-menu>
    </div>
</template>

<script>
  export default {
    methods: {
      handleRight(event) {
        this.$refs.contextmenu.show(event);
        event.preventDefault();
      }
    }
  }
</script>

<style scoped>

</style>