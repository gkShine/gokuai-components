<template>
  <div class="container">
    <h3 class="demo-title">
      通讯录
    </h3>
    <div class="demo-block" style="height: 768px;">
      <gk-contacts
          size="50"
          :mini="false"
          :root="{'name': '盛大企业', 'id': 0}"
          group-key="isGroup"
          :data="data"
          :props="props"
          :default-sort="sort"
          :sort-list="sortList"
          :item-buttons="[{label: '下载', command: 'download'},{label: '下载', command: 'download'},{label: '下载', command: 'download'}]"
      ></gk-contacts>
    </div>
  </div>
</template>

<script>
  import { getGroupList, getMemberList } from "../api";

  export default {
    data () {
      return {
        props: {
          group: {
            label: 'name',
            desc: 'count',
            value: 'id'
          },
          member: {
            label: 'member_name',
            desc: 'member_email',
            value: 'member_id'
          }
        },
        data: [],
        sort: 'name asc',
        sortList: [
          {
            value: 'name',
            label: '姓名'
          },
          {
            value: 'age',
            label: '年龄'
          }
        ]
      }
    },
    methods: {
      loadData() {
        let data = [];
        getGroupList({
          page: 1
        }).then(res => {
          data = res.list.map(group => {
            group.isGroup = true;
            return group;
          });
          getMemberList({
            page: 1
          }).then(res => {
            this.data = data.concat(res.list)
          })
        })
      }
    },
    mounted () {
      this.loadData()
    }
  }
</script>