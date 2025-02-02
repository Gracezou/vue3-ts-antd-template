import type { FormInstance } from 'ant-design-vue'
import { assign } from 'lodash-es'
import type { ShallowReactive } from 'vue'
import { ObjectInitTransform, ObjectUpdateProperty } from '~@/utils/tools'

interface BO {
  id?: string
}
export interface FormModalActions<T, K> {
  formRef: Ref<FormInstance | undefined>
  formData: ShallowReactive<T>
  defaultFormData?: T
  getDetailAction?: (id: string) => Promise<any>
  transformFormData?: (data: K) => T
  submitAction?: (data: T) => void
}
export function useFormModalActions<T extends BO, K>(
  props: Partial<FormModalActions<T, K>>,
) {
  const message = useMessage()
  const visible = ref(false)
  const editable = ref(false)
  const loading = ref(false)
  const {
    formRef,
    formData,
    defaultFormData,
    getDetailAction,
    transformFormData,
    submitAction,
  } = assign(
    {
      formData: {} as T,
      defaultFormData: {} as T,
      getDetailAction: () => Promise.resolve({}),
      transformFormData: (data: K) => data as unknown as T,
      submitAction: (_: T) => Promise.resolve({}),
    },
    props,
  )

  const openModal = (id?: string) => {
    if (!id) {
      editable.value = false
      ObjectInitTransform(formData)
      if (defaultFormData) {
        ObjectUpdateProperty(formData, defaultFormData)
      }
      visible.value = true
      return Promise.resolve(formData)
    }
    loading.value = true
    return getDetailAction(id)
      .then((data) => {
        if (!data)
          return message.error('获取详情失败')
        ObjectUpdateProperty(formData, transformFormData(data))
        formData.id = id
        editable.value = true
        visible.value = true
        return formData
      })
      .finally(() => (loading.value = false))
  }

  const closeModal = () => {
    if (formRef && formRef.value)
      formRef.value.resetFields()

    visible.value = false
  }

  // 保存提交
  function updateHandler() {
    if (!formRef || !formRef.value)
      return submitAction && submitAction(formData)
    if (!formRef.value)
      return
    formRef.value
      .validate()
      .then(() => submitAction && submitAction(formData))
  }

  return {
    visible,
    loading,
    openModal,
    closeModal,
    updateHandler,
    editable,
  }
}
