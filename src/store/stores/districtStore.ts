import { IDistrict, IDistrictCreate, IWard } from '~/interfaces'
import CommonService from '~/services/CommonService'

export const useDistrictStore = defineStore('districtStore', () => {
  const districts = ref<IDistrict[]>([])
  const wards = ref<IWard[]>([])

  const getDistricts = async () => {
    const response = await CommonService.getDistricts()
    districts.value = response.data.districts
  }

  const getWardsByDistrictId = async (districtId: string) => {
    wards.value = []
    const response = await CommonService.getWardsByDistrictId(districtId)
    wards.value = response.data.wards
  }

  const createDistrict = async (district: IDistrictCreate) => {
    return CommonService.createDistrict(district)
  }

  return {
    districts,
    wards,
    getDistricts,
    getWardsByDistrictId,
    createDistrict
  }
})
