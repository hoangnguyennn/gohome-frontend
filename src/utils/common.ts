import { VALID_PASSWORD } from '~/constants/RegExp'
import { IImage } from '~/interfaces'
import { UserTypes } from '~/interfaces/enums'

export const isIImage = (object: any): object is IImage => {
  return ['id', 'url'].every((key) => key in object)
}

export const getAvatarLink = (filename: string): string => {
  return ''
}

export const getPostImageLink = (filename: string): string => {
  return ''
}

export const getFilename = (url: string): string => {
  return url.split('/').reverse()[0] || ''
}

export const isValidPassword = (password: string) => {
  return VALID_PASSWORD.test(password)
}

export const isAdmin = (type: UserTypes) => {
  return type === UserTypes.ROOT || type === UserTypes.ADMIN
}
