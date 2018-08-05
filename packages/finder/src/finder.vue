<template>
    <div class="gk-finder-list">
        <div class="gk-finder-toolbar">
            <gk-breadcrumb :show-nav="true" :data="breadcrumbs"></gk-breadcrumb>

            <div class="gk-finder-show-ops">
                <gk-button icon="fa fa-sort" class="gk-finder-sort-button"></gk-button>
                <gk-button-group plain class="gk-finder-view-mode">
                    <gk-button
                            :class="{'gk-button-active' : viewMode === 'default'}"
                            @click.native="handleViewMode('default')" icon="gk-icon-listdetail"></gk-button>
                    <gk-button
                            :class="{'gk-button-active' : viewMode === 'list'}"
                            @click.native="handleViewMode('list')" icon="gk-icon-list"></gk-button>
                    <gk-button
                            :class="{'gk-button-active' : viewMode === 'thumbnail'}"
                            @click.native="handleViewMode('thumbnail')" icon="gk-icon-listgrid"></gk-button>
                </gk-button-group>
            </div>
        </div>

        <gk-thumbnail v-if="viewMode == 'thumbnail'" :data="['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533485046201&di=3536931d29080ffd6dcbcb2283041bd2&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F267f9e2f07082838304837cfb499a9014d08f1a0.jpg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533485046201&di=bc8ade2c036820c5a1c93ed8e02b4ed2&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fd52a2834349b033bda94010519ce36d3d439bdd5.jpg']"></gk-thumbnail>
        <gk-table show-checkbox show-header :data="jsonData" :itemHeight="itemHeight" v-else-if="viewMode === 'list'">
            <gk-table-column checkbox :width="30" align="center"></gk-table-column>
            <gk-table-column property="filename" label="文件名" sortable></gk-table-column>
            <gk-table-column property="last_dateline" label="最后修改" :formatter="formatDate" sortable
                             :width="180"></gk-table-column>
            <gk-table-column property="filesize" label="大小" :formatter="formatSize" sortable
                             :width="100"></gk-table-column>
            <gk-table-column :width="200"></gk-table-column>
        </gk-table>
        <gk-table :data="jsonData" :itemHeight="itemHeight + 20" v-else>
            <gk-table-column :width="30" ></gk-table-column>
            <gk-table-column property="filename" label="文件名" sortable>
                <template slot-scope="props">
                    <p>{{props.filename}}</p>
                    <p>
                        <span>{{props.last_member_name}}</span>
                        <span>{{formatDate(props.last_dateline)}}</span>
                        <span>{{formatSize(props.filesize, props)}}</span>
                    </p>
                </template>
            </gk-table-column>
            <gk-table-column :width="200"></gk-table-column>
        </gk-table>
    </div>
</template>

<script>
    import GkBreadcrumb from "../../breadcrumb/src/breadcrumb";
    import GkButton from "../../button/src/button";
    import GkButtonGroup from "../../button/src/button-group";
    import GkTable from "../../table/src/table";
    import GkTableColumn from "../../table/src/table-column";
    import {timeToDate, bitSize} from "../../../src/common/util";
    import GkThumbnail from "../../thumbnail/src/thumbnail";

    export default {
        name: 'GkFinder',
        components: {GkThumbnail, GkTableColumn, GkTable, GkButtonGroup, GkButton, GkBreadcrumb},
        props: {
            'json-data': {
                type: Array,
                required: true
            },
            'item-height': {
                type: Number,
                default: 42
            }
        },
        data() {
            return {
                viewMode: 'default',
                selectItem: [],
                breadcrumbs: [
                    {
                        label: '库成员列表',
                        path: ''
                    },
                    {
                        label: '深圳腾讯科技部',
                        path: ''
                    },
                    {
                        label: '科技研发部门一',
                        path: ''
                    },
                    {
                        label: '张小丰的个人信息',
                        path: ''
                    }
                ]
            };
        },
        methods: {
            formatDate(value) {
                return timeToDate(value * 1000);
            },
            formatSize(value, item) {
                return item.dir ? '-' : bitSize(value);
            },
            handleViewMode(mode) {
                this.viewMode = mode;
            }
        }
    }
</script>