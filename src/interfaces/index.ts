import { DistrictTypes, WardTypes } from './enums'

export interface ICategory {
  id: string
  name: string
  code: string
}

export interface ICategoryCreate {
  name: string
  code: string
}

export interface ICategoryResponse {
  category: ICategory
}

export interface ICategoriesResponse {
  categories: ICategory[]
}

export interface IDistrict {
  id: string
  name: string
  type: DistrictTypes
}

export interface IDistrictCreate {
  name: string
  type: DistrictTypes
}

export interface IDistrictsResponse {
  districts: IDistrict[]
}

export interface IDistrictResponse {
  district: IDistrict
}

export interface IWard {
  id: string
  name: string
  type: WardTypes
  district?: IDistrict
}

export interface IWardCreate {
  name: string
  type: WardTypes
  districtId: string
}

export interface IWardsResponse {
  wards: IWard[]
}

export interface IWardResponse {
  ward: IWard
}

export interface IErrorResponse {
  code: number
  message: string
}

export interface IMenuItem {
  id: string | number
  title: string
  link?: string
  children?: IMenuItem[]
}
