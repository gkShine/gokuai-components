<template>
  <div class="container">
    <h3 class="demo-title">
      文本框
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-input placeholder="我是提示"></gk-input>
    </div>
    <h3 class="demo-title">
      文本框只读
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-input readonly v-model="value" placeholder="我是提示"></gk-input>
    </div>
    <h3 class="demo-title">
      文本框禁用
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-input disabled placeholder="我是提示"></gk-input>
    </div>
    <h3 class="demo-title">
      文本框图标
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-input prefix-icon="user-circle" sync-color></gk-input>
      <gk-input suffix-icon="check" sync-color></gk-input>
    </div>
    <h3 class="demo-title">
      文本组
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-input><template slot="prepend">http://</template></gk-input>
      <gk-input><template slot="append">.com</template></gk-input>
    </div>
    <h3 class="demo-title">
      文本大小
    </h3>
    <div class="demo-block" style="padding: 20px">
      <div>
        <gk-input suffix-icon="sort"></gk-input>
        <gk-input suffix-icon="sort" size="medium"></gk-input>
        <gk-input suffix-icon="sort" size="small"></gk-input>
        <gk-input suffix-icon="sort" size="mini"></gk-input>
      </div>
      <div>
        <gk-input><template slot="prepend">http://</template></gk-input>
        <gk-input size="medium"><template slot="prepend">http://</template></gk-input>
        <gk-input size="small"><template slot="prepend">http://</template></gk-input>
        <gk-input size="mini"><template slot="prepend">http://</template></gk-input>
      </div>
      <div>
        <gk-input><template slot="append">.com</template></gk-input>
        <gk-input size="medium"><template slot="append">.com</template></gk-input>
        <gk-input size="small"><template slot="append">.com</template></gk-input>
        <gk-input size="mini"><template slot="append">.com</template></gk-input>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Input",
    data() {
      return {
        value: '我是默认输入内容'
      }
    }
  }
</script>

<style scoped>

</style>