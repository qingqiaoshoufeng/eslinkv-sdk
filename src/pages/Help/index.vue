<template>
    <div>
        <div class="fn-clear">
            <left/>
            <div class="help-content d-scrollbar">
                <div class="markdown-body" v-highlight>
                    <div v-html="help.helpContent"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Left from './left.vue'
    import 'markdown-it-vue/dist/markdown-it-vue.css'
    import {Component, Vue, Watch} from 'vue-property-decorator'

    @Component({
        components: {
            Left
        }
    })
	export default class Help extends Vue {
        help: any = {
            helpContent: '',
            helpName: ''
        }

        @Watch('$route')
        handleRouter() {
            this.init()
        }

        async init() {
            let {name} = this.$route.params
            name = name.replace(/%20/g, '')
            const content = await import(`../../../docs/${name}.md`)
            this.help.helpName = name
            this.help.helpContent = content.default
        }

        mounted() {
            this.init()
        }
    }
</script>
<style lang="scss">
    .help-content {
        margin-left: 240px;
        height: calc(100vh);
        padding: 40px 80px;
        overflow-y: auto;
        
        code {
            word-break: break-all;
            white-space: pre-wrap;
        }
    }
    
    .markdown-body {
        ul, li {
            list-style: circle;
        }
    }
</style>
