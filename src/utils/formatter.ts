import moment from 'moment'

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

export const toRawNumber = (value: string) => {
  return value.replace(/\D/g, '')
}
