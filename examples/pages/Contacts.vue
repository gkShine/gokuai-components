<template>
  <div class="container">
    <h3 class="demo-title">
      通讯录
    </h3>
    <div class="demo-block" style="height: 768px;">
      <gk-contacts
          size="50"
          :groups="groups"
          :members="members"
          lazy
          :loadGroups="loadGroups"
          :loadMember="loadMembers"
      ></gk-contacts>
    </div>
  </div>
</template>

<script>
  import { getGroupList, getMemberList } from "../api";

  export default {
    data () {
      return {
        groups: [],
        members: []
      }
    },
    methods: {
      loadGroups (start, resolve) {

      },
      loadMembers (resolve) {

      }
    },
    mounted () {
      getGroupList({
        page: 1
      }).then(data => {
        this.groups = data.list
      })

      getMemberList({
        page: 1
      }).then(data => {
        this.groups = data.list
      })
    }
  }
</script>