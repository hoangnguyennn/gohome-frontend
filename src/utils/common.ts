import { IImage } from '~/interfaces'

export const isIImage = (object: any): object is IImage => {
  return ['id', 'url'].every((key) => key in object)
}

export const getFilename = (url: string): string => {
  return url.split('/').reverse()[0] || ''
}
