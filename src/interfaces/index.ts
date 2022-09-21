import { DistrictTypes } from './enums'

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
