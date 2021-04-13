<template lang="pug">
.home-container
	d-detail
	d-screen
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import dScreen from '../../components/d-screen/index.vue'
import market from '../../plugins/market'
import dDetail from '../../components/d-detail/index.vue'

@Component({
	components: { dScreen, dDetail },
})
export default class editor extends Vue {
	mounted() {
		market()
	}
}
</script>
<style lang="scss">
.home-container {
	height: 100%;
	overflow: hidden;
}
</style>
