<template lang="pug">
d-drawer(title="主题风格", v-model="currentVal")
	i-button.add(size="small", type="primary", @click="create") 创建主题
	ul.list
		li(v-for="(k, i) in themeList" :key="i")
			.theme-name {{ k.themeName }}
			.use(@click="use(k)") 应用
			.use(@click="edit(k)") 编辑
			.use(@click="remove(k)") 删除
	i-modal(v-model="modal", title="编辑主题" @on-ok="submit")
		i-form
			i-form-item(label="主题名")
				d-input(v-model="themeName")
			i-form-item(label="色盘")
				i-color-picker(
					:alpha="true",
					size="small",
					v-model="form.colorDisk[index]",
					v-for="(item, index) in form.colorDisk",
					:key="index"
					:style="{ marginLeft: '10px', marginBottom: '10px', display: 'inline-block' }")
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Button, ColorPicker, Form, FormItem, Modal } from 'view-design'
import eLabel from '@/vue2/components-style/e-label/index.vue'
import dInput from '@/vue2/components-style/d-input/index.vue'
import Editor from '@/core/Editor'
import colorTheme from '@/core/colorTheme.js'
import DDrawer from '@/vue2/components-style/d-drawer/index.vue'
import { list, create, update, destroy, detail } from '@/vue2/api/theme.api.js'

@Component({
	components: {
		eLabel,
		DDrawer,
		dInput,
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-button': Button,
		'i-color-picker': ColorPicker,
	},
})
export default class Theme extends Vue {
	@Prop(Boolean) value!: boolean
	modal = false
	currentVal = false
	current: any = null
	editor: Editor = Editor.Instance()
	themeName = ''
	form: any = {
		colorDisk: JSON.parse(JSON.stringify(colorTheme.colorDisk)),
	}
	themeList: any[] = []
	
	@Watch('value')
	onValueChange(val: boolean): void {
		this.currentVal = val
	}

	@Watch('currentVal')
	onCurrentVal(val: boolean): void {
		this.$emit('input', val)
	}
	
	create () {
		this.themeName = ''
		this.form = {
			colorDisk: JSON.parse(JSON.stringify(colorTheme.colorDisk)),
		}
		this.current = null
		this.modal = true
	}

	async edit (row) {
		console.log(111)
		const themeDetail = await detail({themeId: row.themeId})
		this.themeName = themeDetail.themeName
		this.form = themeDetail.themeConfig
		this.current = row
		this.modal = true
	}
	
	remove (row) {
		this.$Modal.confirm({
			title: '是否删除当前场景？',
			content: '该场景未删除的组件将自动进入回收站！',
			onOk: async () => {
				await destroy({themeId: row.id})
				this.getList()
			},
		})
	}

	async submit () {
		const req: any = {
			themeName: this.themeName,
			themeConfig: this.form
		}
		if (!this.current) {
			await create(req)
		} else {
			req.themeId = this.current.themeId
			await update(req)
		}
		this.modal = false
		this.getList()
	}
	
	async getList () {
		const res = await list()
		this.themeList = res.list
	}
	
	use (row) {
		Object.values(this.editor.screen.screenWidgets).forEach((v:any) => {
			v.config.config.colorTheme.colorDisk = row.themeConfig.colorDisk
		})
		this.editor.unSelectWidget()
		const temp = { ...this.editor.screen.screenWidgetsLays }
		this.editor.screen.screenWidgetsLays = []
		setTimeout(() => {
			this.editor.screen.screenWidgetsLays = temp
		})
	}
	
	created() {
		this.getList()
	}
}
</script>

<style lang="scss" scoped>
.add {
	margin-bottom: 10px;
}
.list {
	li {
		display: flex;
		color: #fff;
		margin-bottom: 10px;

		.theme-name {
			flex: 1;
		}
		.use {
			margin-left: 6px;
			cursor: pointer;
		}
	}
}
</style>
