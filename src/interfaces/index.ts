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
  hiddenAt?: string
  shownAt: string

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
  imagesId: string[]
}

export interface IPostResponse {
  post: IPost
}

export interface IPostsResponse {
  posts: IPost[]
}

export interface IUser {
  id: string
  username: string
  fullName?: string
  avatar?: string
  type: UserTypes
  createdAt: string
}

export interface IUserResponse {
  user: IUser
}

export interface IUsersResponse {
  users: IUser[]
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

export interface IAuthResponse {
  token: string
}

export type Nullable<T> = T | null
