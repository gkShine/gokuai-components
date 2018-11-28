<template>
  <div class="container">
    <h3 class="demo-title">
      图标
    </h3>
    <div class="demo-block" style="padding: 20px">
      <ul>
        <li><span>
          <gk-icon icon="user-circle"></gk-icon>
          <span>gk-icon-user-circle</span>
        </span></li>
        <li><span>
          <gk-icon icon="times-circle"></gk-icon>
          <span>gk-icon-times-circle</span>
        </span></li>
        <li><span>
          <gk-icon icon="pause"></gk-icon>
          <span>gk-icon-pause</span>
        </span></li>
        <li><span>
          <gk-icon icon="playarrow"></gk-icon>
          <span>gk-icon-playarrow</span>
        </span></li>
        <li><span>
          <gk-icon icon="stop"></gk-icon>
          <span>gk-icon-stop</span>
        </span></li>
        <li><span>
          <gk-icon icon="angleleft"></gk-icon>
          <span>gk-icon-angleleft</span>
        </span></li>
        <li><span>
          <gk-icon icon="angleright"></gk-icon>
          <span>gk-icon-angleright</span>
        </span></li>
        <li><span>
          <gk-icon icon="caretdown"></gk-icon>
          <span>gk-icon-caretdown</span>
        </span></li>
        <li><span>
          <gk-icon icon="caretright"></gk-icon>
          <span>gk-icon-caretright</span>
        </span></li>
        <li><span>
          <gk-icon icon="caretup"></gk-icon>
          <span>gk-icon-caretup</span>
        </span></li>
        <li><span>
          <gk-icon icon="check"></gk-icon>
          <span>gk-icon-check</span>
        </span></li>
        <li><span>
          <gk-icon icon="close"></gk-icon>
          <span>gk-icon-close</span>
        </span></li>
        <li><span>
          <gk-icon icon="ellipsisv"></gk-icon>
          <span>gk-icon-ellipsisv</span>
        </span></li>
        <li><span>
          <gk-icon icon="longarrowdown"></gk-icon>
          <span>gk-icon-longarrowdown</span>
        </span></li>
        <li><span>
          <gk-icon icon="longarrowup"></gk-icon>
          <span>gk-icon-longarrowup</span>
        </span></li>
        <li><span>
          <gk-icon icon="sort"></gk-icon>
          <span>gk-icon-sort</span>
        </span></li>
        <li><span>
          <gk-icon icon="angle-down"></gk-icon>
          <span>gk-icon-angle-down</span>
        </span></li>
        <li><span>
          <gk-icon icon="times"></gk-icon>
          <span>gk-icon-times</span>
        </span></li>
        <li><span>
          <gk-icon icon="arrow-down"></gk-icon>
          <span>gk-icon-arrow-down</span>
        </span></li>
        <li><span>
          <gk-icon icon="redo"></gk-icon>
          <span>gk-icon-redo</span>
        </span></li>
        <li><span>
          <gk-icon icon="window-maximize"></gk-icon>
          <span>gk-icon-window-maximize</span>
        </span></li>
        <li><span>
          <gk-icon icon="window-minimize"></gk-icon>
          <span>gk-icon-window-minimize</span>
        </span></li>
        <li><span>
          <gk-icon icon="upload"></gk-icon>
          <span>gk-icon-upload</span>
        </span></li>
        <li><span>
          <gk-icon icon="checkbox"></gk-icon>
          <span>gk-icon-checkbox</span>
        </span></li>
        <li><span>
          <gk-icon icon="checkcircle"></gk-icon>
          <span>gk-icon-checkcircle</span>
        </span></li>
        <li><span>
          <gk-icon icon="info"></gk-icon>
          <span>gk-icon-info</span>
        </span></li>
        <li><span>
          <gk-icon icon="caretup"></gk-icon>
          <span>gk-icon-caretup</span>
        </span></li>
        <li><span>
          <gk-icon icon="qrcode"></gk-icon>
          <span>gk-icon-qrcode</span>
        </span></li>
        <li><span>
          <gk-icon icon="caret-down"></gk-icon>
          <span>gk-icon-caret-down</span>
        </span></li>
        <li><span>
          <gk-icon icon="caret-up"></gk-icon>
          <span>gk-icon-caret-up</span>
        </span></li>
        <li><span>
          <gk-icon icon="chevron-circle-right"></gk-icon>
          <span>gk-icon-chevron-circle-right</span>
        </span></li>
        <li><span>
          <gk-icon icon="chevron-circle-left"></gk-icon>
          <span>gk-icon-chevron-circle-left</span>
        </span></li>
        <li><span>
          <gk-icon icon="listdetail"></gk-icon>
          <span>gk-icon-listdetail</span>
        </span></li>
        <li><span>
          <gk-icon icon="listgrid"></gk-icon>
          <span>gk-icon-listgrid</span>
        </span></li>
        <li><span>
          <gk-icon icon="list"></gk-icon>
          <span>gk-icon-list</span>
        </span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="scss">
  .demo-block {
    width: 960px;

    ul {
      overflow: hidden;
      list-style: none;
      padding: 0;
      border: 1px solid #eaeefb;
      border-radius: 4px;

      li {
        float: left;
        width: 16.66%;
        text-align: center;
        height: 120px;
        line-height: 120px;
        color: #666;
        font-size: 13px;
        transition: color .15s linear;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin-right: -1px;
        margin-bottom: -1px;

        & > span {
          display: inline-block;
          line-height: normal;
          vertical-align: middle;
          font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
          color: #99a9bf;

          i {
            color: #606266;
            font-size: 32px;
            display: block;
            margin-bottom: 15px;
          }
        }
      }
    }
  }

  html.mobile {
    .demo-block {
      width: auto;
      overflow-y: auto;

      li {
        width: 50%;
      }
    }
  }
</style>