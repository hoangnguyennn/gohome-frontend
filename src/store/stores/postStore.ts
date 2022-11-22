import { IPost, IPostCreate } from '~/interfaces'
import CommonService from '~/services/CommonService'
import { useDataListStore } from './dataListStore'

export const usePostStore = defineStore('postStore', () => {
  const dataListStore = useDataListStore()
  const posts = ref<IPost[]>([])
  const rentedPosts = ref<IPost[]>([])

  const getPosts = async () => {
    const response = await CommonService.getPosts()
    posts.value = response.data.data
    dataListStore.setTotal(response.data.total)
  }

  const getRentedPosts = async () => {
    const response = await CommonService.getRentedPosts()
    rentedPosts.value = response.data.data
    dataListStore.setTotal(response.data.total)
  }

  const getPost = async (id: string) => {
    return CommonService.getPostById(id)
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
    posts,
    rentedPosts,
    getPosts,
    getRentedPosts,
    getPost,
    createPost,
    approvePost,
    denyPost,
    markAsRented,
    updatePost,
    reset
  }
})
