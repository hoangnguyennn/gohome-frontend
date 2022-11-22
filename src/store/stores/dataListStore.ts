import { LocationQueryRaw } from 'vue-router'
import { ITEMS_PER_PAGE_DEFAULT } from '~/constants'
import { Nullable } from '~/interfaces'

export const useDataListStore = defineStore('dataListStore', () => {
  const total = ref<number>(0)
  const currentPage = ref<number>(1)
  const itemsPerPage = ref<number>(ITEMS_PER_PAGE_DEFAULT)
  const sortBy = ref<Nullable<string>>(null)
  const sortDirection = ref<Nullable<string>>(null)

  const setTotal = (newValue: number) => {
    total.value = newValue
  }

  const setCurrentPage = (newValue: number) => {
    currentPage.value = newValue
  }

  const setItemsPerPage = (newValue: number) => {
    itemsPerPage.value = newValue
  }

  const setSortBy = (newValue: Nullable<string>) => {
    sortBy.value = newValue
  }

  const setSortDirection = (newValue: Nullable<string>) => {
    sortDirection.value = newValue
  }

  const initFromQuery = (query: LocationQueryRaw) => {
    const limit = Number(query.limit) || ITEMS_PER_PAGE_DEFAULT
    const offset = Number(query.offset) || 0
    const querySortBy = String(query.sortBy) || null
    const querySortDirection = String(query.sortDirection) || null

    itemsPerPage.value = limit
    currentPage.value = Math.floor(offset / limit) + 1
    sortBy.value = querySortBy
    sortDirection.value = querySortDirection
  }

  const reset = () => {
    total.value = 0
    currentPage.value = 1
    itemsPerPage.value = ITEMS_PER_PAGE_DEFAULT
    sortBy.value = null
    sortDirection.value = null
  }

  return {
    total,
    currentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    setTotal,
    setCurrentPage,
    setItemsPerPage,
    setSortBy,
    setSortDirection,
    initFromQuery,
    reset
  }
})
