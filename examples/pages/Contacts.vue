<template>
  <div class="container">
    <h3 class="demo-title">
      通讯录
    </h3>
    <div class="demo-block" style="height: 768px;">
      <gk-contacts
          :loading="loading"
          size="50"
          :mini="isMini"
          :root="{'name': '盛大企业', 'id': 0}"
          group-key="isGroup"
          :data="data"
          :props="props"
          :default-sort="sort"
          :sort-list="sortList"
          :item-buttons="[{label: '下载', command: 'download'},{label: '下载', command: 'download'},{label: '下载', command: 'download'}]"
          @selectGroup="handleSelectGroup"
          @navigator="handleSelectGroup"
      ></gk-contacts>

      <gk-button-group>
        <gk-button @click.native="isMini = false">完整模式</gk-button>
        <gk-button @click.native="isMini = true">精简模式</gk-button>
      </gk-button-group>
    </div>
  </div>
</template>

<script>
  import { getGroupList, getMemberList } from "../api";

  export default {
    data () {
      return {
        loading: false,
        isMini: false,
        props: {
          group: {
            label: 'name',
            desc: 'count:[count]个成员',
            value: 'id'
          },
          member: {
            label: 'member_name',
            desc: 'member_email',
            value: 'id',
            tags: 'tags'
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
        this.loading = true;
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
            this.data = data.concat(res.list);
            this.loading = false
          })
        })
      },
      handleSelectGroup() {
        this.loadData();
      }
    },
    mounted () {
      this.loadData()
    }
  }
</script>