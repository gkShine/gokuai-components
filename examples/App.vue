<template>
    <div id="app">
        <ul class="aside">
            <li :class="{'active':route.path === $route.path}" v-for="(route, index) in $router.options.routes" :key="index">
                <router-link :to="route.path">{{route.name}}</router-link>
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

                &.active {
                    a {
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
        margin-bottom: 60px
    }

    .demo-block:hover {
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5)
    }

    .demo-toolbar {
        padding: 10px;
     }
</style>