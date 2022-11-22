import { IDistrict, IDistrictRequest, IWard } from '~/interfaces'
import CommonService from '~/services/CommonService'

export const useDistrictStore = defineStore('districtStore', () => {
  const districts = ref<IDistrict[]>([])
  const wards = ref<IWard[]>([])

  const getDistricts = async () => {
    const response = await CommonService.getDistricts()
    districts.value = response.data.data
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

  return {
    districts,
    wards,
    createDistrict,
    getDistrictById,
    getDistricts,
    getWardsByDistrictId,
    updateDistrictById
  }
})
