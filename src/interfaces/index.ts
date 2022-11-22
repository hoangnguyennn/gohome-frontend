import {
  DistrictTypes,
  PostVerifyStatuses,
  UserTypes,
  WardTypes
} from './enums'

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
  data: ICategory
}

export interface IDataListResponse<T> {
  total: number
  data: T[]
}

export interface IDistrict {
  id: string
  name: string
  type: DistrictTypes
}

export interface IDistrictRequest {
  name: string
  type: DistrictTypes
}

export interface IDistrictResponse {
  data: IDistrict
}

export interface IImage {
  id: string
  url: string
}

export interface IPost {
  id: string
  code: string
  title: string
  slug: string
  price: number
  commission: number
  acreage: number
  bedroom: number
  bathroom: number
  floor: number
  description: string
  ownerName: string
  ownerPhone: string
  ownerAddress: string
  verifyStatus: PostVerifyStatuses
  denyReason: string
  isCheap: boolean
  isFeatured: boolean
  isRented: boolean
  isHide: boolean
  rentedAt?: string
  openedForRentAt: string
  createdAt: string
  updatedAt: string

  category?: ICategory
  ward?: IWard
  createdBy?: IUser
  updatedBy?: IUser
  images?: IImage[]
}

export interface IPostCreate {
  title: string
  categoryId: string
  wardId: string
  price: number
  commission: number
  acreage: number
  bedroom: number
  bathroom: number
  floor: number
  description: string
  ownerName: string
  ownerPhone: string
  ownerAddress: string
  isCheap: boolean
  isFeatured: boolean
  isRented?: boolean
  isHide?: boolean
  imagesId: string[]
}

export interface IPostResponse {
  data: IPost
}

export interface IUser {
  id: string
  username: string
  fullName?: string
  avatar?: string
  type: UserTypes
  isVerified: boolean
  createdAt: string
}

export interface IUserResponse {
  data: IUser
}

export interface IWard {
  id: string
  name: string
  type: WardTypes
  district?: IDistrict
}

export interface IWardRequest {
  name: string
  type: WardTypes
  districtId: string
}

export interface IWardResponse {
  data: IWard
}

export interface IWardsResponse {
  data: IWard[]
}

export interface IErrorResponse {
  code: number
  message: string
}

export interface IMenuItem {
  id: string | number
  title: string
  icon?: any
  link?: string
  children?: IMenuItem[]
  permissions?: UserTypes[]
}

export interface IAuthResponse {
  token: string
}

export interface IUpdateInfo {
  fullName?: string
  avatar?: string
}

export interface IChangePassword {
  newPassword: string
}

export interface IFormConfirmState<T> {
  value: Nullable<T>
  isOpen: boolean
}

export type Nullable<T> = T | null
