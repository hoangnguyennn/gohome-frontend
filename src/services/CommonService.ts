import {
  IAuthResponse,
  ICategoriesResponse,
  ICategoryCreate,
  IDistrictCreate,
  IDistrictsResponse,
  IPostCreate,
  IPostResponse,
  IPostsResponse,
  IUserResponse,
  IUsersResponse,
  IWardCreate,
  IWardResponse,
  IWardsResponse
} from '../interfaces'
import axiosClient from './axiosClient'

const login = (username: string, password: string) => {
  return axiosClient.post<IAuthResponse>('/auth/login', { username, password })
}

const getCurrentUser = () => {
  return axiosClient.get<IUserResponse>('/auth/me')
}

const getCategories = () => {
  return axiosClient.get<ICategoriesResponse>('/categories')
}

const createCategory = (category: ICategoryCreate) => {
  return axiosClient.post('/categories', category)
}

const getDistricts = () => {
  return axiosClient.get<IDistrictsResponse>('/districts')
}

const getWardsByDistrictId = (districtId: string) => {
  return axiosClient.get<IWardsResponse>(`/districts/${districtId}/wards`)
}

const createDistrict = (district: IDistrictCreate) => {
  return axiosClient.post<IDistrictsResponse>('/districts', district)
}

const getPosts = () => {
  return axiosClient.get<IPostsResponse>('/posts')
}

const getPostById = (id: string) => {
  return axiosClient.get<IPostResponse>(`/posts/${id}`)
}

const createPost = (post: IPostCreate) => {
  return axiosClient.post<IPostResponse>('/posts', post)
}

const getUsers = () => {
  return axiosClient.get<IUsersResponse>('/users')
}

const getWards = () => {
  return axiosClient.get<IWardsResponse>('/wards')
}

const createWard = (ward: IWardCreate) => {
  return axiosClient.post<IWardResponse>('/wards', ward)
}

const CommonService = {
  login,
  getCurrentUser,
  getCategories,
  createCategory,
  getDistricts,
  getWardsByDistrictId,
  createDistrict,
  getPosts,
  getPostById,
  createPost,
  getUsers,
  getWards,
  createWard
}
export default CommonService
