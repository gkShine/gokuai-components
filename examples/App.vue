<template>
    <div id="app">
        <ul class="aside">
            <li>
                <router-link to="/button">按钮</router-link>
            </li>
            <li>
                <router-link to="/menu">菜单</router-link>
            </li>
            <li>
                <router-link to="/table">表格</router-link>
            </li>
            <li>
                <router-link to="/slide">预览</router-link>
            </li>
            <li>
                <router-link to="/dropdown">下拉框</router-link>
            </li>
            <li>
                <router-link to="/thumbnail">幻灯片</router-link>
            </li>
            <li>
                <router-link to="/finder">文件管理器</router-link>
            </li>
        </ul>
        <router-view/>
    </div>
</template>

<style lang="scss">
    body, html {
        margin: 0;

        .aside {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 200px;
            background: #FFFFFF;
            padding: 50px;

            li {
                padding: 8px 0;
                a {
                    text-decoration: none;
                    color: #434343;
                    font-size: 14px;

                    &:hover {
                        color: #4B7FEF;
                    }
                }
            }
        }

        .container {
            margin-left: 300px;
        }
    }

    ul {
        margin: 0;
        padding: 0;

        li {
            list-style: none;
        }
    }

    .demo-title {
        width: 984px;
        margin: 15px 0;
        color: #1f2f3d;
    }

    .demo-block {
        position: relative;
        border: 1px solid #ebebeb;
        border-radius: 3px;
        transition: .2s;
        width: 1024px;
        height: 768px;
    }

    .demo-block:hover {
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5)
    }
</style>