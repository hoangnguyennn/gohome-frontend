import { IWard, IWardRequest } from '~/interfaces'
import CommonService from '~/services/CommonService'

export const useWardStore = defineStore('wardStore', () => {
  const wards = ref<IWard[]>([])

  const getWards = async () => {
    const response = await CommonService.getWards()
    wards.value = response.data.wards
  }

  const getWardById = (id: string) => {
    return CommonService.getWardById(id)
  }

  const createWard = (ward: IWardRequest) => {
    return CommonService.createWard(ward)
  }

  const updateWardById = (id: string, wardUpdate: IWardRequest) => {
    return CommonService.updateWardById(id, wardUpdate)
  }

  return {
    wards,
    createWard,
    getWardById,
    getWards,
    updateWardById
  }
})
