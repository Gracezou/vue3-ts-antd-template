<script setup lang="ts">
import type { RadioChangeEvent } from 'ant-design-vue'

type SupportType = 'radio' | 'select' | 'radio-button'
type SupportMode = 'multiple'
const props = defineProps({
  dictCode: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<SupportType>,
    default: 'select',
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  mode: {
    type: String as PropType<SupportMode>,
    default: '',
  },
})

const emits = defineEmits(['update'])
const { getDictListByCode } = useUserStore()
const options = computed(() => getDictListByCode(props.dictCode))
// 单选框改变事件
function changeRadioHandler(e: RadioChangeEvent) {
  emits('update', e.target.value)
}
</script>

<template>
  <a-radio-group
    v-if="type === 'radio'"
    v-bind="$attrs"
    class="dict-code-wrapper"
    @change="changeRadioHandler"
  >
    <a-radio v-for="item in options" :key="item.value" :value="item.value">
      {{ item.label }}
    </a-radio>
  </a-radio-group>
  <a-select
    v-else-if="type === 'select'"
    class="dict-code-wrapper"
    :mode="mode"
    v-bind="$attrs"
    :options="options"
    :placeholder="placeholder"
    :get-popup-container="(trigger: any) => trigger.parentNode"
  />
  <a-radio-group
    v-else
    v-bind="$attrs"
    class="dict-code-wrapper"
    @change="changeRadioHandler"
  >
    <a-radio-button
      v-for="item in options"
      :key="item.value"
      :value="item.value"
    >
      {{ item.label }}
    </a-radio-button>
  </a-radio-group>
</template>

<style lang="less" scoped>
.dict-code-wrapper {
  width: 100%;
}
</style>
