import moment from 'moment'

export const toDateTime = (date: Date | string | number) => {
  return moment(date).format('DD/MM/YYYY HH:mm:ss')
}

export const toVND = (number: number | string) => {
  number = Number(number)
  if (isNaN(number)) return number

  return number.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}
