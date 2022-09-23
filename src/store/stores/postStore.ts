import { IPost, IPostCreate } from '../../interfaces'
import CommonService from '../../services/CommonService'

export const usePostStore = defineStore('postStore', () => {
  const posts = ref<IPost[]>([])

  const getPosts = async () => {
    const response = await CommonService.getPosts()
    posts.value = response.data.posts
  }

  const getPost = async (id: string) => {
    return CommonService.getPostById(id)
  }

  const createPost = (post: IPostCreate) => {
    return CommonService.createPost(post)
  }

  return {
    posts,
    getPosts,
    getPost,
    createPost
  }
})
