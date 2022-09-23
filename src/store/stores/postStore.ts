import { IPost, IPostCreate } from '~/interfaces'
import CommonService from '~/services/CommonService'

export const usePostStore = defineStore('postStore', () => {
  const posts = ref<IPost[]>([])
  const rentedPosts = ref<IPost[]>([])

  const getPosts = async () => {
    const response = await CommonService.getPosts()
    posts.value = response.data.posts
  }

  const getRentedPosts = async () => {
    const response = await CommonService.getRentedPosts()
    rentedPosts.value = response.data.posts
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

  return {
    posts,
    rentedPosts,
    getPosts,
    getRentedPosts,
    getPost,
    createPost,
    approvePost,
    denyPost,
    markAsRented
  }
})
