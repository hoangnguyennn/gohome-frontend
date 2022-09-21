import {
  ICategoriesResponse,
  ICategoryCreate,
  IDistrictCreate,
  IDistrictsResponse,
  IWardCreate,
  IWardResponse,
  IWardsResponse
} from '../interfaces'
import axiosClient from './axiosClient'

const getCategories = () => {
  return axiosClient.get<ICategoriesResponse>('/categories')
}

const createCategory = (category: ICategoryCreate) => {
  return axiosClient.post('/categories', category)
}

const getDistricts = () => {
  return axiosClient.get<IDistrictsResponse>('/districts')
}

const createDistrict = (district: IDistrictCreate) => {
  return axiosClient.post<IDistrictsResponse>('/districts', district)
}

const getWards = () => {
  return axiosClient.get<IWardsResponse>('/wards')
}

const createWard = (ward: IWardCreate) => {
  return axiosClient.post<IWardResponse>('/wards', ward)
}

const CommonService = {
  getCategories,
  createCategory,
  getDistricts,
  createDistrict,
  getWards,
  createWard
}
export default CommonService
