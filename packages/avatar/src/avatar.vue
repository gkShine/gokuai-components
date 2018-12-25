<template>
  <div :class="computedClass" :style="style">
    <span v-if="showText">{{avatarText}}</span>
    <i v-else-if="showDefault" class="gk-icon-user-circle"></i>
    <img v-else :src="src" @error="handleError"/>
  </div>
</template>

<script>
  export default {
    name: "GkAvatar",
    props: {
      src: String,
      name: String,
      circle: Boolean,
      size: {
        type: Number | String,
        default: 40
      },
      id: {
        type: Number | String,
        default() {
          return Math.round(Math.random() * 6);
        }
      }
    },
    computed: {
      computedClass() {
        return {
          'gk-avatar': true,
          ['gk-avatar-' + this.size]: true,
          'gk-avatar--circle': this.circle
        }
      }
    },
    data() {
      return {
        showText: false,
        showDefault: false,
        style: {},
        avatarText: ''
      }
    },
    methods: {
      handleError() {
        if (this.name !== undefined) {
          this.generateAvatar();
          this.showText = true;
        } else {
          this.showDefault = true;
        }
      },
      generateAvatar() {
        const matches = this.name.match(/[\u4e00-\u9fa5]/g);
        let avatarText = '';
        if (matches) {
          avatarText = matches.splice(matches.length - 2).join('');
        } else {
          const tempArr = this.name.split(' ');
          if (tempArr.length > 1) {
            const firstMatch = tempArr[0].match(/[a-zA-Z0-9]/g),
              firstLetter = firstMatch ? firstMatch[0] : '',
              secondMatch = tempArr[1].match(/[a-zA-Z0-9]/g),
              secondLetter = secondMatch ? secondMatch[0] : '';
            if (firstLetter && secondLetter) {
              avatarText = firstLetter + secondLetter;
            } else {
              avatarText = this.name.slice(0, 2);
            }
          } else {
            avatarText = this.name.slice(0, 2);
          }
        }
        this.avatarText = avatarText;
        //默认随机背景
        const colorList = ['#b0afe8', '#5ac9e5', '#4cbcf0', '#87b4dd', '#55cdd1'];
        this.style = {
          backgroundColor: colorList[parseInt(this.id) % 5]
        }
      }
    },
    created() {
      if (this.src === undefined) {
        this.handleError();
      }
    }
  }
</script>