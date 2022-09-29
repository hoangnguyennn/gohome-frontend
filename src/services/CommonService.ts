import {
  IAuthResponse,
  ICategoriesResponse,
  ICategoryCreate,
  ICategoryResponse,
  IDistrictRequest,
  IDistrictResponse,
  IDistrictsResponse,
  IPostCreate,
  IPostResponse,
  IPostsResponse,
  IUserResponse,
  IUsersResponse,
  IWardCreate,
  IWardResponse,
  IWardsResponse
} from '~/interfaces'
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

const getCategoryById = (id: string) => {
  return axiosClient.get<ICategoryResponse>(`/categories/${id}`)
}

const createCategory = (category: ICategoryCreate) => {
  return axiosClient.post('/categories', category)
}

const updateCategoryById = (id: string, category: ICategoryCreate) => {
  return axiosClient.put(`/categories/${id}`, category)
}

const getDistricts = () => {
  return axiosClient.get<IDistrictsResponse>('/districts')
}

const getDistrictById = (id: string) => {
  return axiosClient.get<IDistrictResponse>(`/districts/${id}`)
}

const getWardsByDistrictId = (districtId: string) => {
  return axiosClient.get<IWardsResponse>(`/districts/${districtId}/wards`)
}

const createDistrict = (district: IDistrictRequest) => {
  return axiosClient.post<IDistrictsResponse>('/districts', district)
}

const updateDistrictById = (id: string, districtUpdate: IDistrictRequest) => {
  return axiosClient.put<IDistrictRequest>(`/districts/${id}`, districtUpdate)
}

const getPosts = () => {
  return axiosClient.get<IPostsResponse>('/posts')
}

const getRentedPosts = () => {
  return axiosClient.get<IPostsResponse>('/posts/rented')
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
  approvePost,
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
  getUsers,
  getWards,
  getWardsByDistrictId,
  login,
  markAsRented,
  updateCategoryById,
  updateDistrictById,
  updatePostById
}
export default CommonService
