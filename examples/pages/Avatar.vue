<template>
  <div class="container">
    <h3 class="demo-title">
      默认头像
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-avatar />
    </div>
    <h3 class="demo-title">
      存在的头像
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-avatar src="http://yk3b.goukuai.cn/index/avatar?id=8&thumb=1&ent_id=0&size=40" :id="8" name="lv liang liang"/>
      <gk-avatar circle src="http://yk3b.goukuai.cn/index/avatar?id=8&thumb=1&ent_id=0&size=40" :id="8" name="lv liang liang"/>
    </div>
    <h3 class="demo-title">
      不存在的头像
    </h3>
    <div class="demo-block" style="padding: 20px">
      <gk-avatar :id="4" name="circle" />
      <gk-avatar circle :id="4" name="circle" />
    </div>
    <h3 class="demo-title">
      头像大小
    </h3>
    <div class="demo-block" style="padding: 20px">
      <div>
        <gk-avatar :id="8" name="吕亮亮" size="16"/>
        <gk-avatar :id="8" name="吕亮亮" size="24"/>
        <gk-avatar :id="8" name="吕亮亮" size="26"/>
        <gk-avatar :id="8" name="吕亮亮" size="28"/>
        <gk-avatar :id="8" name="吕亮亮" size="32"/>
        <gk-avatar :id="8" name="吕亮亮" size="34"/>
        <gk-avatar :id="8" name="吕亮亮" size="40"/>
        <gk-avatar :id="8" name="吕亮亮" size="64"/>
      </div>
      <div style="margin-top: 10px">
        <gk-avatar :id="4" name="林盛" size="16" circle/>
        <gk-avatar :id="4" name="林盛" size="24" circle/>
        <gk-avatar :id="4" name="林盛" size="26" circle/>
        <gk-avatar :id="4" name="林盛" size="28" circle/>
        <gk-avatar :id="4" name="林盛" size="32" circle/>
        <gk-avatar :id="4" name="林盛" size="34" circle/>
        <gk-avatar :id="4" name="林盛" size="40" circle/>
        <gk-avatar :id="4" name="林盛" size="64" circle/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Avatar"
  }
</script>

<style scoped>

</style>