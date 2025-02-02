import type { ResponseBody } from '~@/utils/request'
import { Modal } from 'ant-design-vue'
import { assign } from 'lodash-es'

interface BO {
  id?: string
}
export interface TableActions<_, K> {
  modelRef: Ref<any>
  createAction: (data: K) => Promise<ResponseBody>
  updateAction: (data: K) => Promise<ResponseBody>
  deleteAction: (id: string) => Promise<ResponseBody>
  saveActionSuccess?: (result: ResponseBody) => void
  deleteActionSuccess?: (result: ResponseBody) => void
}
export function useTableModalActions<T, K extends BO>(
  props: Partial<TableActions<T, K>>,
) {
  const message = useMessage()
  const {
    modelRef,
    createAction,
    updateAction,
    deleteAction,
    saveActionSuccess,
    deleteActionSuccess,
  } = assign(
    {
      createAction: () => Promise.resolve({}),
      updateAction: () => Promise.resolve({}),
      deleteAction: () => Promise.resolve({}),
    },
    props,
  ) as TableActions<T, K>

  // 新增弹窗
  const createHandler = () => {
    if (modelRef.value) {
      modelRef.value.open()
    }
  }

  // 编辑弹窗
  function updateHandler(id: string, record?: K) {
    if (modelRef.value) {
      modelRef.value.open(id, record)
    }
  }

  // 删除
  function deleteHandler(id: string) {
    Modal.confirm({
      title: '确认删除',
      content: '是否删除选中数据',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return deleteAction(id).then((res) => {
          message.success('删除成功')
          if (deleteActionSuccess) {
            deleteActionSuccess(res)
          }
        })
      },
    })
  }

  // 保存提交
  function saveHandler(data: K) {
    Promise.resolve()
      .then(() => (data.id ? updateAction(data) : createAction(data)))
      .then((res) => {
        message.success('保存成功')
        if (modelRef.value) {
          modelRef.value.close()
        }
        if (saveActionSuccess) {
          saveActionSuccess(res)
        }
      })
  }

  return {
    createHandler,
    updateHandler,
    deleteHandler,
    saveHandler,
  }
}
