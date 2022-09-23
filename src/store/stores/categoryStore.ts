import { ICategory, ICategoryCreate } from '~/interfaces'
import CommonService from '~/services/CommonService'

export const useCategoryStore = defineStore('categoryStore', () => {
  const categories = ref<ICategory[]>([])

  const getCategories = async () => {
    const response = await CommonService.getCategories()
    categories.value = response.data.categories
  }

  const createCategory = (category: ICategoryCreate) => {
    return CommonService.createCategory(category)
  }

  return {
    categories,
    getCategories,
    createCategory
  }
})
