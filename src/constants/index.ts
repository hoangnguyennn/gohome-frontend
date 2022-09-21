import { IMenuItem } from '../interfaces'

export const DISTRICT_TYPES = [
  {
    value: 'Quận',
    title: 'Quận'
  },
  {
    value: 'Huyện',
    title: 'Huyện'
  },
  {
    value: 'Thành phố',
    title: 'Thành phố'
  },
  {
    value: 'Thị xã',
    title: 'Thị xã'
  }
]

export const WARD_TYPES = [
  {
    value: 'Xã',
    title: 'Xã'
  },
  {
    value: 'Phường',
    title: 'Phường'
  },
  {
    value: 'Thị trấn',
    title: 'Thị trấn'
  }
]

export const menuItems: IMenuItem[] = [
  {
    id: '1',
    title: 'Loại nhà đất',
    children: [
      {
        id: '1_1',
        title: 'Danh sách',
        link: '/categories'
      },
      {
        id: '1_2',
        title: 'Thêm mới',
        link: '/categories/create'
      }
    ]
  },
  {
    id: '2',
    title: 'Quận huyện',
    children: [
      {
        id: '2_1',
        title: 'Danh sách',
        link: '/districts'
      },
      {
        id: '2_2',
        title: 'Thêm mới',
        link: '/districts/create'
      }
    ]
  },
  {
    id: '3',
    title: 'Xã phường',
    children: [
      {
        id: '3_1',
        title: 'Danh sách',
        link: '/wards'
      },
      {
        id: '3_2',
        title: 'Thêm mới',
        link: '/wards/create'
      }
    ]
  },
  {
    id: '4',
    title: 'Người dùng',
    children: [
      {
        id: '4_1',
        title: 'Danh sách',
        link: '/users'
      }
    ]
  }
]
