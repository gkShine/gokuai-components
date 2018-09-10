<template>
    <div class="container">
        <h3 class="demo-title">
            下拉选择框
        </h3>
        <div class="demo-block" style="padding: 20px">
            <gk-dropdown style="display: inline-block">
                <gk-button>点击出下拉</gk-button>
                <gk-dropdown-menu show-arrow slot="dropdown">
                    <gk-dropdown-item>下拉项一</gk-dropdown-item>
                    <gk-dropdown-item>下拉项二</gk-dropdown-item>
                    <gk-dropdown-item>下拉项三</gk-dropdown-item>
                    <gk-dropdown-item>下拉项四</gk-dropdown-item>
                </gk-dropdown-menu>
            </gk-dropdown>
            <gk-dropdown style="display: inline-block">
                <gk-button>划过出下拉</gk-button>
                <gk-dropdown-menu show-arrow slot="dropdown" trigger="hover">
                    <gk-dropdown-item>下拉项一</gk-dropdown-item>
                    <gk-dropdown-item>下拉项二</gk-dropdown-item>
                    <gk-dropdown-item>下拉项三</gk-dropdown-item>
                    <gk-dropdown-item>下拉项四</gk-dropdown-item>
                </gk-dropdown-menu>
            </gk-dropdown>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Home"
  }
</script>

<style scoped>

</style>