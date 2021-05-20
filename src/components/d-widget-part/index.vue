<template lang="pug">
component.widget-part(
	:is="currentComponent",
	:class="animationClass",
	:id="config.widget && config.widget.id",
	v-bind="{ config, readonly, ...$attrs }",
	@widget-config-update="data => $emit('widget-config-update', data)",
	@query-start="querying = true",
	@query-end="querying = false",
	@query-failed="querying = true",
	@config-reset="$emit('config-reset')",
	v-on="$listeners",
	:key="`${config.widget.id}${updateKey}`",
	ref="widgets")
	slot
</template>
<script>
import Vue from 'vue'
import custom from '../../store/custom.store'
import scene from '../../store/scene.store'

const prefix1 = 'market-'
const prefix2 = 'eslinkv-'
export default {
	props: {
		market: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			required: true,
		},
		config: {
			type: Object,
			default: null,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			updateKey: 0,
			componentVersion: '',
			querying: false,
			queryFailed: false,
			replayAnimation: false,
			ready: false,
			animationClass: null,
			custom: custom.state,
			scene: scene.state,
		}
	},
	computed: {
		currentComponent() {
			if (this.ready) {
				if (
					this.market &&
					Vue.options.components[
						`${prefix1}${this.type}-${this.componentVersion}`
					]
				) {
					return `${prefix1}${this.type}-${this.componentVersion}`
				}
				return `${prefix2}${this.type}`
			}
			return null
		},
		animation() {
			return this.config.animation || {}
		},
		animationEnabled() {
			return this.animation.transitionEnable
		},
	},
	methods: {
		beforeEnter(el, animation) {
			el.style.animationDuration = ` ${animation.duration}ms`
			el.style.animationDelay = `${animation.delay}ms`
		},
		handleAnimationEnd() {
			this.replayAnimation = false
		},
		setAnimation() {
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
		},
		removeAnimation() {
			this.animationClass = null
		},
		loadMarket() {
			this.componentVersion = this.config.widget.componentVersion
			if (
				this.scene.widgetLoaded[`${this.type}${this.componentVersion}`]
			) {
				this.ready = true
			} else {
				this.$api.marketComponent
					.use({
						componentEnTitle: this.type,
						componentVersion: this.config.widget.componentVersion,
					})
					.then(res => {
						const script = document.createElement('script')
						script.onload = () => {
							this.ready = true
						}
						script.src = res.componentJsUrl
						document.head.appendChild(script)
					})
			}
		},
	},
	watch: {
		'config.widget.componentVersion': {
			handler: function () {
				if (this.market) {
					this.ready = false
					this.loadMarket()
				}
			},
			deep: true,
		},
		animationEnabled(value) {
			value && this.setAnimation()
		},
		ready() {
			this.setAnimation()
		},
		replayAnimation(value) {
			value ? this.setAnimation() : this.removeAnimation()
		},
	},
	mounted() {
		if (this.market) {
			this.loadMarket()
		} else {
			if (Vue.options.components[`${prefix2}${this.type}`]) {
				this.ready = true
			} else {
				Vue.component(
					`${prefix2}${this.type}`,
					this.custom.components[this.type],
				)
				this.ready = true
			}
		}
	},
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
}
</style>
