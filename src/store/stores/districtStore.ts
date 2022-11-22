import { IDistrict, IDistrictRequest, IWard } from '~/interfaces'
import CommonService from '~/services/CommonService'
import { useDataListStore } from './dataListStore'

export const useDistrictStore = defineStore('districtStore', () => {
  const dataListStore = useDataListStore()
  const districts = ref<IDistrict[]>([])
  const wards = ref<IWard[]>([])

  const getDistricts = async () => {
    const response = await CommonService.getDistricts()
    districts.value = response.data.data
    dataListStore.setTotal(response.data.total)
  }

  const getDistrictById = (id: string) => {
    return CommonService.getDistrictById(id)
  }

  const getWardsByDistrictId = async (districtId: string) => {
    wards.value = []
    const response = await CommonService.getWardsByDistrictId(districtId)
    wards.value = response.data.data
  }

  const createDistrict = async (district: IDistrictRequest) => {
    return CommonService.createDistrict(district)
  }

  const updateDistrictById = (id: string, district: IDistrictRequest) => {
    return CommonService.updateDistrictById(id, district)
  }

  const reset = () => {
    districts.value = []
    wards.value = []
    dataListStore.reset()
  }

  return {
    districts,
    wards,
    createDistrict,
    getDistrictById,
    getDistricts,
    getWardsByDistrictId,
    updateDistrictById,
    reset
  }
})
