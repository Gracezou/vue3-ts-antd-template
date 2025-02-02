<script setup lang='ts'>
import * as Icons from '@ant-design/icons-vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})

const componentIcon = computed(() => {
  let icon = props.type
  // FIXME 兼容以前icon配置的写法,  以后统一使用ant-icon的驼峰type
  if (icon.includes(':'))
    icon = icon.split(':')[1]
  // FIXME 兼容以前icon配置的写法, 以后统一使用ant-icon的驼峰type
  if (icon.includes('-')) {
    icon = icon.split('-').map((item) => {
      if (item.length === 0)
        return item
      const str = item.toLocaleLowerCase()
      return str.replace(str[0], str[0].toUpperCase())
    }).join('')
  }
  const antIcon: { [key: string]: any } = Icons
  return antIcon[icon]
})
</script>

<template>
  <component :is="componentIcon" />
</template>
