import { ICategory, ICategoryCreate } from '~/interfaces'
import CommonService from '~/services/CommonService'
import { useDataListStore } from './dataListStore'

export const useCategoryStore = defineStore('categoryStore', () => {
  const dataListStore = useDataListStore()
  const categories = ref<ICategory[]>([])

  const getCategories = async (params?: any) => {
    const response = await CommonService.getCategories(params)
    categories.value = response.data.data
    dataListStore.setTotal(response.data.total)
  }

  const getCategoryById = (id: string) => {
    return CommonService.getCategoryById(id)
  }

  const createCategory = (category: ICategoryCreate) => {
    return CommonService.createCategory(category)
  }

  const updateCategoryById = (id: string, category: ICategoryCreate) => {
    return CommonService.updateCategoryById(id, category)
  }

  const reset = () => {
    categories.value = []
    dataListStore.reset()
  }

  return {
    categories,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategoryById,
    reset
  }
})
