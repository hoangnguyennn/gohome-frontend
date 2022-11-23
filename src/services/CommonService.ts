import {
  IAuthResponse,
  ICategory,
  ICategoryCreate,
  ICategoryResponse,
  IChangePassword,
  IDataListResponse,
  IDistrict,
  IDistrictRequest,
  IDistrictResponse,
  IPost,
  IPostCreate,
  IPostResponse,
  IUpdateInfo,
  IUser,
  IUserResponse,
  IWard,
  IWardRequest,
  IWardResponse,
  IWardsResponse
} from '~/interfaces'
import axiosClient from './axiosClient'

const login = (username: string, password: string) => {
  return axiosClient.post<IAuthResponse>('/auth/login', { username, password })
}

const register = (username: string, password: string) => {
  return axiosClient.post<IAuthResponse>('/auth/register', {
    username,
    password
  })
}

const getCurrentUser = () => {
  return axiosClient.get<IUserResponse>('/auth/me')
}

const getCategories = (params?: any) => {
  return axiosClient.get<IDataListResponse<ICategory>>('/categories', {
    params
  })
}

const getCategoryById = (id: string) => {
  return axiosClient.get<ICategoryResponse>(`/categories/${id}`)
}

const createCategory = (category: ICategoryCreate) => {
  return axiosClient.post('/categories', category)
}

const updateCategoryById = (id: string, category: ICategoryCreate) => {
  return axiosClient.put(`/categories/${id}`, category)
}

const getDistricts = (params?: any) => {
  return axiosClient.get<IDataListResponse<IDistrict>>('/districts', { params })
}

const getDistrictById = (id: string) => {
  return axiosClient.get<IDistrictResponse>(`/districts/${id}`)
}

const getWardsByDistrictId = (districtId: string) => {
  return axiosClient.get<IWardsResponse>(`/districts/${districtId}/wards`)
}

const createDistrict = (district: IDistrictRequest) => {
  return axiosClient.post<IDistrictResponse>('/districts', district)
}

const updateDistrictById = (id: string, districtUpdate: IDistrictRequest) => {
  return axiosClient.put<IDistrictRequest>(`/districts/${id}`, districtUpdate)
}

const getPosts = (params?: any) => {
  return axiosClient.get<IDataListResponse<IPost>>('/posts', { params })
}

const getRentedPosts = (params?: any) => {
  return axiosClient.get<IDataListResponse<IPost>>('/posts/rented', { params })
}

const getPostById = (id: string) => {
  return axiosClient.get<IPostResponse>(`/posts/${id}`)
}

const createPost = (post: IPostCreate) => {
  return axiosClient.post<IPostResponse>('/posts', post)
}

const updatePostById = (id: string, post: IPostCreate) => {
  return axiosClient.put<IPostResponse>(`/posts/${id}`, post)
}

const approvePost = (id: string) => {
  return axiosClient.post<IPostResponse>(`/posts/${id}/approve`)
}

const denyPost = (id: string, reason: string) => {
  return axiosClient.post<IPostResponse>(`/posts/${id}/deny`, { reason })
}

const markAsRented = (id: string) => {
  return axiosClient.post<IPostResponse>(`/posts/${id}/mark-as-rented`)
}

const getUsers = (params?: any) => {
  return axiosClient.get<IDataListResponse<IUser>>('/users', { params })
}

const getUserById = (id: string) => {
  return axiosClient.get<IUserResponse>(`/users/${id}`)
}

const verifyUser = (id: string) => {
  return axiosClient.post<IUserResponse>(`/users/${id}/verify`)
}

const getWards = (params?: any) => {
  return axiosClient.get<IDataListResponse<IWard>>('/wards', { params })
}

const getWardById = (id: string) => {
  return axiosClient.get<IWardResponse>(`/wards/${id}`)
}

const createWard = (ward: IWardRequest) => {
  return axiosClient.post<IWardResponse>('/wards', ward)
}

const updateWardById = (id: string, ward: IWardRequest) => {
  return axiosClient.put<IWardResponse>(`/wards/${id}`, ward)
}

const changePassword = (changePasswordInfo: IChangePassword) => {
  return axiosClient.post<IUserResponse>(
    '/account/change-password',
    changePasswordInfo
  )
}

const updateInfo = (userInfo: IUpdateInfo) => {
  return axiosClient.post<IUserResponse>('/account/update-info', userInfo)
}

const CommonService = {
  approvePost,
  changePassword,
  createCategory,
  createDistrict,
  createPost,
  createWard,
  denyPost,
  getCategories,
  getCategoryById,
  getCurrentUser,
  getDistrictById,
  getDistricts,
  getPostById,
  getPosts,
  getRentedPosts,
  getUserById,
  getUsers,
  getWardById,
  getWards,
  getWardsByDistrictId,
  login,
  markAsRented,
  register,
  updateCategoryById,
  updateDistrictById,
  updateInfo,
  updatePostById,
  updateWardById,
  verifyUser
}
export default CommonService
