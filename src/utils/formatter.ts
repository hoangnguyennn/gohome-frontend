import moment from 'moment'
import { PostVerifyStatuses, UserTypes } from '~/interfaces/enums'

export const toDateTime = (date: Date | string | number) => {
  return moment(date).format('DD/MM/YYYY HH:mm:ss')
}

export const toVND = (number: number | string) => {
  const localNumber = Number(number)
  if (isNaN(localNumber)) return String(number)

  return number.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}

export const toVndPrefix = (number: number | string) => {
  const localNumber = Number(number)
  if (isNaN(localNumber)) return String(number)

  return `VND ${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const toAcreage = (number: number | string) => {
  const localNumber = Number(number)
  if (isNaN(localNumber)) return String(number)

  return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' m²'
}

export const toRawNumber = (value: string) => {
  return value.replace(/\D/g, '')
}

export const getUserTypeText = (type?: UserTypes) => {
  switch (type) {
    case UserTypes.ROOT:
      return 'ROOT'
    case UserTypes.ADMIN:
      return 'Quản trị viên'
    case UserTypes.EMPLOYEE:
      return 'Nhân viên'
  }
}

export const getUserTypeColor = (type?: UserTypes) => {
  switch (type) {
    case UserTypes.ROOT:
      return 'error'
    case UserTypes.ADMIN:
      return 'success'
    case UserTypes.EMPLOYEE:
      return 'default'
  }
}

export const getUserVerifyStatusColor = (isVerified?: boolean) => {
  if (isVerified) {
    return 'green'
  }

  return 'yellow'
}

export const getUserVerifyStatusText = (isVerified?: boolean) => {
  if (isVerified) {
    return 'Đã xác thực'
  }

  return 'Chưa xác thực'
}

export const getPostVerifyStatusColor = (verifyStatus?: PostVerifyStatuses) => {
  switch (verifyStatus) {
    case PostVerifyStatuses.PENDING:
      return 'warning'
    case PostVerifyStatuses.APPROVED:
      return 'success'
    case PostVerifyStatuses.DENIED:
      return 'error'
    default:
      return 'warning'
  }
}

export const getPostVerifyStatusText = (verifyStatus?: PostVerifyStatuses) => {
  switch (verifyStatus) {
    case PostVerifyStatuses.PENDING:
      return 'Chờ duyệt'
    case PostVerifyStatuses.APPROVED:
      return 'Đã duyệt'
    case PostVerifyStatuses.DENIED:
      return 'Đã từ chối'
    default:
      return ''
  }
}
