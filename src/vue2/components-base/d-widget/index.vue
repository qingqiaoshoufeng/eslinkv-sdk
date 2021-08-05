<template lang="pug" functional>
eslinkv-group(v-if="props.widgetType === 'group'", v-bind="{ ...props }")
eslinkv-normal(v-else, v-bind="{ ...props }")
</template>
