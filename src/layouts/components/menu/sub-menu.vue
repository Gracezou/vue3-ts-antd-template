<script setup lang="ts">
import type { MenuDataItem } from '~@/pages/common/type'
import { isUrl } from '@v-c/utils'
import AsyncIcon from './async-icon.vue'

withDefaults(defineProps<{ item: MenuDataItem, link?: boolean }>(), {
  link: true,
})
function renderTitle(item: MenuDataItem) {
  return item.title
}
</script>

<template>
  <template v-if="item.children && !item.hideChildrenInMenu">
    <a-sub-menu :key="item.path">
      <template v-if="item.icon" #icon>
        <AsyncIcon :icon="item.icon" />
      </template>
      <template #title>
        {{ renderTitle(item) }}
      </template>
      <template v-for="menu in item.children">
        <template v-if="!menu.hideInMenu">
          <template v-if="menu.children">
            <sub-menu :key="menu.path" :item="menu" />
          </template>
          <template v-else>
            <a-menu-item :key="menu.path">
              <template v-if="menu.icon" #icon>
                <AsyncIcon :icon="menu.icon" />
              </template>
              <template v-if="!isUrl(menu.path)">
                <RouterLink v-if="link" :to="menu.path">
                  {{ renderTitle(menu) }}
                </RouterLink>
                <template v-else>
                  {{ renderTitle(menu) }}
                </template>
              </template>
              <template v-else>
                <a :href="menu.path" :target="menu.target ?? '_blank'">
                  {{ renderTitle(menu) }}
                </a>
              </template>
            </a-menu-item>
          </template>
        </template>
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="item.path">
      <template v-if="item.icon" #icon>
        <AsyncIcon :icon="item.icon" />
      </template>
      <template v-if="!isUrl(item.path)">
        <RouterLink v-if="link" :to="item.path">
          {{ renderTitle(item) }}
        </RouterLink>
        <template v-else>
          {{ renderTitle(item) }}
        </template>
      </template>
      <template v-else>
        <a :href="item.path" :target="item.target ?? '_blank'">
          {{ renderTitle(item) }}
        </a>
      </template>
    </a-menu-item>
  </template>
</template>
