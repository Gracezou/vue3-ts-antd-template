<script setup lang="ts">
import { useLayoutState } from '../../basic-layout/context'

const { logo, title, layout, isMobile } = useLayoutState()
const cls = computed(() => ({
  'ant-pro-global-header-logo': layout.value === 'mix' || isMobile.value,
  'ant-pro-top-nav-header-logo': layout.value === 'top' && !isMobile.value,
}))
const version = __APP_VERSION__
</script>

<template>
  <div :class="cls">
    <a c-primary>
      <img :src="logo">
      <h1 v-if="!isMobile">
        {{ title }}
        <span v-if="version" class="font-size-3">v{{ version }}</span>
      </h1>
    </a>
  </div>
</template>
