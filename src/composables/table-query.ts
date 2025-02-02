import type { PaginationProps } from 'ant-design-vue/es/pagination'
import type { TableRowSelection } from 'ant-design-vue/es/table/interface'
import { assign } from 'lodash'
import { ObjectUpdateProperty } from '~@/utils/tools'

/**
 * 表格选择框扩展类型
 */
export interface TableRowSelectionsProps extends TableRowSelection {
  /**
   * 选择行
   */
  selectedRows: any[]
  /**
   * 选择行key
   */
  selectedRowKeys: any[]
}

/**
 * 表格查询配置
 */
export interface TableQueryOptions {
  /**
   *查询接口
   */
  queryApi: (params?: any) => Promise<any>
  /**
   * 是否加载中
   */
  loading: boolean
  /**
   * 数据源
   */
  dataSource: any[]
  /**
   * 增添数据
   */
  pushData: any[]
  /**
   * 查询参数
   */
  queryParams: Record<string, any>
  /**
   * 选择配置
   */
  rowSelections: TableRowSelectionsProps
  /**
   * 挂载时进行查询
   */
  queryOnMounted: boolean
  /**
   *  分页配置
   */
  pagination: PaginationProps | false
  /**
   * 是否展开
   */
  expand: boolean
  /**
   * 展开变化
   */
  expandChange: () => void
  /**
   * 查询前回调
   */
  beforeQuery: () => void
  /**
   * 数据转换
   */
  transformData: (data: any) => any
  /**
   * 查询后回调
   */
  afterQuery: (record: Array<any>) => any
}

/**
 * 表格查询方法
 */
export function useTableQuery(_options: Partial<TableQueryOptions>) {
  const options = reactive<TableQueryOptions>(
    ObjectUpdateProperty(
      {
        queryApi: () => Promise.resolve({ result: [] }),
        loading: false,
        queryParams: {},
        dataSource: [],
        pushData: [],
        rowSelections: {
          selectedRowKeys: [],
          selectedRows: [],
          onChange(selectedRowKeys: any[], selectedRows: any[]) {
            options.rowSelections.selectedRowKeys = selectedRowKeys
            options.rowSelections.selectedRows = selectedRows
          },
        },
        queryOnMounted: true,
        pagination: false,
        expand: false,
        expandChange() {
          options.expand = !options.expand
        },
        beforeQuery() {},
        transformData(data: any) {
          return data
        },
        afterQuery(result: Array<any>) {
          return result
        },
      } as TableQueryOptions,
      _options as TableQueryOptions,
    ),
  )
  // 分页信息
  if (_options.pagination !== false) {
    options.pagination = assign(
      {
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '40'],
        current: 1,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `显示第 ${range[0]} 到第 ${range[1]} 条记录,  总共: ${total} 条记录`,
        onChange(current, pageSize) {
          if (options.pagination) {
            options.pagination.current = current
            options.pagination.pageSize = pageSize
          }
          query()
        },
      } as PaginationProps,
      _options.pagination,
    )
  }

  // 查询方法
  async function query() {
    if (options.loading)
      return
    options.loading = true

    try {
      await options.beforeQuery()
      // const params = {
      //   order: 'desc',
      //   column: 'createTime',
      //   ...options.queryParams,
      // } as any
      const params = options.queryParams
      // 处理params 参数值需要过滤掉undefined 且需要处理空格
      for (const key in params) {
        if (params[key] === undefined) {
          delete params[key]
        }
        else if (typeof params[key] === 'string') {
          params[key] = params[key].trim()
        }
      }
      if (options.pagination) {
        const page = options.pagination.current || 1
        params.offset = (page - 1) * (options.pagination.pageSize || 10)
        params.limit = options.pagination.pageSize
      }
      const result = await options.queryApi(options.transformData(params))
      if (!result) {
        options.dataSource = []
        return
      }
      let resultList = result || []
      if (options.pagination) {
        const { items, totalCount } = result
        options.pagination.total = totalCount ?? 0
        resultList = items || []
      }
      options.dataSource = (await options.afterQuery(resultList)) ?? []
    }
    catch (e) {
      throw new Error(`Query Failed: ${e}`)
    }
    finally {
      options.loading = false
    }
  }

  // 重置方法 重置查询条件, 不进行请求
  function resetQuery() {
    if (options.pagination) {
      options.pagination.current = 1
    }
    options.queryParams = {}
  }

  // 初始化查询
  function initQuery() {
    if (options.pagination) {
      options.pagination.current = 1
    }
    options.dataSource = []
    return query()
  }

  onMounted(() => {
    if (!options.queryOnMounted)
      return
    query()
  })

  return {
    query,
    resetQuery,
    initQuery,
    options,
  }
}
