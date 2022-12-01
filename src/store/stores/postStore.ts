import { ICategory, IPost, IPostCreate, IUser, IWard } from '~/interfaces'
import CommonService from '~/services/CommonService'
import { useDataListStore } from './dataListStore'

export const usePostStore = defineStore('postStore', () => {
  const dataListStore = useDataListStore()
  const categories = ref<ICategory[]>([])
  const posts = ref<IPost[]>([])
  const rentedPosts = ref<IPost[]>([])
  const users = ref<IUser[]>([])
  const wards = ref<IWard[]>([])

  const getCategories = async () => {
    const response = await CommonService.getCategories()
    categories.value = response.data.data
  }

  const getPosts = async (params?: any) => {
    const response = await CommonService.getPosts(params)
    posts.value = response.data.data
    dataListStore.setTotal(response.data.total)
  }

  const getRentedPosts = async (params?: any) => {
    const response = await CommonService.getRentedPosts(params)
    rentedPosts.value = response.data.data
    dataListStore.setTotal(response.data.total)
  }

  const getPost = async (id: string) => {
    return CommonService.getPostById(id)
  }

  const getUsers = async () => {
    const response = await CommonService.getUsers()
    users.value = response.data.data
  }

  const getWards = async () => {
    const response = await CommonService.getWards()
    wards.value = response.data.data
  }

  const createPost = (post: IPostCreate) => {
    return CommonService.createPost(post)
  }

  const approvePost = (id: string) => {
    return CommonService.approvePost(id)
  }

  const denyPost = (id: string, reason: string) => {
    return CommonService.denyPost(id, reason)
  }

  const markAsRented = (id: string) => {
    return CommonService.markAsRented(id)
  }

  const updatePost = (id: string, post: IPostCreate) => {
    return CommonService.updatePostById(id, post)
  }

  const reset = () => {
    posts.value = []
    rentedPosts.value = []
    dataListStore.reset()
  }

  return {
    categories,
    posts,
    rentedPosts,
    users,
    wards,
    approvePost,
    createPost,
    denyPost,
    getCategories,
    getPost,
    getPosts,
    getRentedPosts,
    getUsers,
    getWards,
    markAsRented,
    reset,
    updatePost
  }
})
