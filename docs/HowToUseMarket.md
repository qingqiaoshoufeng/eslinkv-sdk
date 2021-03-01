## 下载示例
```
git clone http://10.200.1.145/framework/web/es-lab/dvdp-expand-example
```

```
cd dvdp-expand-example&& npm install
```

```
npm run serve
```

## 目录
```
|- example                // 开发主目录
|- |- App.vue             // 组件容器，包含截图等附加功能
|- |- custom.vue          // ★自定义组件
|- |- index.component.ts  // ★自定义组件配置文件
|- |- main.ts             // 入口ts文件
|- |- shims-tsx.d.ts      // ts相关配置
|- |- shims-vue.d.ts      // ts相关配置
|- |- shims-vue.d.ts      // ts相关配置
|- └- vue.d.ts            // ts相关配置
|- packages               // 开发主目录
|- └- index.js            // 打包文件
|- public                 // 网站静态文件
|- |- ...                  
|- └- index.html          
```

## custom.vue
```
<template lang="pug">
    .widget-part(:style="styles")
        h2 {{data&&data.title}}
</template>
<script lang="ts">
    import {Component} from 'vue-property-decorator'
    import {mixins} from 'vue-class-component'
    import {config, value} from './index.component'

    if (!window.GoldChart) {
        window.GoldChart = {mixins: {}}
    }
    if (!window.GoldChart.components) {
        window.GoldChart.components = {}
    }

    @Component
    class HelloWorld extends mixins(window.GoldChart.mixins) {
        created() {
            if (process.env.NODE_ENV !== 'development') {
                
                this.configValue = this.parseConfigValue(value)
            } else {
                this.data = JSON.parse(value.api.data)
                this.styles = {
                    width: value.layout.size.width + 'px',
                    height: value.layout.size.height + 'px',
                }
            }
        }
    }

    window.GoldChart.components['m-test'] = {component: HelloWorld}
    export default HelloWorld
</script>
<style lang="scss" scoped>
    h2 {
        font-weight: 600;
        font-size: 24px;
    }
</style>
```
## index.component.ts
```
const config = {animation: true}
const value = {
    api: {
        data: JSON.stringify({title: 'Hello World'})
    },
    layout: {
        size: {
            width: 480,
            height: 43
        },
        position: {
            value: 'relative'
        }
    }
}

export {config, value}
```

## 如何通信
主要是通过window.GoldChart进行数据通信

window.GoldChart.components 预先暴露组件，便于平台注册组件

window.GoldChart.mixins 平台暴露的mixins，便于迭代更新

