import { IDistrict, IWard, IWardRequest } from '~/interfaces'
import CommonService from '~/services/CommonService'
import { useDataListStore } from './dataListStore'

export const useWardStore = defineStore('wardStore', () => {
  const dataListStore = useDataListStore()
  const wards = ref<IWard[]>([])
  const districts = ref<IDistrict[]>([])

  const getDistricts = async () => {
    const response = await CommonService.getDistricts()
    districts.value = response.data.data
  }

  const getWards = async (params?: any) => {
    const response = await CommonService.getWards(params)
    wards.value = response.data.data
    dataListStore.setTotal(response.data.total)
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

  const reset = () => {
    wards.value = []
    dataListStore.reset()
  }

  return {
    districts,
    wards,
    createWard,
    getDistricts,
    getWardById,
    getWards,
    updateWardById,
    reset
  }
})
