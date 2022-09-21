import { IDistrictCreate, IDistrictsResponse } from '../interfaces'
import axiosClient from './axiosClient'

const getDistricts = () => {
  return axiosClient.get<IDistrictsResponse>('/districts')
}

const createDistrict = (district: IDistrictCreate) => {
  return axiosClient.post<IDistrictsResponse>('/districts', district)
}

const CommonService = {
  getDistricts,
  createDistrict
}
export default CommonService
