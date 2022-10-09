import { IMenuItem } from '~/interfaces'
import { UserTypes } from '~/interfaces/enums'
import { getUserTypeText } from '~/utils/formatter'

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

export const USER_TYPES = [
  {
    value: UserTypes.ROOT,
    title: getUserTypeText(UserTypes.ROOT)
  },
  {
    value: UserTypes.ADMIN,
    title: getUserTypeText(UserTypes.ADMIN)
  },
  {
    value: UserTypes.EMPLOYEE,
    title: getUserTypeText(UserTypes.EMPLOYEE)
  }
]

export const menuItems: IMenuItem[] = [
  {
    id: '5',
    title: 'Bài đăng',
    permissions: [UserTypes.ROOT, UserTypes.ADMIN, UserTypes.EMPLOYEE],
    children: [
      {
        id: '5_1',
        title: 'Danh sách',
        link: '/posts',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN, UserTypes.EMPLOYEE]
      },
      {
        id: '5_2',
        title: 'Danh sách (đã thuê)',
        link: '/posts/rented',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN, UserTypes.EMPLOYEE]
      },
      {
        id: '5_3',
        title: 'Thêm mới',
        link: '/posts/create',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN, UserTypes.EMPLOYEE]
      }
    ]
  },
  {
    id: '1',
    title: 'Loại nhà đất',
    permissions: [UserTypes.ROOT, UserTypes.ADMIN],
    children: [
      {
        id: '1_1',
        title: 'Danh sách',
        link: '/categories',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      },
      {
        id: '1_2',
        title: 'Thêm mới',
        link: '/categories/create',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      }
    ]
  },
  {
    id: '2',
    title: 'Quận huyện',
    permissions: [UserTypes.ROOT, UserTypes.ADMIN],
    children: [
      {
        id: '2_1',
        title: 'Danh sách',
        link: '/districts',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      },
      {
        id: '2_2',
        title: 'Thêm mới',
        link: '/districts/create',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      }
    ]
  },
  {
    id: '3',
    title: 'Xã phường',
    permissions: [UserTypes.ROOT, UserTypes.ADMIN],
    children: [
      {
        id: '3_1',
        title: 'Danh sách',
        link: '/wards',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      },
      {
        id: '3_2',
        title: 'Thêm mới',
        link: '/wards/create',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      }
    ]
  },
  {
    id: '4',
    title: 'Người dùng',
    permissions: [UserTypes.ROOT, UserTypes.ADMIN],
    children: [
      {
        id: '4_1',
        title: 'Danh sách',
        link: '/users',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      }
    ]
  }
]
