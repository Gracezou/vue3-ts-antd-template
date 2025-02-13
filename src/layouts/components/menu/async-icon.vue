<script setup lang="ts">
import type { VNodeChild } from 'vue'
import * as icons from '@ant-design/icons-vue'
import { isFunction } from '@v-c/utils'

const props = defineProps<{
  icon: string | ((...args: any[]) => VNodeChild)
}>()
const Comp = computed(() => {
  if (isFunction(props.icon)) {
    const node = props.icon()
    if (node)
      return node
  }
  // 确保 `icons[props.icon]` 存在
  const IconComponent = (icons as any)[props.icon as string]
  return IconComponent || null // 避免 undefined
})
</script>

<template>
  <component :is="Comp" v-if="icon" />
</template>
