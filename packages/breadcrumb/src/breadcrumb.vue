<template>
    <div class="gk-breadcrumb">
        <gk-button-group class="gk-breadcrumb-ops" v-if="showNav" plain>
            <gk-button icon="fa fa-angle-left"></gk-button>
            <gk-button icon="fa fa-angle-right"></gk-button>
        </gk-button-group>

        <ul class="gk-breadcrumb-list">
            <li :key="idx" class="gk-breadcrumb-item" v-for="(bc, idx) in data">
                <template v-if="idx < data.length - 1">
                    <a href="javascript:void(0)">{{bc.label}}</a>
                    <i class="fa fa-angle-right"></i>
                </template>
                <span v-else>{{bc.label}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
  import GkButton from "../../button/src/button";
  import GkButtonGroup from "../../button/src/button-group";
  export default {
    name: "GkBreadcrumb",
    components: {GkButtonGroup, GkButton},
    props: {
      data: {
        type: Array,
        required: true
      },
      'show-nav': Boolean
    }
  }
</script>