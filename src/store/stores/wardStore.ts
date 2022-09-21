import { IWard, IWardCreate } from '../../interfaces'
import CommonService from '../../services/CommonService'

export const useWardStore = defineStore('wardStore', () => {
  const wards = ref<IWard[]>([])

  const getWards = async () => {
    const response = await CommonService.getWards()
    wards.value = response.data.wards
  }

  const createWard = (ward: IWardCreate) => {
    return CommonService.createWard(ward)
  }

  return {
    wards,
    getWards,
    createWard
  }
})
