<template>
	<component
		:is="currentComponent"
		:class="animationClass"
		:id="config.widget && config.widget.id"
		v-bind="{config,readonly,...$attrs}"
		@widget-config-update="data => $emit('widget-config-update', data)"
		@query-start="querying = true"
		@query-end="querying = false"
		@query-failed="querying = true"
		@config-reset="$emit('config-reset')"
		v-on="$listeners"
		:key="`${config.widget.id}${updateKey}`"
	>
		<slot/>
	</component>
</template>
<script>
	import Vue from 'vue'
	import custom from '../../store/custom.store'

	const prefix1 = 'market-'
	const prefix2 = 'eslinkv-'
	export default {
		props: {
			market: {},
			type: {
				type: String,
				required: true
			},
			config: {
				type: Object,
				default: null
			},
			readonly: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				updateKey: 0,
				componentVersion: '',
				querying: false,
				queryFailed: false,
				replayAnimation: false,
				ready: false,
				animationClass: null,
				custom: custom.state
			}
		},
		computed: {
			currentComponent () {
				if (this.ready) {
					if (this.market) {
						if (Vue.options.components[`${prefix1}${this.type}-${this.componentVersion}`]) {
							return `${prefix1}${this.type}-${this.componentVersion}`
						}
					}
					return `${prefix2}${this.type}`
				}
				return null
			},
			animation () {
				return this.config.animation || {}
			},
			animationEnabled () {
				return this.animation.transitionEnable
			}
		},
		methods: {
			beforeEnter (el, animation) {
				el.style.animationDuration = ` ${animation.duration}ms`
				el.style.animationDelay = `${animation.delay}ms`
			},
			handleAnimationEnd () {
				this.replayAnimation = false
			},
			// type: 入场动画 or 出场动画
			setAnimation (type) {
				if (!this.animationEnabled || !this.animation) {
					this.removeAnimation()
					return
				}
				const { enter, leave, duration, delay } = this.animation
				let animationClass
				const animationSource = type === 'enter' ? enter : leave
				if (!Array.isArray(animationSource)) {
					animationClass = `animate__${animationSource}`
				} else {
					animationClass = animationSource.map(item => `animate__${item}`).join(' ')
				}
				this.animationClass = `animate__animated ${animationClass}`
				const timer = setTimeout(() => {
					this.removeAnimation()
					this.handleAnimationEnd()
					clearTimeout(timer)
				}, delay + duration + 300)
			},
			removeAnimation () {
				this.animationClass = null
			}
		},
		watch: {
			animationEnabled (value) {
				value && this.setAnimation('enter')
			},
			ready () {
				this.setAnimation('enter')
			},
			replayAnimation (value) {
				value ? this.setAnimation('enter') : this.removeAnimation()
			}
		},
		mounted () {
			if (this.market) {
				this.componentVersion = this.config.widget.componentVersion
				if (Vue.options.components[`${prefix1}${this.type}-${this.componentVersion}`]) {
					this.ready = true
					return
				} else {
					this.$api.bussiness.detailMarket({
						componentEnTitle: this.type,
						componentVersion: this.config.widget.componentVersion
					}).then(res => {
						const script = document.createElement('script')
						script.onload = () => {
							this.ready = true
						}
						script.src = res.componentJsUrl
						document.head.appendChild(script)
					})
				}
			} else {
				if (Vue.options.components[`${prefix2}${this.type}`]) {
					this.ready = true
				} else {
					Vue.component(`${prefix2}${this.type}`, this.custom.components[this.type])
					this.ready = true
				}
			}
			this.$el.addEventListener('animationend', this.handleAnimationEnd)
		},
		beforeDestroy () {
			this.$el.removeEventListener('animationend', this.handleAnimationEnd)
		}
	}
</script>
<style lang="scss">
	.widget-part {
		font-size: 15px;
		line-height: 1.5em;
		color: rgb(0, 0, 0);
		text-align: center;
		backface-visibility: hidden;
	}
</style>
