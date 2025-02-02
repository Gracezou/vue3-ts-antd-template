<script lang="ts" setup>
withDefaults(
  defineProps<{
    text?: string
    color?: string
    width?: string
    height?: string
  }>(),
  {
    text: '',
    color: '#000',
    width: '5px',
    height: '5px',
  },
)
</script>

<template>
  <div class="status_box">
    <div class="circle" :style="{ backgroundColor: color, width, height }" />
    <div class="text">
      {{ text }}
    </div>
  </div>
</template>

<style scoped lang="less">
.status_box {
  display: flex;
  align-items: center;
  justify-content: center;
  .circle {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
</style>
