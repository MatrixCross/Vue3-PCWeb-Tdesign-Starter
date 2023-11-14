<template>
  <t-config-provider :global-config="getComponentsLocale">
    <router-view :key="locale" :class="[mode]"
  /></t-config-provider>
</template>
<script setup lang="ts">
const store = useSettingStore();

const mode = computed(() => {
  return store.displayMode;
});
const { getComponentsLocale, locale } = useLocale();
</script>
<style lang="less" scoped>
#nprogress .bar {
  background: var(--td-brand-color) !important;
}
</style>
