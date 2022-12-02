import { TablePaginationConfig } from 'ant-design-vue'
import { FilterValue, SorterResult } from 'ant-design-vue/lib/table/interface'
import { LocationQueryRaw, RouteRecordName } from 'vue-router'
import { ITEMS_PER_PAGE_DEFAULT } from '~/constants'
import { IDataListFilter, IUser, Nullable } from '~/interfaces'
import { useDataListStore } from '~/store/stores/dataListStore'
import { removeUndefined } from '~/utils/formatter'

const useDataListSearch = () => {
  const dataListStore = useDataListStore()
  const router = useRouter()
  const route = useRoute()

  const { total, itemsPerPage, currentPage, sortBy, sortDirection } =
    storeToRefs(dataListStore)

  const pagination = computed<TablePaginationConfig>(() => {
    return {
      total: total.value,
      current: currentPage.value,
      pageSize: itemsPerPage.value,
      showSizeChanger: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    }
  })

  const dataListSearchOptions = computed(() => {
    const result: IDataListFilter = {
      limit: itemsPerPage.value,
      offset: itemsPerPage.value * (currentPage.value - 1)
    }

    if (sortBy.value && sortDirection.value) {
      result.sortBy = sortBy.value
      result.sortDirection = sortDirection.value
    }

    return result
  })

  const initFromQuery = () => {
    dataListStore.initFromQuery(route.query)
  }

  const onChange = (
    pagination: TablePaginationConfig,
    filter: Record<string, FilterValue | null>,
    sorter: SorterResult<IUser> | SorterResult<IUser>[]
  ) => {
    if (pagination?.pageSize !== itemsPerPage.value) {
      dataListStore.setItemsPerPage(pagination?.pageSize as number)
      dataListStore.setCurrentPage(1)
    } else {
      dataListStore.setCurrentPage(pagination?.current as number)
    }

    if (Object.keys(sorter).length) {
      const localSorter = sorter as SorterResult<IUser>
      dataListStore.setSortBy(localSorter.column?.key as Nullable<string>)
      dataListStore.setSortDirection(localSorter.order)
    } else {
      dataListStore.setSortBy(null)
      dataListStore.setSortDirection(null)
    }

    const query: LocationQueryRaw = { ...route.query }

    if (itemsPerPage.value !== ITEMS_PER_PAGE_DEFAULT) {
      query.limit = itemsPerPage.value
    } else {
      query.limit = undefined
    }

    if (currentPage.value !== 1) {
      query.offset = itemsPerPage.value * (currentPage.value - 1)
    } else {
      query.offset = undefined
    }

    if (sortBy.value) {
      query.sortBy = sortBy.value
    } else {
      query.sortBy = undefined
    }

    if (sortDirection.value) {
      query.sortDirection = sortDirection.value
    } else {
      query.sortDirection = undefined
    }

    pushRoute(removeUndefined(query))
  }

  const pushRoute = (query?: LocationQueryRaw) => {
    try {
      console.log({ query, routeName: route.name })
      router.push({ name: route.name as RouteRecordName, query })
    } catch (err) {
      console.log({ err })
    }
  }

  return {
    itemsPerPage,
    currentPage,
    sortBy,
    sortDirection,
    pagination,
    dataListSearchOptions,
    initFromQuery,
    onChange,
    pushRoute
  }
}

export default useDataListSearch
