// 首字母大写转换
export function firstUpperCase(str: string) {
  return str.replace(/^\S/, s => s.toUpperCase())
}

export function apiTemplate(A: string) {
  const upperA = firstUpperCase(A)
  return `
import type { ${upperA}BO, ${upperA}Query } from './${A.toLowerCase()}.type'
enum ${upperA}API {
  list = '',
  detail = '',
  create${upperA} = '',
  update${upperA} = '',
  delete${upperA} = '',
}\n
export function query${upperA}List(params: ${upperA}Query) {
  return useGet(${upperA}API.list, params)
}\n
export function get${upperA}Detail(id: string) {
  return useGet(\`\${${upperA}API.detail}/\${id}\`)
}\n
export function create${upperA}(params: ${upperA}BO) {
  return usePost(${upperA}API.create${upperA}, params)
}\n
export function update${upperA}(params: ${upperA}BO) {
  return usePut(\`\${${upperA}API.update${upperA}}/\${params.id}\`, params)
}\n
export function delete${upperA}(id: string) {
  return useDelete(\`\${${upperA}API.delete${upperA}}/\${id}\`)
}
`
}

export function typeTemplate(A: string) {
  const upperA = firstUpperCase(A)
  return `
export interface ${upperA}BO {
  id: string
}\n
export interface ${upperA}Query {
  page: number
  size: number
}
`
}

export function dataTemplate() {
  return `
import type { ColumnsType } from 'ant-design-vue/es/table'
export const listColumns: ColumnsType = []
  `
}

export function vueTemplate(A: string) {
  const upperA = firstUpperCase(A)
  return `
<script setup lang="ts">
import {
  delete${upperA},
  create${upperA},
  query${upperA}List,
  update${upperA},
} from './${A}.api'
import { listColumns } from './${A}.data'
import FormModal from './components/form-modal.vue'
import { useTableQuery } from '~@/composables/table-query'
const { options, initQuery, resetQuery } = useTableQuery({
  queryApi: query${upperA}List,
  queryParams: {},
})\n
const modelRef = ref<InstanceType<typeof FormModal>>()
const { createHandler, updateHandler, deleteHandler, saveHandler } = useTableModalActions({
  modelRef,
  createAction: create${upperA},
  updateAction: update${upperA},
  saveActionSuccess: initQuery,
  deleteAction: delete${upperA},
  deleteActionSuccess: initQuery,
})\n
</script>\n
<template>
  <a-card mb-4>
    <a-form :label-col="{ span: 5 }">
      <a-row :gutter="[15, 0]">
        <a-col :span="6">
          <a-form-item label="查询" class="mb-0" />
        </a-col>
        <a-col :span="12">
          <a-button :loading="options.loading" type="primary" @click="initQuery">
            查询
          </a-button>
          <a-button class="ml-16px" @click="resetQuery">
            重置
          </a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-card>\n
  <a-card>
    <template #title>
      <a-space>
        <a-button type="primary" @click="createHandler">
          新增
        </a-button>
      </a-space>
    </template>
    <a-table
      :loading="options.loading" :columns="listColumns" :data-source="options.dataSource"
      :pagination="options.pagination" :scroll="{ x: 800 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <template #split>
             <a-divider type="vertical" />
            </template>
            <a-button type="link" @click="updateHandler(record.id)">
              编辑
            </a-button>
            <a-button type="link" danger @click="deleteHandler(record.id)">
             删除
            </a-button>
           </a-space>
        </template>
      </template>
    </a-table>
    <FormModal ref="modelRef" @update="saveHandler" />
  </a-card>
</template>\n`
}

export function formModalTemplate(A: string) {
  const upperA = firstUpperCase(A)
  return `<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import type { Rule } from 'ant-design-vue/es/form'
import { get${upperA}Detail } from '../${A}.api'
import type { ${upperA}BO } from '../${A}.type'

const emits = defineEmits(['update'])
const formRef = ref<FormInstance>()
const formData = reactive<${upperA}BO>({
  id: '',
})
const rules: Record<string, Rule[]> = {
}
const labelCol = { style: { width: '120px' } }
const wrapperCol = { span: 18 }
function submitAction(data: ${upperA}BO) {
  const params = cloneDeep(data) as any
  emits('update', params)
}
const { visible, openModal, closeModal, updateHandler } = useFormModalActions({
  formRef,
  formData,
  getDetailAction: get${upperA}Detail,
  transformFormData(data: ${upperA}BO) {
    return data
  },
  submitAction,
})
const title = computed(() => (formData.id ? '编辑' : '新增'))
function open(id: string) {
  return openModal(id)
}
function close() {
  return closeModal()
}
defineExpose({ open, close })
</script>

<template>
  <a-modal v-model:open="visible" :title="title" :mask-closable="false" :width="600" @ok="updateHandler" @cancel="close">
    <a-form
      ref="formRef" :model="formData" :rules="rules" class="w-full mt-30px" :label-col="labelCol"
      :wrapper-col="wrapperCol"
    />
  </a-modal>
</template>

`
}
