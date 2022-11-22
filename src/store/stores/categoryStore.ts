import { ICategory, ICategoryCreate } from '~/interfaces'
import CommonService from '~/services/CommonService'

export const useCategoryStore = defineStore('categoryStore', () => {
  const categories = ref<ICategory[]>([])

  const getCategories = async () => {
    const response = await CommonService.getCategories()
    categories.value = response.data.data
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

  return {
    categories,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategoryById
  }
})
