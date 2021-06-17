<template lang="pug">
component.widget-part(
	:is="currentComponent",
	:class="animationClass",
	:id="config.widget && config.widget.id",
	v-bind="{ config, readonly,settingData, ...$attrs }",
	@query-start="querying = true",
	@query-end="querying = false",
	@query-failed="querying = true",
	v-on="$listeners",
	v-if="widgetType !== 'group'",
	ref="widgets")
	slot
eslinkv-group(
	v-else,
	:class="animationClass",
	:id="config.widget && config.widget.id",
	v-bind="{ config, readonly,settingData, ...$attrs }",
	v-on="$listeners")
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Editor from '@/core/Editor'
import { use } from '@/vue2/api/marketComponent.api'

const prefix1 = 'market-'
const prefix2 = 'eslinkv-'
@Component
export default class WidgetNormal extends Vue {
	@Prop({ default: 'normal' }) widgetType
	@Prop({ default: false }) market
	@Prop() type
	@Prop() config
	@Prop() settingData
	@Prop({ default: false }) readonly
	componentVersion = ''
	querying = false
	queryFailed = false
	replayAnimation = false
	ready = false
	animationClass = null
	editor: Editor = Editor.Instance()
	get currentComponent(): string | null {
		if (this.ready) {
			if (
				this.market &&
				this.editor.widgetLoaded[`${this.type}${this.componentVersion}`]
			) {
				return `${prefix1}${this.type}-${this.componentVersion}`
			}
			return `${prefix2}${this.type}`
		}
		return null
	}
	get animation(): any {
		if (this.config && this.config.animation) {
			return this.config.animation
		}
		return {}
	}
	get animationEnabled(): boolean {
		return this.animation.transitionEnable
	}
	beforeEnter(el, animation): void {
		el.style.animationDuration = ` ${animation.duration}ms`
		el.style.animationDelay = `${animation.delay}ms`
	}
	handleAnimationEnd(): void {
		this.replayAnimation = false
	}
	setAnimation(): void {
		if (!this.animationEnabled || !this.animation) {
			this.removeAnimation()
			return
		}
		const { enter, duration, delay } = this.animation
		let animationClass
		animationClass = `animate__${enter}`
		this.animationClass = `animate__animated ${animationClass}`
		const timer = setTimeout(() => {
			this.handleAnimationEnd()
			clearTimeout(timer)
		}, delay + duration + 300)
	}
	removeAnimation(): void {
		this.animationClass = null
	}
	loadMarket(): void {
		this.componentVersion = this.config.widget.componentVersion
		if (this.editor.widgetLoaded[`${this.type}${this.componentVersion}`]) {
			this.ready = true
		} else {
			use({
				componentEnTitle: this.type,
				componentVersion: this.config.widget.componentVersion,
			})
				.then(res => {
					const script = document.createElement('script')
					script.onload = () => {
						this.ready = true
						this.editor.updateWidgetLoaded(
							`${this.type}${this.componentVersion}`,
						)
					}
					if (res) {
						script.src = res.componentJsUrl
						document.head.appendChild(script)
					} else {
						console.error(
							`${this.type}${this.componentVersion}加载组件失败`,
						)
					}
				})
				.catch(() => {
					console.error(
						`${this.type}${this.componentVersion}加载组件失败`,
					)
				})
		}
	}
	@Watch('config.widget.componentVersion', { deep: true })
	onComponentVersionChange(): void {
		if (this.market) {
			this.ready = false
			this.loadMarket()
		}
	}
	@Watch('animationEnabled')
	onAnimationEnabledChange(value: boolean): void {
		value && this.setAnimation()
	}
	@Watch('ready')
	onReadyChange(): void {
		this.setAnimation()
	}
	@Watch('replayAnimation')
	onReplayAnimationChange(value: boolean): void {
		value ? this.setAnimation() : this.removeAnimation()
	}
	mounted(): void {
		if (this.market) {
			this.loadMarket()
		} else {
			if (
				this.editor.widgetLoaded[`${this.type}${this.componentVersion}`]
			) {
				this.ready = true
			} else {
				Vue.component(
					`${prefix2}${this.type}`,
					this.editor.local.components[this.type],
				)
				this.ready = true
			}
		}
	}
}
</script>
<style lang="scss">
.widget-part {
	position: absolute;
	top: 0;
	left: 0;
	font-size: 15px;
	line-height: 1.5em;
	color: rgb(0, 0, 0);
	text-align: center;
	backface-visibility: hidden;
	pointer-events: auto;
}
</style>
