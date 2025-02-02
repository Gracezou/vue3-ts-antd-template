<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '400px',
  },
})

const chart = ref(null)
let chartInstance = null

function resizeChart() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  chartInstance = echarts.init(chart.value)
  chartInstance.setOption(props.options)
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  if (chartInstance) {
    chartInstance.dispose()
  }
})

watch(
  () => props.options,
  (newOptions) => {
    if (chartInstance) {
      chartInstance.setOption(newOptions)
    }
  },
  { deep: true },
)
</script>

<template>
  <div ref="chart" :style="{ width, height }" />
</template>
