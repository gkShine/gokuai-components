<template>
    <div class="gk-breadcrumb">
        <gk-button-group class="gk-breadcrumb-ops" v-if="showNav" plain>
            <gk-button icon="fa fa-angle-left"></gk-button>
            <gk-button icon="fa fa-angle-right"></gk-button>
        </gk-button-group>

        <ul class="gk-breadcrumb-list">
            <li :key="idx" class="gk-breadcrumb-item" v-for="(item, idx) in data">
                <template v-if="idx < data.length - 1">
                    <a href="javascript:void(0)" @click="clickItem(item, idx, $event)">{{item[label]}}</a>
                    <i class="fa fa-angle-right"></i>
                </template>
                <span v-else>{{item[label]}}</span>
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
      label: {
        type: String,
        default: 'label'
      },
      value: {
        type: String,
        default: 'value'
      },
      'show-nav': Boolean
    },
    methods: {
      clickItem(item, index, event) {
        this.$emit('navigator', item[this.value], item, index, event);
      }
    }
  }
</script>