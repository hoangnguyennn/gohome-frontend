import moment from 'moment'
import {
  Colors,
  PostVerifyStatuses,
  PostVerifyStatusTexts,
  UserTypes,
  UserTypeTexts,
  UserVerifyStatusTexts
} from '~/interfaces/enums'

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
      return UserTypeTexts.ROOT
    case UserTypes.ADMIN:
      return UserTypeTexts.ADMIN
    case UserTypes.EMPLOYEE:
      return UserTypeTexts.EMPLOYEE
  }
}

export const getUserTypeColor = (type?: UserTypes) => {
  switch (type) {
    case UserTypes.ROOT:
      return Colors.ERROR
    case UserTypes.ADMIN:
      return Colors.SUCCESS
    case UserTypes.EMPLOYEE:
      return Colors.DEFAULT
  }
}

export const getUserVerifyStatusColor = (isVerified?: boolean) => {
  if (isVerified) {
    return Colors.GREEN
  }

  return Colors.YELLOW
}

export const getUserVerifyStatusText = (isVerified?: boolean) => {
  if (isVerified) {
    return UserVerifyStatusTexts.VEFIRIED
  }

  return UserVerifyStatusTexts.UNVERIFY
}

export const getPostVerifyStatusColor = (verifyStatus?: PostVerifyStatuses) => {
  switch (verifyStatus) {
    case PostVerifyStatuses.PENDING:
      return Colors.WARNING
    case PostVerifyStatuses.APPROVED:
      return Colors.WARNING
    case PostVerifyStatuses.DENIED:
      return Colors.ERROR
    default:
      return Colors.WARNING
  }
}

export const getPostVerifyStatusText = (verifyStatus?: PostVerifyStatuses) => {
  switch (verifyStatus) {
    case PostVerifyStatuses.PENDING:
      return PostVerifyStatusTexts.PENDING
    case PostVerifyStatuses.APPROVED:
      return PostVerifyStatusTexts.APPROVED
    case PostVerifyStatuses.DENIED:
      return PostVerifyStatusTexts.DENIED
    default:
      return ''
  }
}
