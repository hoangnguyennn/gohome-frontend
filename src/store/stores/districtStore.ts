import { defineStore } from 'pinia'
import { IDistrict, IDistrictCreate } from '../../interfaces'
import CommonService from '../../services/CommonService'

export const useDistrictStore = defineStore('districtStore', () => {
  const districts = ref<IDistrict[]>([])

  const getDistricts = async () => {
    const response = await CommonService.getDistricts()
    districts.value = response.data.districts
  }

  const createDistrict = async (district: IDistrictCreate) => {
    return CommonService.createDistrict(district)
  }

  return {
    districts,
    getDistricts,
    createDistrict
  }
})
